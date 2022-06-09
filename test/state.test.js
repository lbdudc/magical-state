import { createStore } from "../index";

const jsonSpecAggregation = [{
  "id": "SPATIAL_AGGREGATION",
  "label": "Spatial Aggregation",
  "setItemsOnMounted": true,
  "setDefaultFirstItem": true,
  "default": 2,
}]

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

const spatialItems = [{ label: "AUTONOMOUS_COMMUNITY", value: 1 }, { label: "PROVINCE", value: 2 }, { label: "MOCK", value: 3 }];
const comunities = [{ label: "GALICIA", value: 1 }];
const provinces = [{ label: "A CORUÑA", value: 1 }];

const getValues = (id, params, store) => {
  switch (id) {
    case "SPATIAL_AGGREGATION":
      return new Promise((resolve) => {
        resolve(spatialItems);
      });
    case "SPATIAL_FILTER":
      switch (params["SPATIAL_AGGREGATION"]) {
        case 1:
          return new Promise((resolve) => {
            resolve(comunities);
          });
        case 2:
          return new Promise((resolve) => {
            resolve(provinces);
          });
      }
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


})