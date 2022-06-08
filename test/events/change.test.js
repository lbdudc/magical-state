import { createStore } from "../../index";

describe("change", () => {

  const jsonSpecSpatial = [
    {
      "id": "SPATIAL_AGGREGATION",
      "label": "Spatial Aggregation",
      "setItemsOnMounted": true,
      "actions": [
        "SPATIAL_FILTER"
      ]
    },
    {
      "id": "SPATIAL_FILTER",
      "label": "Spatial Filter",
      "actions": []
    },
  ]
  const spatialItems = [{ label: "AUTONOMOUS_COMMUNITY", value: 1 }, { label: "PROVINCE", value: 2 }];
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

  afterEach(() => {
    document.removeEventListener("change", assertChangeEvent);
  });

  function assertChangeEvent(store, event) {
    const filter = store.getSelector('SPATIAL_FILTER');
    let aggregation = store.getSelector('SPATIAL_AGGREGATION');

    //asserting changed element's action has the expected values
    expect(filter.items).toStrictEqual(comunities);
    expect(filter.value).toBeNull();

    //asserting event's values
    expect(event.detail.id).toBe(aggregation.id);
    expect(event.detail.value).toStrictEqual(aggregation.items[0].value);
  }

  it("should dispatch 'change' event on value establishment and set properties on element's actions", async () => {
    const store = await createStore(jsonSpecSpatial, getValues, null, () => { });
    let aggregation = store.getSelector('SPATIAL_AGGREGATION');

    document.addEventListener("change", assertChangeEvent.bind(null, store));

    store.change('SPATIAL_AGGREGATION', aggregation.items[0].value);
  });
})
