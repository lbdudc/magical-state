import { createStore } from "../..";

const jsonSpecMultiple = [{
  "id": "DATE_FILTER",
  "label": "Date filter",
  "type": "date",
}]

const getValues = () => {
  return new Promise((resolve) => {
    resolve();
  });
}

describe("selectorState", () => {
  it("should set the value of the selectot even if it doesnt have items", async () => {
    const store = await createStore(jsonSpecMultiple, getValues, null, () => { });
    const value = [2022, 3, 31, 15, 20];
    const filter = store.getSelector("DATE_FILTER");

    await store.setSelector("DATE_FILTER", value);
    expect(filter.value.sort()).toEqual(value.sort());
  });
});