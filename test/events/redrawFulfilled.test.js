import { Store } from "../../index";

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

  function assertRedrawFulfilledEvent(done, event, cb, timesToBeDispatched) {
    //asserting event's content
    expect(event.detail).toBeNull();
    setTimeout(() => {
      expect(cb).toHaveBeenCalledTimes(timesToBeDispatched);
      done();
    }, 2000);
  }

  afterEach(() => {
    document.removeEventListener("redrawFulfilled", assertRedrawFulfilledEvent);
  });

  it("should dispatch event 'redrawFulfilled' only once on value change", (done) => {
    const mockCallback = jest.fn(() => { return Promise.resolve() });
    // we use a spec with two elements setting their values by default to check that the event is dispatched twice
    const store = new Store(jsonSpecSpatial, getValues, null, mockCallback);
    document.addEventListener("redrawFulfilled", (event) => {
      assertRedrawFulfilledEvent(done, event, mockCallback, 1);
    });
  })

  it("should dispatch event 'redrawfulfilled' on setState", (done) => {
    const mockCallback = jest.fn(() => { return Promise.resolve() });
    const store = new Store(jsonSpecSpatial, getValues, null, () => {
      return Promise.resolve()
    });
    const newValues = [{ id: "SPATIAL_AGGREGATION", value: 0 }, { id: "SPATIAL_FILTER", value: "mock2" }];

    setTimeout(() => {
      store.setState(newValues, true, mockCallback);
      document.addEventListener("redrawFulfilled", (event) => {
        assertRedrawFulfilledEvent(done, event, mockCallback, 1);
      });
    }, 1000);
  })
});