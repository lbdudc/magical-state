# magical-state

![plot](./assets/logo.png)

## Table of contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)
  - [Specification](#define-a-specification-in-json-format)
  - [Implementation of fetching data](#add-the-implementation-of-fetching-data)
  - [Implementation of default values](#add-the-implementation-of-getting-default-values)
- [Store methods](#store-methods)
  - [Create the store](#create-the-store)
  - [Change the state of the store](#change-the-state-of-the-store)
  - [Get the state of the store](#get-the-state-of-the-store)
  - [Import / Export Store URL](#import-and-export-store-url)
- [Store Events](#store-events)
- [Independent Methods](#independent-methods)
- [Vue Components](/src/components/vue2-components/)
- [Examples](/examples)

## Introduction

This library manages the global state of a series of selectors which have reactive dependencies between each other. These dependencies and the selectors' expected behaviour can be easily defined through a configuration file.

## Installation

Add the dependency for your proyect into `package.json`

```json
"magical-state": "git+https://gitlab.lbd.org.es/publico/magical-state.git"
```

## Usage

To use the library we must create a [store](#create-the-store). For this we will first need to define a specification and an object consisted of two methods, _getValues_ and _defaultValuesGetter_, that will retrieve the items that will populate each selector and specify a default value to be set.

### Define a `specification` in json format

To begin with, we must define in a json the selectors we want to create, the way they are related to each other, and their expected behaviour. The store will accept the next parameters in the specification:

| name              | type    | default   | description                                                                                                                       |
| ----------------- | ------- | --------- | --------------------------------------------------------------------------------------------------------------------------------- |
| id                | string  | undefined | Identifier of the selector, must be unique.                                                                                       |
| label             | string  | undefined | Label to be placed in the label field of the selector.                                                                            |
| setItemsOnMounted | boolean | false     | It can be specified if we want the selector to load data when it is rendered for the first time.                                  |
| triggerCallback   | boolean | false     | If this option is selected the callback defined passed in store creation will be fired whenever the value of the selector changes |
| actions           | array   | []        | List of identifiers of store elements that need to reload their items every time the value of this element changes.               |

<details>
  <summary>Example of a specification.json</summary>

#### Specification

This spec will generate two selectors: "COUNTRIES" and "CITIES".

_COUNTRIES_ will trigger the _getValues_ method on mount and set as its selector options to the returned elements, setting as its selected value the element retrieved by _defaultValuesGetter_. Everytime the selected value changes _CITIES_ will update its items and, again, _defaultValuesGetter_ will be invoked.

```json
[
  {
    "id": "COUNTRIES",
    "label": "Countries",
    "triggerCallback": true,
    "actions": ["SPATIAL_FILTER"]
  },
  {
    "id": "CITIES",
    "label": "Cities",
    "actions": []
  }
]
```

</details>

##### **IMPORTANT**

Be careful with defining cyclic dependencies between selectors, and that the identifiers in the actions are defined in the specification.

### Add the implementation of fetching data

We must define how we want to retrieve the necessary information to populate each of our selectors.

To do this the store will call the method _getValues_ passed on store creation. This method is expected to receive the next parameters in the listed order:

- _propId_: The identifier of the selector that needs its items to be loaded.
- _params_: A list of key-value elements that contains the current value of the selectors that have dependent selectors (_actions_ list not empty).
- _store_: A key-value object containing all the selectors' values.

<details>
  <summary>Example of a getValues function</summary>

```js
export default async (propId, params, store) => {
  switch (propId) {
    case "COUNTRIES":
      return countriesService.getCountries();
    case "CITIES":
      return citiesService.getCities(params["COUNTRIES"]);
  }
};
```

</details>

##### **IMPORTANT FOR RETURNING VALUES**

The function always must return a Promise, and the retrieved data accepts the next format:

```json
[
  {
    "label": "any",
    "value": "any"
  }
]
```

Field _label_ is only mandatory when using the library's Vue components.

### Add the implementation of getting default values

We must define a method that indicates the store the default values to be set on selectors that are dependent of others (are present in any selectors' actions) or those that are meant to be populated on store creation.

To do this the store will call the method _defaultValuesGetter_ passed on store creation. This method is expected to receive the next parameters in the listed order:

- _propId_: The identifier of the selector that needs its items to be loaded.
- _items_: A list containing the selector's items.
- _store_: A key-value object containing all the selectors' values.

##### **IMPORTANT**

The _defaultValuesGetter_ function is expected to retrieve a Promise containing the desired new value.

<details>
  <summary>Example of a defaultValuesGetter function</summary>

```js
export default async (propId, items, store) => {
  return new Promise((resolve) => {
    switch (propId) {
      // Will set as value the last item
      case "TEMPROAL_FILTER":
        resolve(items[items.length - 1].value);
        break;
      case "DATE_FILTER":
        resolve(formatDateInverse(new Date()));
        break;
      default:
        resolve();
        break;
    }
  });
};
```

</details>

## Store methods

### Create the store

> `createStore (jsonSpec: Array, getValues: Function, state: Object|String, callback: Function) : Store`

- _jsonSpec_: the [specification](#define-a-specification-in-json-format) needed to create the desired selectors.

- {_getValues_: ()=>{}, _defaultValuesGetter_: ()=>{} }: the [fetch](#add-the-implementation-of-fetching-data) data and default values getter functions.

- _state_: a state to be set when the store is created (url encoded or an object with key/values). When passed the store will ignore the specification for value getting/setting and will set the selectors' items based on the values passed.

- _callback_: a _Promise_ to be executed when the store values are updated. The callback function will be triggered everytime a selector that has the _triggerCallback_ property to true suffers a value change. Note that if the selector has any related selectors on its actions, the store will wait for their items and default values to be set before triggering the callback.

- _Returns_ an instance of the store.

<details>
<summary>Example of store creation</summary>

```js
import jsonSpec from "./specification.json";
import {
  createStore
} from "./magical-state/index.js";
import getValues from "./valueGetters";
import defaultValuesGetter from "./defaultValuesGetter";

...
...
...

const state = {
  COUNTRIES: 2,
};

this.store = createStore(
  jsonSpec,
  {
    getValues: getValues,
    defaultValuesGetter: defaultValuesGetter
  },
  // will set 2 as default value on selector 'countries'
  state,
  // the callback receives as a parameter an {id: value} object
  // that constains the selectors with values not null
  (storeCurrentState) => {
    return new Promise(async (resolve) => {
      resolve();
    });
  };
);


```

</details>

### Change the state of the store

- `change(propId: String, newVal: Any, needsRedraw: Boolean): Promise<>`: Changes the value of the selector with the given id. _needsRedraw_ prop defaults to true and specifies if the change on the selector's value should trigger the callback, in case the selector has the _triggerCallback_ property set to true in the specification.
- `setSelector(selectorId: String, newVal: Any, deep: Boolean, triggerCallbak: Boolean): Promise<>`: Changes the value of the selector with the given id. If _deep_ is true, or the selector doesn't have items, _setSelector_ will call _getValues_ to populate the selector's items.
- `setItems(id: String, values: Array, useSpecConfig: Boolean): void`: Sets the items of the specified store element to the parameter _values_.
- `setHasErrors(selectorId: String, value: Boolean, useSpecConfig: Boolean): Boolean`: Sets the property 'hasErrors' of the specified selector to the value provided. If it's set to true this will prevent the store from firing the callback when an element changes value.

##### Important when setting a new value on a selector:

- If a selector has an error (_hasError_ property equaling true) and its value changes to a correct one, it's important to first set this property back to false so that the callback is triggered when calling _change_ function.

### Get the state of the store

- `getSelector(selectorId: String): Proxy`: Returns the proxy of the selector with the given id).
- `(getter) objFromObservable(): Array<{id: String, value: Any}>`: Returns a copy of the actual state of the store.
- `getUI(): Array<{id: String, label: String, value: Any, type: String, items: []}>`: Returns a list of objects that contains the basic information about every observable element so they can be displayed on the UI.
- `triggerGetValues(id: String): Promise<Any>`: Triggers the _getValues_ method of the selector with the given id. Returns the promise returned by the implementation of the _getVlues_ method passed on store creation.

### Import and Export Store URL

For importing and exporting the store, you can use the methods:

- `exportStoreEncodedURL(): String`: Returns an encoded URL with the current state of the store.
- `importStoreEncodedURL(url): void`: Parses the URL and sets the state of the store).
- `(independent from store) parseUrl(url,jsonSpec): Object<key,value>`: Returns the decoded URL, this method can be called without instantiating the store, to parse an URL before store creation.

<details>
<summary>Example of url import/export</summary>

```js
import {
  createStore, parseUrl
} from "./magical-state/index";
import getValues from "./getValues";
import defaultValuesGetter from "./defaultValuesGetter";
...

// If you need to access the readable values of an encoded
//URL, you can use the method:
const newState = parseUrl(url, jsonSpec);

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
this.store = createStore(
  jsonSpec,
  {getValues: getValues, defaultValuesGetter: defaultValuesGetter},
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

</details>

## Store Events

The store will dispatch the next events:

- _redrawFulfilled_: It is dispatched after completing the execution of the callback function.

- _itemsLoaded_: It is dispatched after retrieving the items of a selector through the use of the _getValues_ function.

- _change_: Dispatched when a selector has changed its value.

**Important**: To dispatch these events we use [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent) so we can append on them iformation about the store. With each of them an object with the next content is passed:

```js
{event:
  {detail:
    {
      id: String,
      label: String,
      value: Any,
      type: String,
      items: Array
    }
  }
}
```

## Independent Methods

`parseUrl(url,jsonSpec): Object<key,value>` Returns the decoded URL.

## Vue2 Components

The library provides some vue2 components that work against a store. You cand find how to use them at: [vue2-components](/src/components/vue2-components/).

### :pencil: Examples

Extended examples at: [Examples](/examples).

## Changelog

[CHANGELOG.md](https://gitlab.lbd.org.es/proyectos-sig/magical-state/-/blob/main/CHANGELOG)

In order to automate CHANGELOG update, developers should write commit messages following [Angular Commit Message Conventions](https://semantic-release.gitbook.io/semantic-release/#commit-message-format)

## License

[MIT](http://opensource.org/licenses/MIT)
