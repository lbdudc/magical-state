import Store from "./src/store";

const createStore = async (jsonSpec, getValues, state, callback) => {
  const st = new Store(jsonSpec, getValues, null, callback);
  await st.loadStore(state)
  return st;
}

export { createStore, Store };
