import { createStore } from "../..";

const jsonSpecMultiple = [{
  "id": "SPATIAL_AGGREGATION",
  "label": "Spatial Aggregation",
  "type": "multiple",
  "setItemsOnMounted": true,
  "setDefaultFirstItem": true,
}]

const jsonSpectDefaultValue = [{
  "id": "SPATIAL_AGGREGATION",
  "label": "Spatial Aggregation",
  "setItemsOnMounted": true,
  "type": "multiple",
  "default": [2, 1],
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

describe("multipleSelector", () => {

  it("element value should be of type array", async () => {
    const store = await createStore(jsonSpecMultiple, getValues, null, () => { });
    const aggregation = store.getSelector("SPATIAL_AGGREGATION");
    expect(Array.isArray(aggregation.value)).toBe(true);
    expect(aggregation.value.sort()).toEqual([1].sort());
  })

  it("should set value to default", async () => {
    const store = await createStore(jsonSpectDefaultValue, getValues, null, () => { });
    const aggregation = store.getSelector("SPATIAL_AGGREGATION");
    expect(aggregation.value.length).toBe(2);
    expect(aggregation.value.sort()).toEqual([2, 1].sort());
    expect()
  });
})