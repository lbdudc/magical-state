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

const isValidState = (state) => {
  if (state == null) return false;
  if (typeof state === "string" && state === "") return false;
  if (Array.isArray(state)) return false;
  if (typeof state === "object" && Object.getPrototypeOf(state) !== Object.prototype) return false;
  return true;
}

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
      default: el.default,
      type: el.type || "select",
      value: el.type === "multiple" ? [] : null,
      sharedProps: {
        index: null
      },
      loading: false,
      showed: true,
      group: el.group,
      redraw: el.redraw === true,
      setDefaultFirstItem: el.setDefaultFirstItem === true,
      setItemsOnMounted: el.setItemsOnMounted && el.setItemsOnMounted === true,
      items: [],
      actions: el.actions || [],
    };
  });
};

/**
 * Creates an observable of an object
 * @param {Object} store
 * @returns a Proxy of the object
 */
const createObservable = (store) => {
  let obsStore = observable(store);
  observe(() => JSON.stringify(obsStore));
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
  const dataObj = {};
  store.forEach((el) => {
    dataObj[el.id] = el.value;
  });
  return dataObj;
};

/**
 * It takes an id, a json spec, and an observable, and returns an object with the key-value pairs of
 * the root elements of the json spec
 * @param id - the id of the element that was clicked
 * @param jsonSpec - the json spec that was passed in
 * @param obs - the observable object
 * @returns An object with the key value pairs of the root elements
 */
const getKeyValueRootElements = (id, jsonSpec, obs) => {
  const dataObj = {};
  dataObj[id] = findElementInObservable(id, obs).value;
  jsonSpec.forEach((el) => {
    if (el.actions != null) {
      const foundEl = el.actions.find((item) => item === id);
      const foundObsEl = findElementInObservable(el.id, obs);
      if (foundEl) dataObj[el.id] = foundObsEl.value;
    }
  });
  return dataObj;
};

/**
 * Resets the value of the selectors that have required this element
 * @param {String} element
 * @param {Object} jsonSpec
 * @param {Object} obs
 */
const resetDependedSelectors = (element, jsonSpec, obs) => {
  const el = findJsonSpecElement(element, jsonSpec);
  if (el.actions != null) {
    el.actions.forEach((child) => {
      const childElement = findElementInObservable(child, obs);
      childElement.value = undefined;
      childElement.items = [];
    });
  }
};

/**
 * Returns a promise that resolves when all the children
 * of the element are loaded
 * @param {Object} el root element
 * @param {Array} newState array of the new state to be set
 * @param {Function} impl function to get the items of the selectors
 * @param {Object} obs observable of the store
 * @param {Array} jsonSpec jsonSpec of the store
 * @returns a promise that resolves when all the children are fullfilled
 */
const getActionsValues = (id, newState, getValues, obs, jsonSpec) => {
  const act = [];
  const specActions = findJsonSpecElement(id, jsonSpec).actions;
  if (specActions != null) {
    specActions.forEach(async (action) => {
      act.push(
        new Promise(async (resolve, reject) => {
          // Get the element of the observable child
          // const obsItem = utils.findElementInObservable(el, this._observable);
          const res = await getValues(
            action,
            getKeyValueRootElements(id, jsonSpec, obs),
            getStoreKeyValues(obs)
          );
          // Setear el value del hijo si se encuentra en la lista de items que les pasamos
          const foundChild = newState[action];
          // Set items and check if set value can be setted
          findElementInObservable(action, obs).items = res;
          if (foundChild != null) {
            const elem = findElementInObservable(action, obs);
            if (
              (elem.items &&
                elem.items.find((item) => item.value === newState[action])) ||
              elem.type === "date"
            ) {
              elem.value = newState[action];
            } else {
              elem.value = null;
            }
          }
          resolve(res);
        })
      );
    });
  }
  return Promise.all(act);
};

/**
 * It takes the store, maps it to an array of objects with the id, value, and index of each element,
 * filters out the elements that have no value, then maps the array to a string of key-value pairs, and
 * finally joins the array with an ampersand
 * @returns A string of the store's values, encoded in base64.
 */
const exportStoreEncodedURL = (obs) => {
  const parsedStore = obs
    .map((el, index) => {
      return { id: el.id, value: el.value, index: index };
    })
    .filter((el) => el.value != null);

  return window.btoa(
    parsedStore.map((el) => `${el.index}=${el.value}`).join("&")
  );
};

/**
 * It takes a url, decodes it, splits it into an array, maps over the array and returns an object with
 * the key and value
 * @param url - The url that you want to parse
 * @returns An array of objects with the key and value of the decoded url
 */
const parseUrl = (url) => {
  const decoded = window.atob(url);
  const decodedArray = decoded.split("&");

  const decodedObj = decodedArray.map((el) => {
    const [key, value] = el.split("=");
    if (key == null || value == null) {
      return {};
    }
    // Check if the value is an integer, else return string
    if (Number.isInteger(Number(value)))
      return { id: key, value: Number(value) };
    return { id: key, value: value };
  });
  return decodedObj;
};

/**
 * It takes a URL, decodes it, and returns the equivalent Object of key/values
 * @param url - The encoded URL that you want to decode.
 * @returns An object with key/values decoded from the URL.
 */
const decodeURL = (url, spec) => {
  try {
    const decodedObj = parseUrl(url);
    const dataObj = {};
    decodedObj.forEach((obj) => {
      //TODO: encode and decode multiple selectors
      if (spec[obj.id] != null && spec[obj.id].type != "multiple") {
        dataObj[spec[obj.id].id] = obj.value;
      }
    });
    return dataObj;
  } catch (error) {
    console.error(`Error parsing URL: ${error}`);
    return {};
  }
};

/**
 * Takes an element of the observable and returns an object that contains only the
 * necessary information for it to be displayed
 * @param {Object} element of the observable
 * @returns an object to display the element on the ui
 */
const createUIObject = (element) => {
  return {
    id: element.id,
    label: element.label,
    value: element.value,
    type: element.type,
    items: element.items
  }
}

/**
 * Creates and dispatches a custom event
 * @param {String} nameEvent - name of the event
 * @param {Object} detail - the object to pass with the event
 */
const dispatchCustomEvent = (nameEvent, detail) => {
  const customEvent = new CustomEvent(nameEvent, { detail: detail });
  document.dispatchEvent(customEvent);
};

export default {
  checkJsonSpec,
  isValidState,
  findJsonSpecElement,
  findElementInObservable,
  createStore,
  createObservable,
  deleteObservable,
  resetDependedSelectors,
  getActionsValues,
  getStoreKeyValues,
  getKeyValueRootElements,
  decodeURL,
  parseUrl,
  exportStoreEncodedURL,
  dispatchCustomEvent,
  createUIObject
};
