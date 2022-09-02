import { createStore } from "../index";

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
    "redraw": true,
    "actions": []
  },
]

const spatialItems = [{ label: "AUTONOMOUS_COMMUNITY", value: 1 }, { label: "PROVINCE", value: 2 }, { label: "MOCK", value: 3 }];

const mockCallback = jest.fn(() => { return Promise.resolve() });


const getValues = (id, params, store) => {
  return new Promise((resolve) => {
    resolve(spatialItems);
  });
}

describe("errors", () => {

  it("should set hasErrors to false on creation", async () => {
    const store = await createStore(jsonSpecAggregationFilter, getValues, null, mockCallback);
    const filter = store.getSelector("SPATIAL_AGGREGATION");
    expect(filter.hasErrors).toBe(false);
  })

  it("should not trigger callback", async () => {
    const store = await createStore(jsonSpecAggregationFilter, getValues, null, mockCallback);
    const filter = store.getSelector("SPATIAL_AGGREGATION");
    filter.hasErrors = true;
    store.change("SPATIAL_FILTER", 0);
    expect(mockCallback).not.toHaveBeenCalled()
  })

  it("should set hasErrors to true", async () => {
    const store = await createStore(jsonSpecAggregationFilter, getValues, null, mockCallback);
    store.setHasErrors("SPATIAL_AGGREGATION", true);
    const filter = store.getSelector("SPATIAL_AGGREGATION");
    expect(filter.hasErrors).toBe(true);
  })

  it("should set _isWaitingForRedraw to false on creation", async () => {
    const store = await createStore(jsonSpecAggregationFilter, getValues, null, mockCallback);
    expect(store._isWaitingForRedraw).toBe(false);
  })

  it("should set _isWaitingForRedraw to true on change when there are errors present", async () => {
    const store = await createStore(jsonSpecAggregationFilter, getValues, null, mockCallback);
    store.setHasErrors("SPATIAL_AGGREGATION", true);
    await store.change("SPATIAL_FILTER", 0);
    expect(store._isWaitingForRedraw).toBe(true);
  })

  it("should trigger callback once the error is solved", async () => {
    const store = await createStore(jsonSpecAggregationFilter, getValues, null, mockCallback);
    store.setHasErrors("SPATIAL_AGGREGATION", true);
    // spatial filter has redraw prop but doesnt trigger callback
    await store.change("SPATIAL_FILTER", 0);

    //setting aggregation to no errors so that when it changes the callback should be triggered
    //even though this selector has no redraw prop
    store.setHasErrors("SPATIAL_AGGREGATION", false);
    await store.change("SPATIAL_AGGREGATION", 0);
    expect(mockCallback).toHaveBeenCalledTimes(1);
  })

})