import Store from "./src/store";
import utils from "./src/utils";

const createStore = async (jsonSpec, getValues, state, callback) => {
  const st = new Store(jsonSpec, getValues, null, callback);
  await st.loadStore(state)
  return st;
}

const parseUrl = utils.decodeURL;

export { createStore, parseUrl };
