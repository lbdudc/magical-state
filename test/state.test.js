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

const getSpecDefaultItem = (id, label, setDefaultFirstItem, setItemsOnMounted, setDefaultItem, defaultV, actions) => {
  return [{
    "id": id,
    "label": label,
    "setItemsOnMounted": setItemsOnMounted,
    "setDefaultItem": setDefaultItem,
    "setDefaultFirstItem": setDefaultFirstItem,
    "actions": actions,
    "default": defaultV,
  }];
}

const spatialItems = [{ label: "AUTONOMOUS_COMMUNITY", value: 1 }, { label: "PROVINCE", value: 2 }, { label: "MOCK", value: 3 }];

const getValues = (id, params, store) => {
  return new Promise((resolve) => {
    resolve(spatialItems);
  });
}

describe("storeState", () => {
  describe("store population", () => {
    it("should set items and value on mounted", async () => {
      const spec = getSpecDefaultItem("SPATIAL_AGGREGATION", "Spatial Aggregation", true, true, null, 2, []);
      const store = await createStore(spec, getValues, null, () => { });
      const aggregation = store.getSelector("SPATIAL_AGGREGATION");
      expect(aggregation.items).toStrictEqual(spatialItems);
      expect(aggregation.value).toBe(spatialItems[0].value);
    });

    it("should set value to default", async () => {
      const spec = getSpecDefaultItem("SPATIAL_AGGREGATION", "Spatial Aggregation", false, true, null, 2, []);
      const store = await createStore(spec, getValues, null, () => { });
      const aggregation = store.getSelector("SPATIAL_AGGREGATION");
      expect(aggregation.value).toBe(spatialItems[1].value);
    });
  });
  describe("setState", () => {
    it("should set the state to the one passed on store creation", async () => {
      const store = await createStore(jsonSpecAggregationFilter, getValues, { "SPATIAL_AGGREGATION": 3, "SPATIAL_FILTER": 1 }, () => { });
      const aggregation = store.getSelector("SPATIAL_AGGREGATION");
      const filter = store.getSelector("SPATIAL_FILTER");
      expect(aggregation.value).toBe(spatialItems[2].value);
      expect(filter.value).toBe(spatialItems[0].value);
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

  })

  describe("setItems", () => {
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
      const spec = getSpecDefaultItem("SPATIAL_AGGREGATION", "Spatial Aggregation", false, false, null, 2, []);
      const store = await createStore(spec, getValues, null, () => { });
      const aggregation = store.getSelector("SPATIAL_AGGREGATION");

      store.setItems("SPATIAL_AGGREGATION", spatialItems, true);
      expect(aggregation.items.sort()).toEqual(spatialItems.sort());
      expect(aggregation.value).toEqual(spatialItems[1].value);
    });

    it("should set items and value based on the spec when calling setItems", async () => {
      const spec = getSpecDefaultItem("SPATIAL_AGGREGATION", "Spatial Aggregation", true, false, null, null, []);
      const store = await createStore(spec, getValues, null, () => { });
      const aggregation = store.getSelector("SPATIAL_AGGREGATION");

      store.setItems("SPATIAL_AGGREGATION", spatialItems, true);
      expect(aggregation.items.sort()).toEqual(spatialItems.sort());
      expect(aggregation.value).toEqual(spatialItems[0].value);
    });
  });


  describe("setSelector", () => {
    it("should set the value of the selector and set its items", async () => {
      const store = await createStore(simpleJsonSpec, getValues, null, () => { });
      await store.setSelector("SPATIAL_AGGREGATION", 1);
      const aggregation = store.getSelector("SPATIAL_AGGREGATION");
      expect(aggregation.items.sort()).toEqual(spatialItems.sort());
      expect(aggregation.value).toEqual(spatialItems[0].value);
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
  });

  describe("change", () => {
    it("should change store's value to the selected one", async () => {
      const spec = getSpecDefaultItem("SPATIAL_AGGREGATION", "Spatial Aggregation", false, true, null, 2, []);
      const store = await createStore(spec, getValues, null, () => { });
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
  });

  describe("setDefaultItem", () => {
    it("should set value to first item", async () => {
      const spec = getSpecDefaultItem("SPATIAL_AGGREGATION", "Spatial Aggregation", false, true, "first", null, []);
      const store = await createStore(spec, getValues, null, () => { });
      const filter = store.getSelector("SPATIAL_AGGREGATION");

      expect(filter.value).toBe(spatialItems[0].value);
    });

    it("should set value to last item", async () => {
      const spec = getSpecDefaultItem("SPATIAL_AGGREGATION", "Spatial Aggregation", false, true, "last", null, []);
      const store = await createStore(spec, getValues, null, () => { });
      const filter = store.getSelector("SPATIAL_AGGREGATION");

      expect(filter.value).toBe(spatialItems[spatialItems.length - 1].value);
    });

    it("should set value to item at index of value setDefaultItem", async () => {
      const spec = getSpecDefaultItem("SPATIAL_AGGREGATION", "Spatial Aggregation", false, true, 1, null, []);
      const store = await createStore(spec, getValues, null, () => { });
      const filter = store.getSelector("SPATIAL_AGGREGATION");

      expect(filter.value).toBe(spatialItems[1].value);
    });

    it("should reject change when setDefaultItem has value 'all' but selector is not multiple", async () => {
      const spec = getSpecDefaultItem("SPATIAL_AGGREGATION", "Spatial Aggregation", false, true, "all", null, []);
      return expect(createStore(spec, getValues, null, () => { })).
        rejects.toEqual("Cannot set value of type array on a selector that is not multiple");
    });
  })
})