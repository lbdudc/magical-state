import { Store } from "../index";

describe("Store", () => {

  const jsonSpec = [
    {
      "id": "DATE_FILTER",
      "label": "Date filter",
      "setItemsOnMounted": false,
      "setDefaultFirstItem": false,
      "actions": [
        "INSTANT_FILTER"
      ]
    },
    {
      "id": "INSTANT_FILTER",
      "setItemsOnMounted": false,
      "setDefaultFirstItem": false,
      "default": 0,
      "actions": [],
      "redraw": true
    }
  ]

  it("should be able to create a store", () => {
    const getValues = (id, value, store) => {
      return new Promise(resolve, reject => {
        resolve([])
      })
    }

    const store = new Store(jsonSpec, getValues, () => { });

    expect(store).toBeDefined();
    expect(store.jsonSpec).toBe(jsonSpec);
    expect(store.observable).toBeDefined();
  });

  it("should throw error if store is not correct", () => {
    expect(() => {
      const store = new Store(null, () => { }, () => { });
    }).toThrowError("jsonSpec is not defined");
  });
})
