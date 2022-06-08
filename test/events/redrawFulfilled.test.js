import { createStore, Store } from "../../index";

describe("redrawFulfilled", () => {
  const jsonSpecSpatial = [
    {
      "id": "SPATIAL_AGGREGATION",
      "label": "Spatial Aggregation",
      "setItemsOnMounted": true,
      "default": "mock",
      "redraw": true,
      "actions": [
        "SPATIAL_FILTER"
      ]
    },
    {
      "id": "SPATIAL_FILTER",
      "label": "Spatial Filter",
      "setDefaultFirstItem": true,
      "redraw": true,
      "actions": []
    },
  ]

  const getValues = (id, value, store) => {
    return new Promise((resolve, reject) => {
      if (id != null) {
        resolve([{ value: "mock2" }])
      } else {
        reject()
      }
    })
  }

  function assertRedrawFullfilledEvent(cb, timesToBeDispatched) {
    //asserting event's number of calls
    expect(cb).toHaveBeenCalledTimes(timesToBeDispatched);
  }

  afterEach(() => {
    document.removeEventListener("redrawFullfilled", assertRedrawFullfilledEvent);
  });

  it("should dispatch event 'redrawFullfilled' only once on value change", async () => {
    const mockCallback = jest.fn(() => { return Promise.resolve() });
    // we use a spec with two elements setting their values by default to check that the event is dispatched twice
    const store = await createStore(jsonSpecSpatial, getValues, null, mockCallback);
    document.addEventListener("redrawFullfilled", (event) => {
      assertRedrawFullfilledEvent(mockCallback, 1);
    });
  })

  it("should dispatch event 'redrawfullfilled' on setState", async () => {
    const mockCallback = jest.fn(() => { return Promise.resolve() });
    const store = await createStore(jsonSpecSpatial, getValues, null, () => {
      return Promise.resolve()
    });
    const newValues = [{ id: "SPATIAL_AGGREGATION", value: 0 }, { id: "SPATIAL_FILTER", value: "mock2" }];

    store.setState(newValues, true, mockCallback);
    document.addEventListener("redrawFullfilled", () => {
      assertRedrawFullfilledEvent(mockCallback, 1);
    });

  })
});