import { createStore } from "../index";

describe("Store", () => {

  beforeAll(() => {
    jest.spyOn(global.console, 'error').mockImplementation(() => { });
  })

  afterAll(() => {
    global.console.error.mockRestore();
  });

  const jsonSpec = [
    {
      "id": "DATE_FILTER",
      "label": "Date filter",
      "setItemsOnMounted": true,
      "setDefaultFirstItem": true,
      "actions": [
        "INSTANT_FILTER"
      ]
    },
    {
      "id": "INSTANT_FILTER",
      "setItemsOnMounted": false,
      "setDefaultFirstItem": false,
      "default": 0,
      "actions": [],
      "redraw": true
    }
  ]

  const simpleJsonSpec = [{
    "id": "DATE_FILTER",
    "label": "Date filter",
  },
  ]

  const getValues = (id, value, store) => {
    return new Promise((resolve, reject) => {
      if (id != null) {
        resolve([])
      } else {
        reject()
      }
    })
  }

  it("should be able to create a store", async () => {
    const store = await createStore(jsonSpec, getValues, null, () => { });

    expect(store).toBeDefined();
    expect(store).not.toBeNull();
    expect(store.jsonSpec).toBe(jsonSpec);
    expect(store.observable).toBeDefined();
    expect(store.observable).not.toBeNull();
  });

  it("should throw error if store is not correct", () => {
    expect(createStore(null, () => { }, null, () => { })).rejects.toThrow("jsonSpec is not defined");
  });

  it("should create a correct observable", async () => {

    const store = await createStore(jsonSpec, getValues, null, () => { });
    const obs = store.observable;

    expect(obs).not.toBeNull();
    expect(obs).not.toBeUndefined();
    obs.forEach((el, index) => {
      expect(el.id).toBe(jsonSpec[index].id);
      expect(el.label).toBe(jsonSpec[index].label);
      expect(el.value).toBe(jsonSpec[index].default || null);
      expect(el.loading).toBe(false);
      expect(el.showed).toBe(true);
      expect(el.type).toBe(jsonSpec[index].type || "select");
      expect(el.default).toBe(jsonSpec[index].default);
      expect(el.group).toBe(jsonSpec[index].group || undefined);
      expect(el.redraw).toBe(jsonSpec[index].redraw || false);
      expect(el.setDefaultFirstItem).toBe(jsonSpec[index].setDefaultFirstItem || false);
      expect(el.setItemsOnMounted).toBe(jsonSpec[index].setItemsOnMounted || false);
    });
  });

  it("should trigger a the getValues method correctly", async () => {

    const store = await createStore(jsonSpec, getValues, null, () => { });

    expect(store.triggerGetValues("INSTANT_FILTER")).resolves.toStrictEqual([]);
    expect(store.triggerGetValues()).rejects.toBe(undefined);
  });

  it("should return the expected selector", async () => {
    const store = await createStore(jsonSpec, getValues, null, () => { });
    const index = 0;
    const selector = store.getSelector(jsonSpec[index].id);
    expect(selector.id).toEqual(jsonSpec[index].id);
    expect(selector.label).toEqual(jsonSpec[index].label);
    expect(selector.default).toEqual(jsonSpec[index].default);
    expect(selector.type).toEqual(jsonSpec[index].type || "select");
    expect(selector.value).toBeNull();
    expect(selector.sharedProps).toStrictEqual({ index: null });
    expect(selector.loading).toBe(false);
    expect(selector.showed).toBe(true);
    expect(selector.group).toEqual(jsonSpec[index].group);
    expect(selector.redraw).toEqual(jsonSpec[index].redraw || false);
    expect(selector.setDefaultFirstItem).toEqual(jsonSpec[index].setDefaultFirstItem || false);
    expect(selector.setItemsOnMounted).toEqual(jsonSpec[index].setItemsOnMounted || false);
    expect(selector.items.length).toEqual(0);
    expect(selector.actions.sort()).toEqual(jsonSpec[index].actions.sort());
  });

  it("should return expected items from getValues", async () => {
    const mockItems = ["mockItem1", "mockItem2"];
    const store = await createStore(simpleJsonSpec, () => new Promise(resolve => resolve(mockItems)), null, () => { });
    const el = store.getSelector("DATE_FILTER");

    const retrievedValues = await store.triggerGetValues("DATE_FILTER");
    expect(retrievedValues.sort()).toBe(mockItems.sort());
    expect(el.items.length).toBe(0);
  })

  it("should throw error callback is not a function on store creation", () => {
    expect(async () => createStore(simpleJsonSpec, getValues, null, null)).rejects.toThrow("callback is not a function");
  })

  it("should return expected UI object", async () => {
    const store = await createStore(simpleJsonSpec, getValues, null, () => { });
    const obj = store.getUI()[0];
    expect(obj.id).toBe(simpleJsonSpec[0].id);
    expect(obj.label).toBe(simpleJsonSpec[0].label);
    expect(obj.value).toBeNull();
    expect(obj.type).toBe('select');
    expect(obj.items.length).toBe(0);
  })

})
