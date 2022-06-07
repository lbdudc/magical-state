import Store from "./src/store";

const createStore = async (jsonSpec, getValues, state, callback) => {
  const st = new Store(jsonSpec, getValues, state, callback);
  await st.loadStore()
  return st;
}

export { createStore, Store };
