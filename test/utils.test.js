import utils from "../src/utils";
import { Store } from "../index";

let store;

const initializeStore = () => {
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
  store = new Store(jsonSpec, getValues, () => { });
}


describe("Utils", () => {

  beforeEach(() => {
    initializeStore();
  });

  it("should be able to export an encoded URL", () => {

    // console.log(utils)
    console.log(store.observable);
    const encodedUrl = utils.exportStoreEncodedURL(store.observable);
    console.log(encodedUrl);
    console.log("holis");
    // expect(encodedUrl).toBe("http%3A%2F%2Fwww.google.com");
  });


})


