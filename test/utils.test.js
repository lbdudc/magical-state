import utils from "../src/utils";
import { Store } from "../index";

let store;

const jsonSpec = [
  {
    "id": "DATE_FILTER",
    "label": "Date filter",
    "setItemsOnMounted": false,
    "default": "2020-01-01",
    "type": "date",
    "actions": [
      "INSTANT_FILTER"
    ]
  },
  {
    "id": "INSTANT_FILTER",
    "setItemsOnMounted": false,
    "default": 1,
    "actions": [],
    "redraw": true
  }
]

const initializeStore = () => {

  const getValues = async (id, value, store) => {
    const f = () => {
      return new Promise((resolve) => {
        resolve([{
          label: 1,
          value: 1
        },
        {
          label: 34,
          value: 34
        }
        ]);
      });
    };
    return await f();
  }
  store = new Store(jsonSpec, getValues, null, () => { });
}

describe("Utils", () => {

  beforeEach(() => {
    initializeStore();
  });

  it("should be able to decode an URL", () => {

    const parsedUrl = Store.parseUrl("MD0yMDIwLTAxLTAxJjE9MQ==", jsonSpec);

    expect(parsedUrl).toEqual({ DATE_FILTER: '2020-01-01', INSTANT_FILTER: 1 });
  });

  it("should be able to export an encoded URL", () => {

    const encodedUrl = utils.exportStoreEncodedURL(store.observable);

    expect(encodedUrl).toEqual("MD0yMDIwLTAxLTAxJjE9MQ==");
  });

  it("should be able to import an encoded URL", async () => {

    await store.importStoreEncodedURL("MD0xOTkwLTAxLTAxJjE9MzQ=");

    // MD0xOTk5LTAyLTAyJjE9MzQ= value should be equal to:
    //({ DATE_FILTER: '1990-01-01', INSTANT_FILTER: 34 });
    expect(store.objFromObservable).toEqual({ DATE_FILTER: '1990-01-01', INSTANT_FILTER: 34 });
  });
})