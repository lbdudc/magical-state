import Store from "./src/store";
import utils from "./src/utils";

const createStore = async (jsonSpec, valuesHandler, state, callback) => {
  const { getValues, defaultValuesGetter } = valuesHandler;
  const st = new Store(jsonSpec, getValues, defaultValuesGetter, callback);
  return st.loadStore(state);
};

const parseUrl = utils.decodeURL;

export { createStore, parseUrl };
