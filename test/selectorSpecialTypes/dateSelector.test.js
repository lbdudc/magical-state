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
    const value = "2020-03-02";
    const filter = store.getSelector("DATE_FILTER");

    await store.setSelector("DATE_FILTER", value);
    expect(filter.value).toBe(value);
  });
});