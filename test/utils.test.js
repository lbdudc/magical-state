import { createStore, parseUrl } from "../index";
import utils from "../src/utils";

let store;

const jsonSpec = [
  {
    id: "DATE_FILTER",
    label: "Date filter",
    setItemsOnMounted: false,
    default: "2020-01-01",
    type: "date",
    actions: ["INSTANT_FILTER"],
  },
  {
    id: "INSTANT_FILTER",
    setItemsOnMounted: false,
    default: 1,
    actions: [],
    redraw: true,
  },
];

const getValues = async (id, value, store) => {
  const f = () => {
    return new Promise((resolve) => {
      resolve([
        {
          label: 1,
          value: 1,
        },
        {
          label: 34,
          value: 34,
        },
      ]);
    });
  };
  return await f();
};

describe("Utils", () => {
  it("should be able to decode an URL", () => {
    const parsedUrl = parseUrl("MD0yMDIwLTAxLTAxJjE9MQ==", jsonSpec);

    expect(parsedUrl).toEqual({ DATE_FILTER: "2020-01-01", INSTANT_FILTER: 1 });
  });

  it("should be able to export an encoded URL", async () => {
    store = await createStore(
      jsonSpec,
      getValues,
      "MD0yMDIwLTAxLTAxJjE9MQ==",
      () => {}
    );

    const encodedUrl = store.exportStoreEncodedURL();

    expect(encodedUrl).toEqual("MD0yMDIwLTAxLTAxJjE9MQ==");
  });

  it("should be able to import an encoded URL", async () => {
    store = await createStore(jsonSpec, getValues, null, () => {});
    await store.importStoreEncodedURL("MD0xOTkwLTAxLTAxJjE9MzQ=");

    // MD0xOTk5LTAyLTAyJjE9MzQ= value should be equal to:
    //({ DATE_FILTER: '1990-01-01', INSTANT_FILTER: 34 });
    expect(store.objFromObservable).toEqual({
      DATE_FILTER: "1990-01-01",
      INSTANT_FILTER: 34,
    });
  });

  it("storeHasErrors should return true when a selector has errors", async () => {
    const store = await createStore(jsonSpec, getValues, null, () => {});
    const filter = store.getSelector("DATE_FILTER");
    filter.hasErrors = true;
    expect(utils.storeHasErrors(store._observable)).toBe(true);
  });

  it("storeHasErrors should return false when a selector has no errors", async () => {
    const store = await createStore(jsonSpec, getValues, null, () => {});
    expect(utils.storeHasErrors(store._observable)).toBe(false);
  });
});
