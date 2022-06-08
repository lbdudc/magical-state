import { Store, createStore } from "../index";

describe("Store", () => {
  //use of variable since events trigger multiple times on different observable elements
  let eventAlreadyReceived = false;

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

  function assertItemsLoadedEvent(store, event) {
    if (!eventAlreadyReceived) {
      eventAlreadyReceived = true;
      const aggregation = store.getSelector('SPATIAL_AGGREGATION');
      //asserting event's content
      expect(event.detail.id).toBe(aggregation.id);
      expect(event.detail.type).toBe("select");
      expect(event.detail.items).toStrictEqual(aggregation.items);
      expect(event.detail.value).toBeNull();

      //asserting that the element has the correct values
      expect(aggregation.items).toStrictEqual(spatialItems);
      expect(aggregation.value).toBeNull();
    }
  }

  function assertChangeEvent(store, done, event) {
    const filter = store.getSelector('SPATIAL_FILTER');
    let aggregation = store.getSelector('SPATIAL_AGGREGATION');

    //asserting changed element's action has the expected values
    expect(filter.items).toStrictEqual(comunities);
    expect(filter.value).toBeNull();

    //asserting event's values
    expect(event.detail.id).toBe(aggregation.id);
    expect(event.detail.value).toStrictEqual(aggregation.items[0].value);
    done();
  }

  function clearEventListeners() {
    document.removeEventListener("itemsLoaded", assertItemsLoadedEvent);
    document.removeEventListener("change", assertChangeEvent);
    eventAlreadyReceived = false;
  }

  afterEach(() => {
    clearEventListeners();
  });

  it("should set items on mounted and dispatch itemsLoaded event", async () => {
    const store = await createStore(jsonSpecSpatial, getValues, null, () => { });

    //wait for items to be loaded before asserting element's properties state
    document.addEventListener("itemsLoaded", assertItemsLoadedEvent.bind(null, store));
  });

  it("should dispatch 'change' event on value establishment and set properties on element's actions", async () => {
    const store = await createStore(jsonSpecSpatial, getValues, null, () => { });
    let aggregation = store.getSelector('SPATIAL_AGGREGATION');

    document.addEventListener("change", assertChangeEvent.bind(null, store));

    //using timeout instead of eventListener("itemsLoaded", ..) to prevent a loop
    //caused by child's items dispatching the event too after store.change() function call
    setTimeout(() => {
      store.change('SPATIAL_AGGREGATION', aggregation.items[0].value);
    }, 2000);
  });
})
