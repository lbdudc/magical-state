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
