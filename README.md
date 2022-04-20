# magical-state

![plot](./assets/logo.png)

## Introduction

This library manages the global state of a series of selectors that can be easily defined through configuration files.

## Installation

Add the dependency for your proyect into `package.json`

```json
"magical-state": "git+https://gitlab.lbd.org.es/publico/magical-state.git"
```

## Usage

You can see a more detailed example in the folder `./examples` inside this project.

Steps to follow are:

1. Define [`specification.json`](#define-a-specificationjson-file)
2. Create an [interface implementation](#add-the-implementation-of-fetching-data)
3. Create an [store](#create-the-store)
4. [Change the current status](#update-the-selectors-state-optional) of the store
4. Add the [.vue components (optional)](#add-component-selectors-optional)

### Define a `specification.json` file

To begin with, we must define in a .json file which selectors we want to create, and the way in which these selectors are related to each other.

To do this we define an array of objects.

| name                | type    | default   | description                                                                                                                     |
|---------------------|---------|-----------|---------------------------------------------------------------------------------------------------------------------------------|
| id                  | string  |           | Identifier of the selector, must be unique                                                                                      |
| label               | string  | undefined | Label to be placed in the label field of the selector                                                                           |
| group               | String  | undefined | Identifies the selector within a group. Used to bundle selectors into a single component                                        |
| setItemsOnMounted   | boolean | true      | It can be specified if we want the selector to load data when it is rendered for the first time                                 |
| setDefaultFirstItem | boolean | false     | You can specify if you want the first element to be selected by default when loading the data                                   |
| redraw              | boolean | false     | If this option is selected. the callback defined in the store will be fired whenever the @change event of the selector is fired |
| actions             | array   | []        | List of identifiers of child selectors, for which an @change event will be fired every time the parent's @change event is fired
| required             | array   | []        | List of identifiers of required selectors, the @change will trigger only if all the required selectors have a value distinct of null. Also if any of the required selectors change, set this selector to null  |

Example of an `specification.json`

```json
[
  {
    "id": "SPATIAL_AGGREGATION",
    "label": "Spatial Aggregation",
    "group": "Aggregation",
    "setItemsOnMounted": true,
    "setDefaultFirstItem": true,
    "redraw": true,
    "actions": [
      "SPATIAL_FILTER"
    ]
  },
  {
  "id": "SPATIAL_FILTER",
  "group": "Filter",
  "setDefaultFirstItem": true,
  "label": "Spatial Filter",
  "actions": [],
  "required": [
    "SPATIAL_AGGREGATION"
    ]
  }
]
```

---

#### **IMPORTANT**

You must be careful with defining cyclic dependencies between selectors, and that the identifiers of the children are defined in the specification

---

### Add the implementation of fetching data

We must define how we are going to want to retrieve the necessary information to populate each of our selectors.

To do this, we extend the interface provided by the library, and implement the 'getValues' method.

We create a new interface `MyInterface.js`

```js
import { InterfaceGetters } from "magical-state/index";

export default class MyInterface extends InterfaceGetters {
  async getValues(propId, params) {
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
}
```

`propId:` Name of the selector from which we want to retrieve the possible values ​​to populate the selector.
`parentValue:` Name of the value returned by the parent selector.
`store`:  List of objects {id: "id", value: "value"} representing actual state of the store.

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

Into your component (normally a .vue file), import your `specification.json` and your `implementation.js` files, then create the store.

```js
import jsonSpec from "./specification.json";
import MyInterface from "./storeImpl.js";
import {
  Store
} from "./magical-state/index.js";

...
...
...

this.implementacion = new MyInterface();
this.store = new Store(jsonSpec, this.implementacion, (currentState) => {
  console.log(`Your current state is: [${currentState}]`);
});
```

### Update the selectors state (optional)

You can change the current status of the selected values of the store by calling the `setState` method of the store.

```js
   this.store.setState(newState, executeCallback , customCallback);
```

**newState**: Object with the key/values of the identifiers of the selectors (defined into de spec.json) and the values to be set.

```json
   [
     {
    "id": "SPATIAL_AGGREGATION",
    "value": "PROVINCE"
   },
   {
    "id": "SPATIAL_FILTER",
    "value": "A CORUÑA"
   }
   ]
```

**executeCallback:** Boolean. If true, the callback defined in the store will be executed.

**customCallback:** Function. If you want you can execute a custom callback instead of the callback defined when defined the store.

### Add component selectors (optional)

Then you normally would like to add the m-selector components, given by the library into your `component.vue`

```js
import {
  MSelector,
} from "./magical-state/index.js";
```

```html
  <m-selector :store="store" id="SPATIAL_AGGREGATION"> </m-selector>
```

| name                | type    | default   | description                                                                                                                     |
|---------------------|---------|-----------|---------------------------------------------------------------------------------------------------------------------------------|
| store               | Object  |           | The instance of the store created by the library                                                                                |
| id                  | string  | undefined | Identifier of the selector to be rendered (must coincide with the id defined into the specification.json file)                  |
| group               | String  | undefined | Identifier of the group you want to render. Renders all the selectors with de field 'group' with the same value                 |
| i18n               | Function  | undefined | Function to i18n the labels of the selectors                 |

## Changelog

[CHANGELOG.md](https://gitlab.lbd.org.es/proyectos-sig/magical-state/-/blob/main/CHANGELOG)

## License

[MIT](http://opensource.org/licenses/MIT)
