import utils from "./utils";

export default class Store {
  constructor(jsonSpec, implementationInterface, callback) {
    this._jsonSpec = jsonSpec;
    this._store = {};
    this._observable = null;
    this._callback = callback;
    this._implementationInterface = implementationInterface;

    // TODO check if the jsonSpec is valid
    utils.checkJsonSpec(this._jsonSpec);
    this._store = utils.createStore(this._jsonSpec);
    this._observable = utils.createObservable(this._store);
    this._populateStore();
  }

  get jsonSpec() {
    return this._jsonSpec;
  }

  get observable() {
    return this._observable;
  }

  /**
   * Populates the store with the initial values
   * If the selector has the property "setItemsOnMounted" setted to true,
   * we call the update function
   */
  async _populateStore() {
    this._observable.forEach((el) => {
      if (el.setItemsOnMounted) {
        this._updateSelector(el.id);
      }
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
    const res = await this._implementationInterface.getValues(el.id);

    // Check if the element needs to set in value the first item retrieved
    this._setDefaultFirstItem(el, res);

    // Set the items into the selector and ends the loading state
    el.items = res;
    el.loading = false;

    // If the element has a redraw property and does not have children,
    // call the callback funct
    if (
      el.redraw &&
      utils.findJsonSpecElement(propId, this._jsonSpec).actions.length === 0
    )
      this._callback();
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
    let requiredFields = true;

    // Reset values of the depending selectors (if has any)
    utils.resetDependedSelectors(propId, this._jsonSpec, this._observable);

    // For each children, create a new Promise calling the update function
    const act = [];
    actions?.forEach((el) => {
      // If the element has a required field property
      // and its not selected, we dont do anything
      requiredFields = utils.isElementInRequiredField(
        el,
        this._jsonSpec,
        this._observable
      );

      if (requiredFields) {
        act.push(
          new Promise(async (resolve, reject) => {
            // Get the element of the observable child
            const obsItem = utils.findElementInObservable(el, this._observable);

            // If a child need to be redrawn, we set the needsRedraw property to true for later
            if (obsItem.redraw) needsRedraw = true;

            // Set the loading state of the child to true
            // Await for the implementation to get the items
            obsItem.loading = true;
            const res = await this._implementationInterface.getValues(
              el,
              newVal,
              utils.getStoreKeyValues(this._observable)
            );

            // Set the items into the selector and end the loading state
            obsItem.value = obsItem.default;
            this._setDefaultFirstItem(obsItem, res);
            obsItem.items = res;
            obsItem.loading = false;
            resolve(res);
          })
        );
      }
    });

    // Await for all the promises in the children to be resolved
    Promise.all(act)
      .then((res) => {
        // If the element has a redraw property, call the callback funct
        if (needsRedraw) this._callback();
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
}
