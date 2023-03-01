import utils from "./utils";

export default class Store {
  constructor(jsonSpec, getValues, defaultValuesGetter, callback) {
    this._jsonSpec = jsonSpec;
    this._store = {};
    this._observable = null;
    this._state = {
      loading: true,
    };
    this._isWaitingForRedraw = false;

    if (typeof callback !== "function")
      throw new Error("callback is not a function");

    this._callback = callback;
    this._getValues = getValues;
    this._defaultValuesGetter = defaultValuesGetter;

    // TODO check if the jsonSpec is valid
    utils.checkJsonSpec(this._jsonSpec);
    this._store = utils.createStore(this._jsonSpec);
    this._observable = utils.createObservable(this._store);
  }

  async loadStore(initialState) {
    return new Promise(async (resolve, reject) => {
      try {
        // If initialState is defined, we have to set a new state
        if (utils.isValidState(initialState)) {
          if (typeof initialState === "string") {
            // If the new state is a string, we have to decode it first
            await this.setState(
              this._decodeURL(initialState, this.jsonSpec),
              false
            );
          } else {
            await this.setState(initialState, false);
          }
          // If not, we populate the store with the default values
        } else {
          await this._populateStore();
        }
        resolve(this);
      } catch (err) {
        reject(err);
      }
    });
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
   * Returns the actual state of the store, formated like an object
   * (its going to be used to send this as query params to update the URL)
   */
  get objFromObservable() {
    return this._observable.reduce(
      (obj, cur) => ({ ...obj, [cur.id]: cur.value }),
      Object.create(Object.prototype)
    );
  }

  /**
   *
   * @param {String} selectorId id of the selector that has errors
   * @param {Boolean} value
   */
  setHasErrors(selectorId, value) {
    this.getSelector(selectorId).hasErrors = value;
  }

  /**
   * It returns the encoded URL of the store.
   * @returns A string of the store's values, encoded in base64.
   */
  exportStoreEncodedURL() {
    return utils.exportStoreEncodedURL(this._observable);
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
    return this._observable.find((el) => el.id === id);
  }

  /**
   * It's a function that returns a promise that resolves to the result of calling the `_getValues`
   * function
   * @param id - The id of the form you want to get the values from.
   * @returns the result of the async function.
   */
  async triggerGetValues(id, params) {
    try {
      return await this._getValues(id, params);
    } catch (err) {
      console.error(`Error on getValues method: ${err}`);
      throw err;
    }
  }

  /**
   * Sets the value of a selector
   * @param id - the id of the selector
   * @param value - The value to be set
   * @param deep - If true, it will force to getValues for the selector
   */
  setSelector(id, value, deep = false, triggerCallbak = true) {
    return new Promise(async (resolve, reject) => {
      const obs = utils.findElementInObservable(id, this._observable);
      obs.loading = true;
      let newItems = [];

      // If there are no items in the selector or is deep, we force getValues
      if (deep || obs.items == null || obs.items.length == 0) {
        newItems = await this._getValues(
          id,
          utils.getKeyValueRootElements(id, this._jsonSpec, this._observable)
        );
        //If there are new items we set them in the observable
        if (newItems != null && newItems.length != 0) obs.items = newItems;
      }

      try {
        obs.loading = false;
        await this.change(obs.id, value, triggerCallbak);
      } catch (err) {
        reject(err);
      }
      resolve();
    });
  }

  /**
   * Populates the store with the initial values
   * If the selector has the property "setItemsOnMounted" set to true,
   * we call the update function
   */
  async _populateStore() {
    return new Promise((resolve, reject) => {
      const promises = [];
      this._observable.forEach(async (el) => {
        if (el.setItemsOnMounted) {
          promises.push(
            new Promise(async (resolve, reject) => {
              try {
                const res = await this._updateSelector(el.id);
                resolve(res);
              } catch (error) {
                reject(error);
              }
            })
          );
        }
      });
      Promise.all(promises)
        .then((res) => {
          this._state.loading = false;
          resolve(res);
        })
        .catch((err) => reject(err));
    });
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

    // Check if the element needs to set a default value
    try {
      const newVal = await this._defaultValuesGetter(
        propId,
        res,
        this.objFromObservable,
        null
      );
      await this.change(propId, newVal, false);
    } catch (err) {
      throw err;
    }

    // Set the items into the selector and ends the loading state
    el.items = res;
    el.loading = false;
    utils.dispatchCustomEvent("itemsLoaded", utils.createUIObject(el));

    return el;
  }

  /**
   * Changes the general state of all the selectors passed
   * @param {Array} newState {selectorId: newValue}
   * @param {Boolean} executeCallback
   * @param {Function} customCallback
   */
  async setState(newState, executeCallback, customCallback) {
    this._state.loading = true;
    let set = [];

    this._observable.forEach(async (el) => {
      // first check if we can change de value (appears in the items)
      const selector = utils.findElementInObservable(el.id, this._observable);
      set.push(
        new Promise(async (resolve) => {
          const res = await this._getValues(el.id, newState);
          selector.items = res;

          // Value is in the new State, or is default
          const newStateObjValue = newState[el.id];
          let newVal = newStateObjValue != null ? newStateObjValue : null;

          if (newVal === "true") newVal = true;
          if (newVal === "false") newVal = false;

          selector.value = newVal;

          utils.dispatchCustomEvent(
            "itemsLoaded",
            utils.createUIObject(selector)
          );
          resolve();
        })
      );
    });

    return new Promise((resolve) => {
      Promise.all(set).then(() => {
        this._state.loading = false;
        if (executeCallback) {
          const fn = customCallback || this._callback;
          const dataObj = {};
          this._observable
            .filter((el) => el.value != null)
            .forEach((el) => (dataObj[el.id] = el.value));
          fn(dataObj).then(() => {
            utils.dispatchCustomEvent("redrawFullfilled", { id: null });
            resolve();
          });
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Changes the value of the indicated selector and its dependent ones.
   * It also triggers the callback in case any of these selectors has the prop
   * callback to true
   * @param {String} propId
   * @param {Any} newVal
   * @param {Boolean} needsRedraw
   */
  async change(propId, newVal, needsRedraw = true) {
    return new Promise((resolve, reject) => {
      // Get the element of the jsonSpec
      const el = utils.findJsonSpecElement(propId, this._jsonSpec);
      let hasRedrawProp = el.redraw;
      const obs = utils.findElementInObservable(propId, this._observable);

      obs.value = newVal;
      // Reset values of the depending selectors (if has any)
      hasRedrawProp =
        hasRedrawProp ||
        utils.resetDependedSelectors(
          propId,
          this._jsonSpec,
          this._observable
        ) ||
        this._isWaitingForRedraw;

      // setting it to false on parent element before the childs are processed
      if (this._isWaitingForRedraw && !utils.storeHasErrors(this._observable)) {
        this._isWaitingForRedraw = false;
      }

      // For each children, create a new Promise calling the update function
      const act = [];
      obs.actions.forEach((el) => {
        // Get the element of the observable child
        const obsItem = utils.findElementInObservable(el, this._observable);

        act.push(
          new Promise(async (resolve, reject) => {
            // Set the loading state of the child to true
            // Await for the implementation to get the items
            obsItem.loading = true;
            const res = await this._getValues(
              el,
              utils.getKeyValueRootElements(
                el,
                this._jsonSpec,
                this._observable
              ),
              utils.getStoreKeyValues(this._observable)
            );
            const prevVal = obsItem.value;
            obsItem.items = res;
            const newVal = await this._defaultValuesGetter(
              obsItem.id,
              obsItem.items,
              this.objFromObservable,
              prevVal
            );

            // If a child need to be redrawn and is setting a new value, we set the hasRedrawProp property to true for later
            if (obsItem.redraw && !!newVal) {
              hasRedrawProp = true;
            }

            // set hasRedrawProp according to the promise returned when executing change() on its children
            hasRedrawProp = (await this.change(obsItem.id, newVal, false))
              ? true
              : hasRedrawProp;

            obsItem.loading = false;
            utils.dispatchCustomEvent(
              "itemsLoaded",
              utils.createUIObject(obsItem)
            );
            resolve(res);
          })
        );
      });

      // Await for all the promises in the children to be resolved
      Promise.all(act)
        .then((res) => {
          // Emitting event selector changed
          utils.dispatchCustomEvent("change", {
            id: el.id,
            value: newVal,
            store: this._store,
          });
          if (utils.storeHasErrors(this._observable)) {
            //Emitting event so the components can check if they should change their error status
            utils.dispatchCustomEvent("checkErrors");
          }
          // If the element has a redraw property, call the callback funct
          if (hasRedrawProp && needsRedraw) {
            if (utils.storeHasErrors(this._observable)) {
              this._isWaitingForRedraw = true;
            } else {
              const dataObj = {};
              this._observable
                .filter((el) => el.value != null)
                .forEach((el) => (dataObj[el.id] = el.value));
              this._callback(dataObj).then(() =>
                utils.dispatchCustomEvent("redrawFullfilled", { id: el.id })
              );
            }
          }
          resolve(hasRedrawProp);
        })
        .catch((err) => {
          console.error(err);
          reject(err);
        });
    });
  }

  /**
   * Returns a list of objects that contains the basic information about every observable element
   * so they can be displayed on the UI
   * @returns A list of objects
   */
  getUI() {
    return this._observable.map((el) => {
      return utils.createUIObject(el);
    });
  }

  /**
   * Sets the items of the specified store element to the parameter 'values'
   * @param {String} id
   * @param {Array} values new values to set
   * @param {Boolean} useSpecConfig flag that indicates if the store should check the spec to set a value or not
   */
  async setItems(id, values, useSpecConfig) {
    const el = utils.findElementInObservable(id, this._observable);
    el.items = values;
    const newVal = await this._defaultValuesGetter(
      obsItem.id,
      obsItem.items,
      this.objFromObservable,
      prevVal
    );
    await this.change(propId, newVal, false);
  }
}
