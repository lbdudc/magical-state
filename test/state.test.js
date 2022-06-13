import { createStore } from "../index";

const jsonSpecAggregation = [
  {
    "id": "SPATIAL_AGGREGATION",
    "label": "Spatial Aggregation",
    "setItemsOnMounted": true,
    "setDefaultFirstItem": true,
    "default": 2,
  },
]

const jsonSpecAggregationFilter = [
  {
    "id": "SPATIAL_AGGREGATION",
    "label": "Spatial Aggregation",
    "setItemsOnMounted": true,
    "actions": ["SPATIAL_FILTER"]
  },
  {
    "id": "SPATIAL_FILTER",
    "label": "Spatial Filter",
    "setDefaultFirstItem": true,
    "actions": []
  },
]

const simpleJsonSpec = [{
  "id": "SPATIAL_AGGREGATION",
  "label": "Spatial Aggregation",
  "setDefaultFirstItem": true,
}]

const jsonSpectDefaultValue = [{
  "id": "SPATIAL_AGGREGATION",
  "label": "Spatial Aggregation",
  "setItemsOnMounted": true,
  "default": 2,
}]

const jsonSpecSetItemsDefault = [{
  "id": "SPATIAL_AGGREGATION",
  "label": "Spatial Aggregation",
  "default": 2,
}]

const jsonSpecSetItemsDefaultFirst = [{
  "id": "SPATIAL_AGGREGATION",
  "label": "Spatial Aggregation",
  "setDefaultFirstItem": true,
}]

const spatialItems = [{ label: "AUTONOMOUS_COMMUNITY", value: 1 }, { label: "PROVINCE", value: 2 }, { label: "MOCK", value: 3 }];

const getValues = (id, params, store) => {
  switch (id) {
    case "SPATIAL_AGGREGATION":
      return new Promise((resolve) => {
        resolve(spatialItems);
      });
  }
}

describe("storeState", () => {
  it("should set items on mounted", async () => {
    const store = await createStore(jsonSpecAggregation, getValues, null, () => { });
    const aggregation = store.getSelector("SPATIAL_AGGREGATION");
    expect(aggregation.items).toStrictEqual(spatialItems);
  });

  it("should set value on mounted", async () => {
    const store = await createStore(jsonSpecAggregation, getValues, null, () => { });
    const aggregation = store.getSelector("SPATIAL_AGGREGATION");
    expect(aggregation.value).toBe(spatialItems[0].value);
  });

  it("should set value to default", async () => {
    const store = await createStore(jsonSpectDefaultValue, getValues, null, () => { });
    const aggregation = store.getSelector("SPATIAL_AGGREGATION");
    expect(aggregation.value).toBe(spatialItems[1].value);
  });

  it("should set the state to the one passed on store creation", async () => {
    const store = await createStore(jsonSpecAggregation, getValues, { "SPATIAL_AGGREGATION": 3 }, () => { });
    const aggregation = store.getSelector("SPATIAL_AGGREGATION");
    expect(aggregation.value).toBe(spatialItems[2].value);
  });

  it("should set the state to default if setState value is null", async () => {
    const store = await createStore(jsonSpecAggregation, getValues, { "SPATIAL_AGGREGATION": null }, () => { });
    const aggregation = store.getSelector("SPATIAL_AGGREGATION");
    expect(aggregation.value).toBe(spatialItems[1].value);
  });

  it("should set the state to null if setState value is not found in items", async () => {
    const store = await createStore(jsonSpecAggregation, getValues, { "SPATIAL_AGGREGATION": 6 }, () => { });
    const aggregation = store.getSelector("SPATIAL_AGGREGATION");
    expect(aggregation.value).toBeNull();
  });

  it("should set value to null on setState if the selector has no items", async () => {
    const store = await createStore(jsonSpecAggregation, () => new Promise(resolve => resolve([])), { "SPATIAL_AGGREGATION": 3 }, () => { });
    const aggregation = store.getSelector("SPATIAL_AGGREGATION");
    expect(aggregation.value).toBeNull();
  });

  it("should set state using an URL", async () => {
    const store = await createStore(jsonSpecAggregation, getValues, "MD0x", () => { });
    const aggregation = store.getSelector("SPATIAL_AGGREGATION");
    expect(aggregation.value).toBe(spatialItems[0].value);
  });


  it("should not set state using empty string URL", async () => {
    const store = await createStore(simpleJsonSpec, getValues, "", () => { });
    const aggregation = store.getSelector("SPATIAL_AGGREGATION");
    expect(aggregation.value).toBeNull();
  });


  it("should not set items until setItems is called", async () => {
    const store = await createStore(simpleJsonSpec, getValues, null, () => { });
    const aggregation = store.getSelector("SPATIAL_AGGREGATION");

    expect(aggregation.items.length).toEqual(0);
    expect(aggregation.value).toBeNull;

    store.setItems("SPATIAL_AGGREGATION", spatialItems, false);
    expect(aggregation.items.length).toEqual(spatialItems.length);
    expect(aggregation.items.sort()).toEqual(spatialItems.sort());
    expect(aggregation.items.value).toBeUndefined();
  });

  it("should set items and default value based on the spec when calling setItems", async () => {
    const store = await createStore(jsonSpecSetItemsDefault, getValues, null, () => { });
    const aggregation = store.getSelector("SPATIAL_AGGREGATION");

    store.setItems("SPATIAL_AGGREGATION", spatialItems, true);
    expect(aggregation.items.sort()).toEqual(spatialItems.sort());
    expect(aggregation.value).toEqual(spatialItems[1].value);
  });

  it("should set items and value based on the spec when calling setItems", async () => {
    const store = await createStore(jsonSpecSetItemsDefaultFirst, getValues, null, () => { });
    const aggregation = store.getSelector("SPATIAL_AGGREGATION");

    store.setItems("SPATIAL_AGGREGATION", spatialItems, true);
    expect(aggregation.items.sort()).toEqual(spatialItems.sort());
    expect(aggregation.value).toEqual(spatialItems[0].value);
  });

  it("should set the value of the selector and set its items", async () => {
    const store = await createStore(simpleJsonSpec, getValues, null, () => { });
    await store.setSelector("SPATIAL_AGGREGATION", 1);
    const aggregation = store.getSelector("SPATIAL_AGGREGATION");
    expect(aggregation.items.sort()).toEqual(spatialItems.sort());
    expect(aggregation.value).toEqual(spatialItems[0].value);
  });

  it("should reject setSelector if desired value not found in selector items", async () => {
    const store = await createStore(simpleJsonSpec, getValues, null, () => { });
    expect(store.setSelector("SPATIAL_AGGREGATION", 50)).
      rejects.toEqual("The value 50 is not in the selector items, selector with SPATIAL_AGGREGATION not setted");
  });

  it("should set value from the actual selector items", async () => {
    const mockGetValues = jest.fn(() => { return Promise.resolve(spatialItems) });
    const store = await createStore(jsonSpecAggregation, mockGetValues, null, () => { });
    const aggregation = store.getSelector("SPATIAL_AGGREGATION");
    await store.setSelector("SPATIAL_AGGREGATION", 3);

    //check that getValues was called only once
    expect(mockGetValues).toHaveBeenCalledTimes(1);
    expect(aggregation.items.sort()).toEqual(spatialItems.sort());
    expect(aggregation.value).toEqual(3);
  });

  it("should getValues on setSelector if is deep even if selector already has items", async () => {
    const mockGetValues = jest.fn(() => { return Promise.resolve(spatialItems) });
    const store = await createStore(jsonSpecAggregation, mockGetValues, null, () => { });
    const aggregation = store.getSelector("SPATIAL_AGGREGATION");

    expect(aggregation.items.sort()).toEqual(spatialItems.sort());

    await store.setSelector("SPATIAL_AGGREGATION", 3, true);
    //check that getValues has been called again after store population
    expect(mockGetValues).toHaveBeenCalledTimes(2);
  });

  it("should change store's value to the selected one", async () => {
    const store = await createStore(jsonSpectDefaultValue, getValues, null, () => { });
    const aggregation = store.getSelector("SPATIAL_AGGREGATION");

    store.change("SPATIAL_AGGREGATION", 1);
    expect(aggregation.value).toBe(spatialItems[0].value);
  })

  it("should update childs items", async () => {
    const mockGetValues = jest.fn(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(spatialItems)
        }, 1500);
      })
    });
    const store = await createStore(jsonSpecAggregationFilter, mockGetValues, null, () => { });

    const filter = store.getSelector("SPATIAL_FILTER");
    expect(filter.items.length).toBe(0);

    await store.change("SPATIAL_AGGREGATION", 1);
    //expect 2 calls, one to retrieve aggregation items and another for the filter ones
    expect(mockGetValues).toHaveBeenCalledTimes(2);
    expect(filter.items.sort()).toEqual(spatialItems.sort());
    expect(filter.value).toBe(spatialItems[0].value);
  })

})