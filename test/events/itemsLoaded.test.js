import { createStore } from "../../index";

describe("ItemsLoaded", () => {
  const jsonSpecSimpleAggregation = [
    {
      id: "SPATIAL_AGGREGATION",
      label: "Spatial Aggregation",
      setItemsOnMounted: true,
      unused: "unused",
    },
  ];

  const jsonSpecSpatial = [
    {
      id: "SPATIAL_AGGREGATION",
      label: "Spatial Aggregation",
      setItemsOnMounted: true,
      actions: ["SPATIAL_FILTER"],
    },
    {
      id: "SPATIAL_FILTER",
      label: "Spatial Filter",
      actions: [],
    },
  ];
  const spatialItems = [
    { label: "AUTONOMOUS_COMMUNITY", value: 1 },
    { label: "PROVINCE", value: 2 },
  ];
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
  };

  function assertItemsLoadedEvent(store, event, id, expectedItems) {
    const changedElement = store.getSelector(id);
    //asserting event's content
    expect(event.detail.id).toBe(changedElement.id);
    expect(event.detail.type).toBe("select");
    expect(event.detail.label).toBe(changedElement.label);
    expect(event.detail.items).toStrictEqual(changedElement.items);
    expect(event.detail.value).toBeNull();

    //asserting that the element has the correct values
    expect(changedElement.items).toStrictEqual(expectedItems);
    expect(changedElement.value).toBeNull();
  }

  afterEach(() => {
    document.removeEventListener("itemsLoaded", assertItemsLoadedEvent);
  });

  it("should dispatch event 'itemsLoaded' when setting state", async () => {
    const store = await createStore(
      jsonSpecSimpleAggregation,
      getValues,
      null,
      () => {}
    );
    let eventAlreadyReceived = false;
    document.addEventListener("itemsLoaded", (event) => {
      if (!eventAlreadyReceived) {
        assertItemsLoadedEvent(
          store,
          event,
          "SPATIAL_AGGREGATION",
          spatialItems
        );
        eventAlreadyReceived = true;
      }
    });
    store.setState({ SPATIAL_AGGREGATION: 3 }, false);
  });

  it("should set items on mounted and dispatch itemsLoaded event", async () => {
    const store = await createStore(jsonSpecSpatial, getValues, null, () => {});
    let eventAlreadyReceived = false;

    //wait for items to be loaded before asserting element's properties state
    document.addEventListener("itemsLoaded", (event) => {
      if (!eventAlreadyReceived) {
        assertItemsLoadedEvent(
          store,
          event,
          "SPATIAL_AGGREGATION",
          spatialItems
        );
        eventAlreadyReceived = true;
      }
    });
  });

  it("should dispatch itemsLoaded event after loading child's items", async () => {
    const store = await createStore(jsonSpecSpatial, getValues, null, () => {});
    let eventAlreadyReceived = false;
    document.addEventListener("itemsLoaded", (event) => {
      if (!eventAlreadyReceived) {
        assertItemsLoadedEvent(store, event, "SPATIAL_FILTER", provinces);
        eventAlreadyReceived = true;
      }
    });
    store.change("SPATIAL_AGGREGATION", 2);
  });
});
