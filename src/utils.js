import { unobserve, observable, observe } from "@nx-js/observer-util";

/**
 * Checks if the jsonSpec is valid
 * For example: Doesnt have circular dependencies
 */
const checkJsonSpec = (jsonSpec) => {
  if (!jsonSpec) {
    throw new Error("jsonSpec is not defined");
  }
};

/**
 * Finds an elemenet in the jsonSpec
 * @param {String} propId
 * @returns {Object} with the element or null if not found
 */
const findJsonSpecElement = (propId, jsonSpec) => {
  return jsonSpec.find((el) => el.id === propId);
};

/**
 * Finds an element in the observable with the id
 * @param {String} propId  The id of the element
 * @returns {Object} with the element or null if not found
 */
const findElementInObservable = (propId, observable) => {
  return observable.find((el) => el.id === propId);
};

/**
 * Formats the jsonSpec into a valid store
 * @param {Array} jsonSpec
 * @returns {Array} a valid store
 */
const createStore = (jsonSpec) => {
  return jsonSpec.map((el) => {
    return {
      id: el.id,
      label: el.label,
      value: el.default,
      loading: false,
      showed: true,
      default: el.default,
      group: el.group || null,
      redraw: el.redraw || false,
      setDefaultFirstItem: el.setDefaultFirstItem || false,
      setItemsOnMounted: el.setItemsOnMounted === false ? false : true,
      items: [],
    };
  });
};

/**
 * Creates an observable of an object
 * @param {Object} store
 * @returns a Proxy of the object
 */
const createObservable = (store) => {
  let obsStore = null;
  obsStore = observable(store);
  observe(() => {
    JSON.stringify(obsStore);
  });
  return obsStore;
};

/**
 * Deletes the observable proxy
 * @param {Proxy} observable
 */
const deleteObservable = (observable) => {
  unobserve(observable);
};

/**
 * Returns a list of objects that contain the id and value of each store element
 * @param {*} store
 * @returns list of objects
 */
const getStoreKeyValues = (store) => {
  return store.map((el) => {
    return { id: el.id, value: el.value };
  });
};

/**
 * Checks if the element has required elements with null values
 * @param {String} element
 * @param {Object} jsonSpec
 * @param {Object} obs
 * @returns false if the element has required elements with null values
 */
const isElementInRequiredField = (element, jsonSpec, obs) => {
  const childElement = findJsonSpecElement(element, jsonSpec);
  if (childElement.required != null) {
    for (let index = 0; index < childElement.required.length; index++) {
      const element = childElement.required[index];
      if (findElementInObservable(element, obs).value == null) return false;
    }
  }
  return true;
};

/**
 * Resets the value of the selectors that have required this element
 * @param {String} element
 * @param {Object} jsonSpec
 * @param {Object} obs
 */
const resetDependedSelectors = (element, jsonSpec, obs) => {
  jsonSpec.forEach((specElement) => {
    if (specElement.required && specElement.length !== 0) {
      const act = specElement.required.find((action) => action === element);
      if (act) {
        const obsElement = findElementInObservable(specElement.id, obs);
        obsElement.value = null;
      }
    }
  });
};

export default {
  checkJsonSpec,
  findJsonSpecElement,
  findElementInObservable,
  createStore,
  createObservable,
  deleteObservable,
  isElementInRequiredField,
  resetDependedSelectors,
  getStoreKeyValues,
};
