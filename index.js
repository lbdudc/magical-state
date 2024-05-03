import Store from "./src/store";
import utils from "./src/utils";

const createStore = async (
  jsonSpec,
  valuesHandler,
  state,
  callback,
  onError = (err) => {
    throw new Error(err);
  }
) => {
  const { getValues, defaultValuesGetter } = valuesHandler;
  const st = new Store(
    jsonSpec,
    getValues,
    defaultValuesGetter,
    callback,
    onError
  );
  return st.loadStore(state);
};

const parseUrl = utils.decodeURL;

export { createStore, parseUrl };
