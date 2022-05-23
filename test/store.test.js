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

  const getValues = (id, value, store) => {
    return new Promise(resolve, reject => {
      resolve([])
    })
  }

  it("should be able to create a store", () => {
    const store = new Store(jsonSpec, getValues, null, () => { });

    expect(store).toBeDefined();
    expect(store).not.toBeNull();
    expect(store.jsonSpec).toBe(jsonSpec);
    expect(store.observable).toBeDefined();
    expect(store.observable).not.toBeNull();
  });

  it("should throw error if store is not correct", () => {
    expect(() => {
      new Store(null, () => { }, null, () => { });
    }).toThrowError("jsonSpec is not defined");
  });

  it("should create a correct observable", () => {

    const store = new Store(jsonSpec, getValues, null, () => { });
    const obs = store.observable;

    expect(obs).not.toBeNull();
    expect(obs).not.toBeUndefined();
    obs.forEach((el, index) => {
      expect(el.id).toBe(jsonSpec[index].id);
      expect(el.label).toBe(jsonSpec[index].label);
      expect(el.value).toBe(jsonSpec[index].default != null ? jsonSpec[index].default : null);
      expect(el.loading).toBe(false);
      expect(el.showed).toBe(true);
      expect(el.type).toBe(jsonSpec[index].type || "select");
      expect(el.default).toBe(jsonSpec[index].default);
      expect(el.group).toBe(jsonSpec[index].group || undefined);
      expect(el.redraw).toBe(jsonSpec[index].redraw || false);
      expect(el.setDefaultFirstItem).toBe(jsonSpec[index].setDefaultFirstItem || false);
      expect(el.setItemsOnMounted).toBe(jsonSpec[index].setItemsOnMounted || false);
    });
  });

})
