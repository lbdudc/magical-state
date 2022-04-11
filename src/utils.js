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
      value: null,
      loading: false,
      showed: true,
      default: null,
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

export default {
  checkJsonSpec,
  findJsonSpecElement,
  findElementInObservable,
  createStore,
  createObservable,
  deleteObservable,
};
