import utils from "./utils";

export default class Store {
  constructor(jsonSpec, getValues, initialState, callback) {
    this._jsonSpec = jsonSpec;
    this._store = {};
    this._observable = null;
    this._state = {
      loading: true,
    }

    if (typeof callback !== "function")
      throw new Error("callback is not a function");

    this._callback = callback;
    this._getValues = getValues;

    // TODO check if the jsonSpec is valid
    utils.checkJsonSpec(this._jsonSpec);
    this._store = utils.createStore(this._jsonSpec, initialState);
    this._observable = utils.createObservable(this._store);

    // If initialState is defined, we have to set a new state
    if (utils.isValidState(initialState)) {
      if (typeof initialState === "string") {
        // If the new state is a string, we have to decode it first
        this.setState(this._decodeURL(initialState, this.jsonSpec), false);
      } else {
        this.setState(initialState, false);
      }
      // If not, we populate the store with the default values
    } else {
      this._populateStore();
    }
  }

  get jsonSpec() {
    return this._jsonSpec;
  }

  get observable() {
    return this._observable;
  }

  get state() {
    return this._state;
  }

  /**
   * It takes a URL and returns an object with the URL's components
   * @param {String} url - The URL to parse.
   * @returns an object with the URL's components
   */
  static parseUrl(url, jsonSpec) {
    if (url == null || url === "")
      return {}
    return utils.decodeURL(url, jsonSpec);
  }

  /**
   * Returns the actual state of the store, formated like an object
   * (its going to be used to send this as query params to update the URL)
   */
  get objFromObservable() {
    return this._observable.reduce(
      (obj, cur) => ({ ...obj, [cur.id]: cur.value }),
      Object.create(Object.prototype)
    )
  }

  /**
   * It returns the encoded URL of the store.
   * @returns A string of the store's values, encoded in base64.
   */
  exportStoreEncodedURL() {
    return utils.exportStoreEncodedURL(this._observable)
  }

  /**
   * It takes a URL, decodes it, and then updates the state of the store
   * @param url - The URL to import.
   */
  async importStoreEncodedURL(url) {
    const decodedUrl = utils.decodeURL(url, this._observable);
    await this.setState(decodedUrl);
  }

  /**
   * It takes a URL and returns a decoded URL
   * @param url - The URL to decode.
   * @returns The decoded URL.
   */
  _decodeURL(url, spec) {
    return utils.decodeURL(url, !!spec ? spec : this._store);
  }

  /**
   * Gets the observable of a given selector id
   * @param {String} id
   * @returns the observable of the selector
   */
  getSelector(id) {
    return this._observable.find(el => el.id === id);
  }

  /**
   * Sets the value of a selector
   * @param id - the id of the selector
   * @param value - The value to be set
   */
  async setSelector(id, value) {
    const obs = utils.findElementInObservable(id, this._observable);
    let newItems = [];

    // If there are no items in the selector, we force getValues
    if ((obs.items == null || obs.items.length == 0) && (obs.type === "select")) {
      newItems = await this._getValues(id);
    }

    if (
      (obs.items && obs.items.find(el => el.id = value) != null) ||
      (newItems && newItems.find(el => el.id = value) != null) ||
      (obs.type === "date") ||
      (value == null)) {

      obs.value = value;
      this.change(obs.id, value);
    }
  }

  /**
   * Populates the store with the initial values
   * If the selector has the property "setItemsOnMounted" setted to true,
   * we call the update function
   */
  async _populateStore() {
    this._observable.forEach(async (el) => {
      if (el.setItemsOnMounted) {
        await this._updateSelector(el.id);
      }
    });
    this._state.loading = false;
  }

  /**
   * Updates a selector with items received from the implementation
   * @param {String} propId The id of the selector
   */
  async _updateSelector(propId) {
    // Get the element of the observable and sets to loading state
    const el = utils.findElementInObservable(propId, this._observable);
    el.loading = true;

    // Await for the implementation to get the items
    const res = await this._getValues(
      el.id,
      utils.getKeyValueRootElements(el.id, this._jsonSpec, this._observable)
    );

    // Check if the element needs to set in value the first item retrieved
    this._setDefaultFirstItem(el, res);

    // Set the items into the selector and ends the loading state
    el.items = res;
    el.loading = false;
    utils.dispatchCustomEvent("itemsLoaded", utils.createUIObject(el));

    // If the element has a redraw property and does not have children,
    // call the callback funct
    if (
      el.redraw &&
      el._setDefaultFirstItem &&
      utils.findJsonSpecElement(propId, this._jsonSpec).actions.length === 0
    ) {
      this._state.loading = false;

      const dataObj = {};
      this._observable.filter(el => el.value != null).forEach(el => (dataObj[el.id] = el.value))
      this._callback(dataObj);
    }
  }


  /**
   * Changes the general state of all the selectors passed
   * @param {Array} newState [{id: selectorId, value: newValue}]
   * @param {Boolean} executeCallback
   * @param {Function} customCallback
   */
  async setState(newState, executeCallback, customCallback) {
    this._state.loading = true;
    let set = [];

    this._observable.forEach(async (el) => {
      // first check if we can change de value (appears in the items)
      const selector = utils.findElementInObservable(el.id, this._observable);
      set.push(new Promise(async (resolve) => {
        const res = await this._getValues(
          el.id,
          utils.getKeyValueRootElements(el.id, this._jsonSpec, this._observable)
        );
        selector.items = res;

        // Value is in the new State, or is default
        const newStateObjValue = newState[el.id];
        const newVal = newStateObjValue != null ? newStateObjValue : el.default

        if ((selector.items && selector.items.find(item => item.value === newVal)) || selector.type === "date") {
          selector.value = newVal;
        } else {
          selector.value = null;
        }
        utils.dispatchCustomEvent("itemsLoaded", utils.createUIObject(selector));
        await (utils.getActionsValues(el.id, newState, this._getValues, this._observable, this._jsonSpec));
        resolve();
      })
      )
    });

    return Promise.all(set).then(() => {
      this._state.loading = false;
      if (executeCallback) {
        const fn = customCallback || this._callback;
        const dataObj = {};
        this._observable.filter(el => el.value != null).forEach(el => (dataObj[el.id] = el.value))
        fn(dataObj);
      }
    });
  }

  /**
   * Calls the callbacks of the elements that depend on the element that has changed
   * @param {String} propId
   * @param {Any} newVal
   */
  async change(propId, newVal) {
    // Get the element of the jsonSpec
    const el = utils.findJsonSpecElement(propId, this._jsonSpec);
    const actions = el.actions;
    let needsRedraw = el.redraw;
    const obs = utils.findElementInObservable(propId, this._observable);
    obs.value = newVal;

    // Reset values of the depending selectors (if has any)
    utils.resetDependedSelectors(propId, this._jsonSpec, this._observable);
    // For each children, create a new Promise calling the update function
    const act = [];
    actions.forEach((el) => {
      act.push(
        new Promise(async (resolve, reject) => {
          // Get the element of the observable child
          const obsItem = utils.findElementInObservable(el, this._observable);

          // If a child need to be redrawn, we set the needsRedraw property to true for later
          if (obsItem.redraw) needsRedraw = true;

          // Set the loading state of the child to true
          // Await for the implementation to get the items
          obsItem.loading = true;
          const res = await this._getValues(
            el,
            utils.getKeyValueRootElements(el, this._jsonSpec, this._observable),
            utils.getStoreKeyValues(this._observable)
          );

          // Set the items into the selector and end the loading state
          obsItem.value = obsItem.default || null;
          obsItem.items = res;
          this._setDefaultFirstItem(obsItem, res);
          obsItem.loading = false;
          utils.dispatchCustomEvent("itemsLoaded", utils.createUIObject(obsItem));
          resolve(res);
        })
      );

    });

    // Await for all the promises in the children to be resolved
    Promise.all(act)
      .then((res) => {
        // Emitting event selector changed
        utils.dispatchCustomEvent("change", { id: el.id, value: newVal, store: this._store });

        // If the element has a redraw property, call the callback funct
        if (needsRedraw) {
          const dataObj = {};
          this._observable.filter(el => el.value != null).forEach(el => (dataObj[el.id] = el.value))
          this._callback(dataObj);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  /**
   * Checks if the selector should be setted with the first element of the list
   * then sets it
   * @param {Object} observable
   * @param {Array} items
   */
  _setDefaultFirstItem(observable, items) {
    if (observable.setDefaultFirstItem && items && items.length > 0) {
      observable.value = items[0].value;
      // If we update the value of the selector, we need to call its updated event
      this.change(observable.id, items[0].value);
    }
  }

  /**
   * Returns a list of objects that contains the basic information about every observable element
   * so they can be displayed on the UI
   * @returns A list of objects
   */
  getUI() {
    return this._observable.map((el) => {
      return utils.createUIObject(el);
    })
  }
}
