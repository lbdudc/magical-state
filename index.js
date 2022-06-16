import Store from "./src/store";
import utils from "./src/utils";

const createStore = async (jsonSpec, getValues, state, callback) => {
  const st = new Store(jsonSpec, getValues, null, callback);
  return st.loadStore(state);
}

const parseUrl = utils.decodeURL;

export { createStore, parseUrl };
