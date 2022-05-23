# magical-state

![plot](./assets/logo.png)

## Introduction

This library manages the global state of a series of selectors that can be easily defined through configuration files.

## Installation

Add the dependency for your proyect into `package.json`

```json
"magical-state": "git+https://gitlab.lbd.org.es/publico/magical-state.git"
```

## Store methods

### Import/Export methods

- ```exportStoreEncodedURL(): String```: Returns an encoded URL with the current state of the store.
- ```importStoreEncodedURL(url): void```: Parses the URL and sets the state of the store).
- ```(static) parseUrl(url,jsonSpec): Object<key,value>```: Returns the decoded URL.

Examples of usage [here](#import--export-store-url)

### Change the state of the store

- ```change(String propId, Any newVal): void```: Changes the value of the selector with the given id.
- ```setState(Array<{String id, Any value}> newState, Boolean executeCallback, Function customCallback)```: Sets the state of the store, second param specifies if want to execute the redraw method, or a custom one (third param). (not recommended, better to use the newState in the constructor of the store)
- ```setSelector(String selectorId, Any newVal)```: Changes the value of the selector with the given id.
- ```getSelector(String selectorId): Proxy```: Returns the value of the selector with the given id).
- ```(getter) objFromObservable: Array<{String id, Any value}>```: Returns a copy of the actual state of the store.

## Usage

You can see a more detailed example in the folder `./examples` inside this project.

Steps to follow are:

1. Define [`specification.json`](#define-a-specificationjson-file)
2. Define how to [retrieve values to the selectors](#add-the-implementation-of-fetching-data)
3. Create an [store](#create-the-store)
4. Add the [.vue components (optional)](#add-component-selectors-optional)

### Define a `specification.json` file

To begin with, we must define in a .json file which selectors we want to create, and the way in which these selectors are related to each other.

To do this we define an array of objects.

| name                | type    | default   | description                                                                                                                     |
|---------------------|---------|-----------|---------------------------------------------------------------------------------------------------------------------------------|
| id                  | string  |           | Identifier of the selector, must be unique                                                                                      |
| label               | string  | undefined | Label to be placed in the label field of the selector                                                                           |
| setItemsOnMounted   | boolean | true      | It can be specified if we want the selector to load data when it is rendered for the first time                                 |
| setDefaultFirstItem | boolean | false     | You can specify if you want the first element to be selected by default when loading the data                                   |
| redraw              | boolean | false     | If this option is selected. the callback defined in the store will be fired whenever the @change event of the selector is fired |
| default             | string   | null        | Name of the default value to be set             | array   | []        | List of identifiers of child selectors, for which an @change event will be fired every time the parent's @change event is fired

Example of an `specification.json`

```json
[
  {
    "id": "SPATIAL_AGGREGATION",
    "label": "Spatial Aggregation",
    "setItemsOnMounted": true,
    "setDefaultFirstItem": true,
    "redraw": true,
    "default": "PROVINCE",
    "actions": [
      "SPATIAL_FILTER"
    ]
  },
  {
  "id": "SPATIAL_FILTER",
  "setDefaultFirstItem": true,
  "label": "Spatial Filter",
  "actions": [],
  }
]
```

---

#### **IMPORTANT**

You must be careful with defining cyclic dependencies between selectors, and that the identifiers of the children are defined in the specification

---

### Add the implementation of fetching data

We must define how we are going to want to retrieve the necessary information to populate each of our selectors.

To do this, we create a 'getValues' method.

```js
export default async (propId, params, store) =>  {
  switch (propId) {
    case "SPATIAL_AGGREGATION":
      return aggregationService.getSpatialItems();
    case "TEMPORAL_AGGREGATION":
      return aggregationService.getTemporalItems();
    case "TEMPORAL_FILTER":
      return filterService.getTemporalFilterItems(params);
    case "SPATIAL_FILTER":
      return filterService.getSpatialFilterItems(params);
  }
}

```

`propId:` Name of the selector from which we want to retrieve the possible values ​​to populate the selector.

`params:` Object with related key/values.

`store`:  Object with {id1: value1, id2: value2, ... } representing actual state of the store.

---

#### **IMPORTANT FOR RETURNING VALUES**

The function always must return a Promise, and the data must be like:

```json
[
  {
  "label": "any",
  "value": "any"
  },
]
```

---

### Create the store

Into your component (normally a .vue file), import your `specification.json` and your `implementation.js` files,
additionally you can specify: a state to be set when the store is created (url encoded or an object with key/values), and a custom callback to be executed when the store is updated.

> **_PARAMS TO BE PASSED:_**  jsonSpec: Array, getValues: Function, state: Object|String, callback: Function

```js
import jsonSpec from "./specification.json";
import {
  Store
} from "./magical-state/index.js";

...
...
...

this.store = new Store(jsonSpec, 
  (propId, params, store) => { return await [{ ... }] },
  null, 
  (currentState) => {
  console.log(`Your current state is: [${currentState}]`);
});
```

### Add component selectors (optional)

Then you normally would like to add the m-selector components, given by the library into your `component.vue`

```js
import {
  MSelector,
} from "./magical-state/vue2-components";
```

```html
  <m-selector :store="store" id="SPATIAL_AGGREGATION"> </m-selector>
```

| name                | type    | default   | description                                                                                                                     |
|---------------------|---------|-----------|---------------------------------------------------------------------------------------------------------------------------------|
| store               | Object  |           | The instance of the store created by the library                                                                                |
| id                  | string  | undefined | Identifier of the selector to be rendered (must coincide with the id defined into the specification.json file)                  |
| i18n               | Function  | undefined | Function to i18n the labels of the selectors                 |

### Import / Export Store URL

For importing and exporting the store, you can the methods:

- ```exportStoreEncodedURL(): String```: Returns an encoded URL with the current state of the store.
- ```importStoreEncodedURL(url): void```: Parses the URL and sets the state of the store).
- ```(static) parseUrl(url,jsonSpec): Object<key,value>```: Returns the decoded URL, this method can be called without instantiating the store, to parse an URL before store creation.

```js
import {
  Store
} from "./magical-state/index";

...

// If you need to access the readable values of an encoded 
//URL, you can use the method:
const newState = Store.parseUrl(url, jsonSpec);

// You can create the new store with an url encoded or 
// with an object with key/values
const newStateUrl = "MD0yJjI9Mg=="
const newStateObject = {
  "SPATIAL_AGGREGATION": "PROVINCE",
  "SPATIAL_FILTER": "A CORUÑA",
  "TEMPORAL_AGGREGATION": "YEAR",
  "TEMPORAL_FILTER": "2018"
};

// Examples creating the store
this.store = new Store(
  jsonSpec,
  getValues,
  newStateUrl || newStateObject,
  (storeContent) => { 
    console.log("created with new state");
  }
);

// Then you can import/export the store
this.store.exportStoreEncodedURL() 
// returns the encoded URL (MD0yJjI9Mg==)

// set the state of the store with the encoded URL
this.store.importStoreEncodedURL(newStateUrl); 
```

## Changelog

[CHANGELOG.md](https://gitlab.lbd.org.es/proyectos-sig/magical-state/-/blob/main/CHANGELOG)

In order to automate CHANGELOG update, developers should write commit messages following [Angular Commit Message Conventions](https://semantic-release.gitbook.io/semantic-release/#commit-message-format)

## License

[MIT](http://opensource.org/licenses/MIT)
