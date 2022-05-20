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
 * @param {String|Object} initialState
 * @returns {Array} a valid store
 */
const createStore = (jsonSpec, initialState) => {

  // Check if initialState is valid
  let parsedState = initialState ? initialState : [];
  if (typeof initialState === "string") {
    try {
      parsedState = decodeURL(initialState, jsonSpec);
    } catch (e) {
      throw new Error("initialState is not a valid url");
    }
  } else if (typeof initialState !== "object") {
    parsedState = []
  }

  return jsonSpec.map((el) => {
    const res = parsedState.find((state) => state.id === el.id);

    return {
      id: el.id,
      label: el.label,
      value: el.default != null ? el.default : null || res != null ? res.value : null || null,
      loading: false,
      showed: true,
      type: el.type || "select",
      default: el.default,
      group: el.group || null,
      redraw: el.redraw || false,
      setDefaultFirstItem: el.setDefaultFirstItem || false,
      setItemsOnMounted:
        el.setItemsOnMounted && el.setItemsOnMounted === true ? true : false,
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
  const el = findJsonSpecElement(element, jsonSpec);
  el.actions.forEach(child => {
    const childElement = findElementInObservable(child, obs);
    childElement.value = undefined;
    childElement.items = [];
  })
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
const getActionsValues = (el, newState, getValues, obs, jsonSpec) => {
  const act = [];
  findJsonSpecElement(el.id, jsonSpec).actions.forEach(async (action) => {
    act.push(
      new Promise(async (resolve, reject) => {
        // Get the element of the observable child
        // const obsItem = utils.findElementInObservable(el, this._observable);
        const res = await getValues(
          action,
          el.value,
          getStoreKeyValues(obs)
        );
        // Setear el value del hijo si se encuentra en la lista de items que les pasamos
        const foundChild = newState.find(child => child.id === action);
        // Set items and check if set value can be setted
        findElementInObservable(action, obs).items = res;
        if (foundChild) {
          const elem = findElementInObservable(foundChild.id, obs)
          if ((elem.items && elem.items.find(item => item.value === foundChild.value)) || elem.type === "date") {
            elem.value = foundChild.value
          } else {
            elem.value = null;
          }
        }
        resolve(res);
      })
    );
  });
  return Promise.all(act);
}

/**
 * It takes the store, maps it to an array of objects with the id, value, and index of each element,
 * filters out the elements that have no value, then maps the array to a string of key-value pairs, and
 * finally joins the array with an ampersand
 * @returns A string of the store's values, encoded in base64.
 */
const exportStoreEncodedURL = (obs) => {
  const parsedStore = obs.map((el, index) => {
    return { id: el.id, value: el.value, index: index }
  }).filter(el => el.value != null);

  return window.btoa(parsedStore.map(el => `${el.index}=${el.value}`).join("&"))
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

  const decodedObj = decodedArray.map(el => {
    const [key, value] = el.split("=");
    // Check if the value is an integer, else return string
    if (Number.isInteger(Number(value)))
      return { id: key, value: Number(value) };
    return { id: key, value: value };
  });
  return decodedObj
}

/**
 * It takes a URL, decodes it, and returns the equivalent Object of key/values
 * @param url - The encoded URL that you want to decode.
 * @returns An object with key/values decoded from the URL.
 */
const decodeURL = (url, spec) => {
  try {
    const decodedObj = parseUrl(url);
    return decodedObj.map(obj => {
      return {
        id: spec[obj.id].id,
        value: obj.value,
      }
    });
  } catch (error) {
    throw new Error(`Error parsing URL: ${error}`)
  }
}

const createCustomEvent = (nameEvent, detail) => {
  return new CustomEvent(nameEvent, { detail: detail });
}

export default {
  checkJsonSpec,
  findJsonSpecElement,
  findElementInObservable,
  createStore,
  createObservable,
  deleteObservable,
  isElementInRequiredField,
  resetDependedSelectors,
  getActionsValues,
  getStoreKeyValues,
  decodeURL,
  parseUrl,
  exportStoreEncodedURL,
  createCustomEvent
};
