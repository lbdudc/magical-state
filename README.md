# magical-state

![plot](./assets/logo.png)

## Table of contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)
  - [Specification](#define-a-specification-in-json-format)
  - [Implementation of fetching data](#add-the-implementation-of-fetching-data)
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

To use the library we must create a [store](#create-the-store). For this we will first need to define a specification and a method *getValues* to retrieve the items that will populate each selector.

### Define a `specification` in json format

To begin with, we must define in a json the selectors we want to create, the way they are related to each other, and their behaviour. The store will accept the next parameters in the specification:

| name                | type    | default   | description                                                                                                                     |
|---------------------|---------|-----------|---------------------------------------------------------------------------------------------------------------------------------|
| id                  | string  |     undefined      | Identifier of the selector, must be unique.                                                                                      |
| label               | string  | undefined | Label to be placed in the label field of the selector.                                                                           |
| setItemsOnMounted   | boolean | false      | It can be specified if we want the selector to load data when it is rendered for the first time.                                 |
| setDefaultItem | string \|\| integer  | undefined     | You can specify 'first', 'last', 'all' or a number that represents the index of the item's array that is meant to be set as default value.                                   |
| redraw              | boolean | false     | If this option is selected the callback defined passed in store creation will be fired whenever the value of the selector changes |
| default             | string   | null        | Value to set as default if *setDefaultItem* is not present.            | array   | []        | List of identifiers of child selectors, for which an @change event will be fired every time the parent's @change event is fired
| actions | array | [] | List of identifiers of store elements that need to reload their elements every time the value of this element changes.
| type | string | 'selector' |  The store has in count three types: 'selector', 'date', and 'multiple'.

<details>
  <summary>Example of an specification.json</summary>

#### Specification

This spec will generate two selectors: "COUNTRIES" and "CITIES".

*COUNTRIES* will trigger the *getValues* method on mount and will always set as its default value the first element of the retrieved items. Everytime its value changes *CITIES* will update its values and set as default the last element. Also, since 'redraw' is set to true the callback function will be triggered.

```json
[
  {
    "id": "COUNTRIES",
    "label": "Countries",
    "setItemsOnMounted": true,
    "setDefaultItem": "first",
    "redraw": true,
    "actions": [
      "SPATIAL_FILTER"
    ]
  },
  {
  "id": "CITIES",
  "setDefaultItem": "last",
  "label": "Cities",
  "actions": [],
  }
]
```

</details>

##### **IMPORTANT**

You must be careful with defining cyclic dependencies between selectors, and that the identifiers in the actions are defined in the specification.

### Add the implementation of fetching data

We must define how we want to retrieve the necessary information to populate each of our selectors.

To do this the store will call the method *getValues* passed on store creation. This method is expected to receive the next parameters in the listed order:

- The identifier of the selector that needs its items to be loaded.
- A list of key-value elements that contains the current value of the selectors that have dependent selectors (*actions* list not empty).
- The store.

<details>
  <summary>Example of a getValues function</summary>

```js
export default async (propId, params, store) =>  {
  switch (propId) {
    case "COUNTRIES":
      return countriesService.getCountries();
    case "CITIES":
      return citiesService.getCities(params);
  }
}

```

</details>

##### **IMPORTANT FOR RETURNING VALUES**

The function always must return a Promise, and the retrieved data must have the next format:

```json
[
  {
  "label": "any",
  "value": "any"
  },
]
```

Field *label* is only mandatory when using the library's Vue components.

## Store methods

### Create the store

> ```createStore (jsonSpec: Array, getValues: Function, state: Object|String, callback: Function) : Store```

- *jsonSpec*: the [specification](#define-a-specification-in-json-format) needed to create the desired selectors

- *getValues*: the [fetch](#add-the-implementation-of-fetching-data) data function

- *state*: a state to be set when the store is created (url encoded or an object with key/values)

- *callback*: a *Promise*  to be executed when the store values are updated. The callback function will be triggered everytime a selector that has the *redraw* property to true suffers a value change. Note that if the selector has any related selectors on its actions, the store will wait for their items and default values to be set before triggering the callback.

- *Returns* an instance of the store

<details>
<summary>Example of store creation</summary>

```js
import jsonSpec from "./specification.json";
import {
  createStore
} from "./magical-state/index.js";
import getValues from "./valueGetters";

...
...
...

const state = {
  COUNTRIES: 2,
};

this.store = createStore(
  jsonSpec,
  getValues,
  // will set 2 as default value on selector 'countries' 
  state, 
  // the callback receives as a parameter a {id: value} object
  // that constains the selectors with values not null
  (storeCurrentState) => {
    return new Promise(async (resolve) => {
      console.log(storeContent);
      resolve();
    });
  };
);


```

</details>

### Change the state of the store

- ```change(propId: String, newVal: Any, needsRedraw: Boolean): Promise<>```: Changes the value of the selector with the given id. *needsRedraw* prop defaults to true and specifies if the change on the selector's value should trigger the callback, in case the selector has *redraw* to true in the specification.
- ```triggerGetValues(id: String): Promise<Any>```: Triggers the *getValues* method of the selector with the given id. Returns the promise returned by the implementation of the *getVlues* method passed on store creation.
- ```setSelector(selectorId: String, newVal: Any, deep: Boolean): Promise<>```: Changes the value of the selector with the given id. If *deep* is true or the selector isn't of type *date* and doesn't have items, *setSelector* will call *getValues* to porpulate the selector's items.  
- ```setItems(id: String, values: Array, useSpecConfig: Boolean): void```: Sets the items of the specified store element to the parameter *values*. If *useSpecConfig* is true, it will check the spec to set the selector's default value.

##### Important when setting a new value on a selector

Both *change* and *setSelector* functions may reject their returned promises when the value to be set is not found on the selector's items. This is not relevant if the selector has type "date".

### Get the state of the store

- ```getSelector(selectorId: String): Proxy```: Returns the value of the selector with the given id).
- ```(getter) objFromObservable(): Array<{id: String, value: Any}>```: Returns a copy of the actual state of the store.
- ```getUI(): Array<{id: String, label: String, value: Any, type: String, items: []}>```: Returns a list of objects that contains the basic information about every observable element so they can be displayed on the UI.

### Import and Export Store URL

For importing and exporting the store, you can use the methods:

- ```exportStoreEncodedURL(): String```: Returns an encoded URL with the current state of the store.
- ```importStoreEncodedURL(url): void```: Parses the URL and sets the state of the store).
- ```(independent from store) parseUrl(url,jsonSpec): Object<key,value>```: Returns the decoded URL, this method can be called without instantiating the store, to parse an URL before store creation.

<details>
<summary>Example of url import/export</summary>

```js
import {
  createStore, parseUrl
} from "./magical-state/index";

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

</details>

## Store Events

The store will dispatch the next events:

- *redrawFulfilled*: It is dispatched after completing the execution of the callback function.

- *itemsLoaded*: It is dispatched after retrieving the items of a selector through the use of the *getValues* function.

- *change*: Dispatched when a selector has changed its value.

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

```parseUrl(url,jsonSpec): Object<key,value>``` Returns the decoded URL.

## Vue2 Components

The library provides some vue2 components that work against a store. You cand find how to use them at: [vue2-components](/src/components/vue2-components/).

### :pencil:  Examples

Extended examples at: [Examples](/examples).

## Changelog

[CHANGELOG.md](https://gitlab.lbd.org.es/proyectos-sig/magical-state/-/blob/main/CHANGELOG)

In order to automate CHANGELOG update, developers should write commit messages following [Angular Commit Message Conventions](https://semantic-release.gitbook.io/semantic-release/#commit-message-format)

## License

[MIT](http://opensource.org/licenses/MIT)
