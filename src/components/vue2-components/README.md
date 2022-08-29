# Vue2-Components

## Table of contents

- [Usage](#usage)
- [Common props](#common-props)
- [Autocomplete Component](#autocomplete-component)
- [Date Filter Component](#date-filter-component)
- [Hour Picker Component](#hour-picker-component)
- [List Selector Component](#list-selector-component)
- [Selector Component](#selector-component)
- [Text Field Component](#text-field-component)
- [Timeline Component](#timeline-component)

## Usage

Import the selectors from the library and define them in the components of your .vue file:

```js

import { MSelector, MDateFilter } from "magical-state/vue2-components";

...
...

export default {
  ...
  ...
  components:{ MSelector, MDateFilter }
  ...
  ...
}

```

## Common props

All the components have the next props in common:

|  name |   type   | required | default |                        description                       |
|:-----:|:--------:|:--------:|:-------:|:--------------------------------------------------------:|
| store |  Object  |   true   |   null  |                 The instance of the store                |
|   id  |  String  |   false  |   null  | Id of the store element that the component works against |
|  i18n | Function |   false  |   null  |     Function used forinternationalization of labels      |

## Autocomplete Component

The autocomplete component extends the magical selector and adds the ability to filter items.

<details>
<summary>Autocomplete props</summary>

|       name       |   type  | required | default     | description                                                                            |
|:----------------:|:-------:|:--------:|-------------|----------------------------------------------------------------------------------------|
|     clearable    | Boolean |   false  | false       | Add input clear functionality, default icon is Material Design Icons  mdi-clear        |
|     disabled     | Boolean |   false  | false       | Disables the input                                                                     |
|     outlined     | Boolean |   false  | false       | Applies the outlined style to the input                                                |
| dense            | Boolean | false    | false       | Reduces the input height                                                               |
| appendIcon       | String  | false    | "$dropdown" | Appends an icon to the component, uses the same syntax as v-icon                       |
| appendOuterIcon  | String  | false    | null        | Appends an icon to the outside the component’s input, uses same syntax as v-icon       |
| prependIcon      | String  | false    | null        | Prepends an icon to the component, uses the same syntax as v-icon                      |
| prependInnerIcon | String  | false    | null        | Prepends an icon inside the component’s input, uses the same syntax as v-icon          |
| color            | String  | false    | null        | Applies specified color to the control                                                 |
| backgroundColor  | String  | false    | null        | Changes the background-color of the input                                              |
| itemColor        | String  | false    | "primary"   | Sets color of selected items                                                           |
| chips            | Boolean | false    | false       | Changes display of selections to chips                                                 |
| smallChips       | Boolean | false    | false       | Changes display of selections to chips with the small property                         |
| deletableChips   | Boolean | false    | false       | Adds a remove icon to selected chips                                                   |
| filled           | Boolean | false    | false       | Applies the alternate filled input style                                               |
| solo             | Boolean | false    | false       | Changes the style of the input                                                         |
| flat             | Boolean | false    | false       | Removes elevation (shadow) added to element when using the solo or solo-inverted props |
| reverse          | Boolean | false    | false       | Reverses the input orientation                                                         |
| hint             | String  | false    | null        | Hint text                                                                              |
| persistentHint   | Boolean | false    | false       | Forces hint to always be visible                                                       |
|  overrideStoreChange | Boolean |   false  |   false  |     When true the component will not trigger the store reactivity, only the value of the selector will change, but the @change emit will still be dispatched. This way the parent component using the vue2-component will be able to define its own store reactivity after a selector value change.       |
|  pushSelectedValuesUp | Boolean |   false  |   false  |     When the selector is multiple and this prop is true the selected elements will be pushed up the item's array so they are displayed in the first positions    |
|  rules | Array |   false  |   []  |     Accepts a mixed array of types function, boolean and string. Functions pass an input value as an argument and must return either true / false or a string containing an error message. The input field will enter an error state if a function returns (or any value in the array contains) false or is a string    |

</details>

<details>
<summary>Autocomplete emits</summary>

|       name       |   param   |                                                                                    description                                                                                    |
|:----------------:|:---------:|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
|       change       |   Object  | Emitted when the selector suffers a change of value. The object passed will contain the id of the selector and its value {id, val} |
|       input-error       |   String  | Emitted when the selector receives an input that doesn't follow the specified rules. The String passed will represent the id of the selector. |

</details>

## Date Filter Component

The date filter component lets users select a date.

<details>
<summary>Date Filter props</summary>

|   name   |   type  | required | default | description                              |
|:--------:|:-------:|:--------:|---------|------------------------------------------|
| dense    | Boolean | false    | false   | Reduces the input height                 |
| label    | String  | false    | false   | Sets input label                         |
| outlined | Boolean | false    | false   | Applies the outlined style to the input  |
| filled   | Boolean | false    | false   | Applies the alternate filled input style |
| color    | String  | false    | null    | Applies specified color to the control   |
|  overrideStoreChange | Boolean |   false  |   false  |     When true the component will not trigger the store reactivity, only the value of the selector will change, but the @change emit will still be dispatched. This way the parent component using the vue2-component will be able to define its own store reactivity after a selector value change.       |
|  maxValue | String |   false  |   null  |     Maximum allowed date/month (ISO 8601 format).       |
|  minValue | String |   false  |   null  |    Minimum allowed date/month (ISO 8601 format).       |
|  allowedDates | Function |   false  |   null  |     Restricts which dates can be selected      |
|  rules | Array |   false  |   []  |     Accepts a mixed array of types function, boolean and string. Functions pass an input value as an argument and must return either true / false or a string containing an error message. The input field will enter an error state if a function returns (or any value in the array contains) false or is a string    |

</details>

<details>
<summary>Date Filter emits</summary>

|       name       |   param   |                                                                                    description                                                                                    |
|:----------------:|:---------:|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
|       change       |   Object  | Emitted when the selector suffers a change of value. The object passed will contain the id of the selector and its value {id, val} |

</details>

## Hour Picker Component

The hour pciker component lets users select a day time.

<details>
<summary>Hour Picker props</summary>

|       name       |   type  | required | default | description                                                                                                                                                                                                                                                                                                      |
|:----------------:|:-------:|:--------:|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| prependInnerIcon | String  |   false  |   null  | Prepends an icon inside the component’s input, uses the same syntax as  v-icon                                                                                                                                                                                                                                   |
| appendIcon       | String  |   false  |   null  | Appends an icon to the component, uses the same syntax as  v-icon                                                                                                                                                                                                                                                |
| dense            | Boolean |   false  |   null  | Reduces the input height                                                                                                                                                                                                                                                                                         |
| disabled         | Boolean |   false  |   null  | Disable the input                                                                                                                                                                                                                                                                                                |
| readonly         | Boolean |   false  |   null  | Puts input in readonly state                                                                                                                                                                                                                                                                                     |
| rules            | Array   |   false  |   null  | Accepts a mixed array of types function, boolean and string. Functions pass an input value as an argument and must return either true / false or a string containing an error message. The input field will enter an error state if a function returns (or any value in the array contains) false or is a string |
|  overrideStoreChange | Boolean |   false  |   false  |     When true the component will not trigger the store reactivity, only the value of the selector will change, but the @change emit will still be dispatched. This way the parent component using the vue2-component will be able to define its own store reactivity after a selector value change.   |

</details>

<details>
<summary>Hour Picker emits</summary>

|       name       |   param   |                                                                                    description                                                                                    |
|:----------------:|:---------:|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
|       change       |   Object  | Emitted when the selector suffers a change of value. The object passed will contain the id of the selector and its value {id, val} |
|       input-error       |   String  | Emitted when the selector receives an input that doesn't follow the specified rules. The String passed will represent the id of the selector. |

</details>

## List Selector Component

The list selector component is used to display information in a list from which the user can select an item.

<details>
<summary>List Selector props</summary>

|     **name**     | **type** | **required** | **default** |                                               **description**                                              |
|:----------------:|:--------:|:------------:|:-----------:|:----------------------------------------------------------------------------------------------------------:|
| overrideStoreChange |  Boolean |     false    |    false    | When true the component will not trigger the store reactivity, only the value of the selector will change, but the @change emit will still be dispatched. This way the parent component using the vue2-component will be able to define its own store reactivity after a selector value change. |
| max |  number or string |     false    |    false    | Sets a maximum number of selections that can be made. |
| mandatory |  boolean |     false    |    false    |  Forces a value to always be selected (if available). |

</details>

<details>
<summary>List Selector emits</summary>

|       name       |   param   |                                                                                    description                                                                                    |
|:----------------:|:---------:|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
|       change       |   Object  | Emitted when the selector suffers a change of value. The object passed will contain the id of the selector and its value {id, val} |

</details>

## Selector Component

Select fields components are used for collecting user provided information from a list of options.

<details>
<summary>Selector props</summary>

|       name       |   type  | required | default     | description                                                                      |
|:----------------:|:-------:|:--------:|-------------|----------------------------------------------------------------------------------|
| clearable        | Boolean | false    | false       | Add input clear functionality, default icon is Material Design Icons  mdi-clear  |
| disabled         | Boolean | false    | false       | Disables the input                                                               |
| outlined         | Boolean | false    | false       | Applies the outlined style to the input                                          |
| dense            | Boolean | false    | false       | Reduces the input height                                                         |
| appendIcon       | String  | false    | "$dropdown" | Appends an icon to the component, uses the same syntax as v-icon                 |
| appendOuterIcon  | String  | false    | null        | Appends an icon to the outside the component’s input, uses same syntax as v-icon |
| prependIcon      | String  | false    | null        | Prepends an icon to the component, uses the same syntax as  v-icon               |
| prependInnerIcon | String  | false    | null        | Prepends an icon inside the component’s input, uses the same syntax as  v-icon   |
| color            | String  | false    | null        | Applies specified color to the control                                           |
| backgrounColor   | String  | false    | null        | Changes the background-color of the input                                        |
| itemColor        | String  | false    | "primary"   | Sets color of selected items                                                     |
| chips            | Boolean | false    | false       | Changes display of selections to chips                                           |
| smallChips       | Boolean | false    | false       | Changes display of selections to chips with the small property                   |
| deletableChips   | Boolean | false    | false       | Adds a remove icon to selected chips                                             |
| filled           | Boolean | false    | false       | Applies the alternate filled input style                                         |
| solo             | Boolean | false    | false       | Changes the style of the input                                                   |
| reverse          | Boolean | false    | false       | Reverses the input orientation                                                   |
| hint             | String  | false    | null        | Hint text                                                                        |
| persistentHint   | Boolean | false    | false       | Forces hint to always be visible                                                 |
| overrideStoreChange |  Boolean |     false    |    false    | When true the component will not trigger the store reactivity, only the value of the selector will change, but the @change emit will still be dispatched. This way the parent component using the vue2-component will be able to define its own store reactivity after a selector value change. |
|  pushSelectedValuesUp | Boolean |   false  |   false  |     When the selector is multiple and this prop is true the selected elements will be pushed up the item's array so they are displayed in the first positions    |
|  rules | Array |   false  |   []  |     Accepts a mixed array of types function, boolean and string. Functions pass an input value as an argument and must return either true / false or a string containing an error message. The input field will enter an error state if a function returns (or any value in the array contains) false or is a string.    |

</details>

<details>
<summary>Selector emits</summary>

|       name       |   param   |                                                                                    description                                                                                    |
|:----------------:|:---------:|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
|       change       |   Object  | Emitted when the selector suffers a change of value. The object passed will contain the id of the selector and its value {id, val} |
|       input-error       |   String  | Emitted when the selector receives an input that doesn't follow the specified rules. The String passed will represent the id of the selector. |

</details>

## Text Field Component

Text fields components are used for collecting user provided information.

<details>
<summary>Text field props</summary>

|       name       |   type  | required | default | description                                                                                                                                                                                                                                                                                                      |
|:----------------:|:-------:|:--------:|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| prependInnerIcon |  String |   false  |   null  |                                                                                                                  Prepends an icon inside the component’s input, uses the same syntax as  v-icon                                                                                                                  |
|    appendIcon    |  String |   false  |   null  |                                                                                                                         Appends an icon to the component, uses the same syntax as  v-icon                                                                                                                        |
|       dense      | Boolean |   false  |  false  |                                                                                                                                             Reduces the input height                                                                                                                                             |
|     disabled     | Boolean |   false  |  false  |                                                                                                                                                 Disable the input                                                                                                                                                |
|     readonly     | Boolean |   false  |  false  |                                                                                                                                           Puts input in readonly state                                                                                                                                           |
|       rules      |  Array  |   false  |    []   | Accepts a mixed array of types function, boolean and string. Functions pass an input value as an argument and must return either true / false or a string containing an error message. The input field will enter an error state if a function returns (or any value in the array contains) false or is a string |
|       type       |  String |   false  |  'text' |                                                                                                                                                  Sets input type                                                                                                                                                 |
| overrideStoreChange |  Boolean |     false    |    false    | When true the component will not trigger the store reactivity, only the value of the selector will change, but the @change emit will still be dispatched. This way the parent component using the vue2-component will be able to define its own store reactivity after a selector value change. |

</details>

<details>
<summary>Text field emits</summary>

|       name       |   param   |                                                                                    description                                                                                    |
|:----------------:|:---------:|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
|       change       |   Object  | Emitted when the selector suffers a change of value. The object passed will contain the id of the selector and its value {id, val} |
|       input-error       |   String  | Emitted when the selector receives an input that doesn't follow the specified rules. The String passed will represent the id of the selector. |

</details>

## Timeline Component

This component is composed of a slider with dots that represent each item of a selector and some control buttons. These control buttons will allow:

- Start the reproduction of the current interval of items in the slider. This means that the selected value of the slider will be advancing through the items until it reaches the end.

- Stop the interval player.

- Set the speed of the player.

- Trigger a function passed to the component on its props.

<details>
<summary>Timeline props</summary>

|            name            |   type   | required | default |                                  description                                  |
|:--------------------------:|:--------:|:--------:|:-------:|:-----------------------------------------------------------------------------:|
|   instantSelectorFunction  | Function |   false  |   null  | When present the component will have a button that will trigger this function |
| instantSelectorButtonLabel |  String  |   false  |   null  |            The label that will appear on the above mentioned button           |
|       availableSpeeds      |   Array  |   false  |   null  |  Array of objects representing the available speeds of the timeline player.   |
|       disablePlayButton      |   Boolean  |   false  |   false  |  When set to true the play button will be disabled.   |
|       disableStopButton      |   Boolean  |   false  |   false  |  When set to true the stop button will be disabled.   |

<details>
  <summary>Example of availableSpeeds array</summary>

The avaliableSpeeds' objects are expected to have two properties: key, used as the label, and value, used to multiply the default speed of 1 second.

```js
const availableSpeeds = [
  {
    key: "1x",
    value: 1,
  },
  {
    key: "1.5x",
    value: 1.5,
  },
],

```

</details>
</details>

<details>
<summary>Timeline emits</summary>

|       name       |   param   |                                                                                    description                                                                                    |
|:----------------:|:---------:|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
|  lastItemReached |  boolean  |            Emitted when the slider has reached the last item. The flag parameter will be true if the slider was playing and has stopped due to reaching the last item.            |
| firstItemReached | undefined |                                                               Emitted when the slider has reached the first element.                                                              |
|       next       |   Object  |     Emitted when the slider advances on the interval when the user clicks the 'advance' button. The object passed will contain the id of the selector and its value {id, val}     |
|       prev       |   Object  | Emitted when the slider goes backwards on the interval when the user clicks the 'backwards' button. The object passed will contain the id of the selector and its value {id, val} |
|       change       |   Object  | Emitted when the user changes the slider value directly whitout using the 'advance' nor the 'backwards' buttons. The object passed will contain the id of the selector and its value {id, val} |
|       reproductionStarted       |   null  | Emitted when the timeline reproduction starts |
|       reproductionStopped       |   null  | Emitted when the timeline reproduction stops |
|       timelineAdvanced       |   null  | Emitted when the timeline position advances when reproducing it |

</details>
