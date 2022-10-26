# CHANGELOG

<!--- next entry here -->

## 0.25.1
2022-10-26

### Fixes

- **datefiltercomponent:** Added 'firstDayOfWeek' prop (3b52d996df3c626d6117e43b73a4b558902d0e1b)
- Fixed bug with labels (220cc892309f6cf0e4ba67d613e55fd045693374)

## 0.25.0
2022-10-24

### Features

- Changes on rules so that they are completely managed from the store (5655adaec2f4b8f46be9486dccdbeb44dde3bf59)

## 0.24.1
2022-10-19

### Fixes

- Fixed dates validation (2d99f6bf9c1b423065c97898229f6537274d15cd)

## 0.24.0
2022-09-22

### Features

- Added type prop (77e776f39813a4f94f9e67cde01147da50be0439)

## 0.23.0
2022-09-08

### Features

- added prop to close date picker component after a selection is made (df3ca24711e9c2474bab04a050950d045d6a5332)

## 0.22.0
2022-09-02

### Features

- preventing callback from triggering where there are erros on the selectors (0fe3620cc6b1867e33bc409214dce72aca339914)

## 0.21.0
2022-08-31

### Features

- implemented internacionalization (7582570c946dc845fd11cca8e203fb61f14b504f)

## 0.20.0
2022-08-31

### Features

- Added rules and restrictions to all components (2f89d2e2dadc7264f74ae9b9aec480e525847a97)

### Fixes

- updated documentation to cover the new coponents' props (e2ef82eb1b4cebb713f3b5663685fcc835e7acf3)
- error on const assigntment (df56de6138a5f909ce20d7b4312277370bed11c6)

## 0.19.0
2022-08-30

### Features

- Added check to prevent setting default boolean values to strings (815d18c0712cb864312fe5bcb4c3918a20787f83)

## 0.18.0
2022-08-24

### Features

- Retrieving the deselected elements to their original positions when the selectors are multiple and expected to push selected items up (80318530ce68b99d2790e07ef70224c40200625e)

## 0.17.0
2022-07-14

### Features

- showing first the selected elements on selectors that accept multiple values (0fe8a514de8bd9ce9ec773a24242da083832f67a)

## 0.16.0
2022-07-11

### Features

- removing sharedProps index from the store and managing it from timeline and list components (da4336eec081e97687b9ab8b150ab07ddd9be8b2)
- added prop to vue2 components to not trigger the store reactivity when changing values (37abe5a74c241a215bccceda2831d0814ebd8d38)

### Fixes

- added execution of change method when the child element is setting its newValue to null and has actions (08b4bd137dbd6be2f85c7d86d0862d66b16c9ee9)

## 0.15.0
2022-06-29

### Features

- added magical text field selector (2dafc6da1c1d6ba6de26c5d94a0e38ea1d31e061)
- added hour picker component (f1edc07f5cf2951fba444b45872c770c3487f6ed)

### Fixes

- added documentation for vue components (8363766dcdd3a354d2136f9b1aa3cf349548d3cf)
- setting selectos value to null when it has no items (3429043030af45925ec06aad9a98ee152dac17f6)

## 0.14.0
2022-06-28

### Features

- added setDefaultItem spec parameter and changed methods promises (01f58429c6a213befb199c39ab2185bf3fc3b1e1)
- removed unwanted condition to disable the 'now' button on the timeline component (f4f11ccb15c9c476a64175ac5e442e14598bbe88)
- added emits to notify parent component that the slider is set on the last or first element (8b75659ab9a45783f303ddfd4e115473d9652354)

### Fixes

- added conditions to set value when the selector is of type date (878dc5fd997cad9a3ccf5f8d42d94823c264e3ef)
- changes on documentation content and structure (0ce5d18d39072668389476e6f64382dc60ae1500)
- changed parameter on getValues call to use the state passed on creation (66f36244eb8d4fb30445409fc552e67b6c1a7792)
- fixed conditions to trigger the callback (d690f4a9a63cd0d2fa15c912536dff06edfd5490)

## 0.13.1
2022-06-15

### Fixes

- setting instantSelectorButtonLabel required to false (d5543020ac2799cf990837fba382485326452917)

## 0.13.0
2022-06-15

### Breaking changes

#### changed exports of static method parseUrl (fe0d71949488a2339685cb63fdd18a58943fae3f)

the method parseUrl is now independent from the store class

### Features

- added tests related to stores state (d03bc5267500c098d58a3dfa7ffae53813258a11)
- added type of newValue check (04f88155282129c51fef1b672829c8ee38c8737b)

### Fixes

- fixed setState's and setSelector's conditionals used to check if the new value is part of the selector items (178a661849ba4d58c260831d4bf2d91df2cae8fb)

## 0.12.0
2022-06-08

### Features

- Added testing for store dispatched events (785f6e24cf807d8514f900e03e8aaec2f6068787)

## 0.11.0
2022-06-08

### Features

- Added new async constructor "createStore" (f81ba5318c7ed3152153cfe8d8c9016ff0e200c1)

## 0.10.0
2022-06-03

### Features

- changes on timeline and list selectors to work agains storeElement values instead of indices (af1eb868312c22c86a6f959cb9b495ecccb4bbb0)
- added promises to control slider's advance pace (ebfbd7c7dcdd3f4cc32384b6d60a0d727b0a7270)
- added 'now' button with option to pass a custom function (3f1815242e786fe3944ecc2bf4061bd6fc5a391d)
- added type 'multiple' to specification to work with multiple value selectors (a553d50904a1039c166158c58f281617dd21a187)
- added set store element items functionality (c512efc281e8b6267101d49ab94134989f41793b)
- Added @change event to the components (a2f1cf6472415522f7c419628cbaf61e0518ea04)

## 0.9.0
2022-05-27

### Features

- added tests for dispatched events (6e83807ae4fe0f371b4e40a1d85d8007476db18a)
- Added triggerGetValues(id) method (7eb90ca8d3613671aaa488d8d4bb184368c5ae4f)

### Fixes

- Fixed store setSelector method (242e321309b1f10f387edebdfdfd110220252570)

## 0.8.0
2022-05-24

### Features

- added ui object on store and a date picker in vanilla js example (3ce20a18d915b27f4e896bac5f8b658ff7dfacc6)
- Added separate i18nItems / i18nLabel functions to mSelector (caab73040864facaf69b54f6164187a6916371b7)
- Added disabled property to mSelector and mAutocomplete (f893d5830e5285c28a70e3460d10ec690a0c6d4e)

## 0.7.0
2022-05-24

### Features

- added events and eventListeners to handle changes on selectors (32cdc0abce230b00b5e46105fc64fb43376a0653)
- added event listener removal (57c65457d77dd577e1dae59c85dfa45363f4f240)
- Added new method to parse encoded URL (06d0188a99d6dbeb14a287d96b7f72b1acd30122)
- Added new param on store constructor, to set a initial state (with an encoded URL or an object) (6f5bc851f74d5707ba46416f9b838ade33a3a63e)
- Changed the second param on GetValues function, now retireves object with key/values of related elements (33fd2909e75920e7eca2aa25077682266a8bf5ca)

### Fixes

- Added new basic tests with jest (cc8f41230934edd9721eceeb6ae6d6fb00d3ada3)
- Changed returning value in the callback function (5d2515df67150b54f64f6833e62b8446e3dc6907)
- Updated parse/encodeURL methods, now returning proper object / fixed import object when creating the store (7c769369388d4326165a361e9a4c93d3952338c4)

## 0.6.0
2022-05-13

### Breaking changes

#### Changed the way vue2-components are imported / deleted from index to be more vanilla (bf97d615440d00fe756410524a256096326fd120)

changed the way import the vue components

### Features

- Changed interfaceGetters to a getValues method only (a41de54cd486379195770a2191d094882ec1d0c2)
- Added import/export URL methods encoded/decoded in base64 (5efcb8e47706aed64956ca5067fd2a7ed654f388)

## 0.5.1
2022-05-09

### Fixes

- Added onchange event only when all the children are finished (f89ee02792b5841390eb6a737e3dbdfe925db3d4)

## 0.5.0
2022-04-29

### Features

- Added more visual customization on mSelect and mAutocomplete components (16c0df249890889132640691f6e9aea6293a686d)

## 0.4.1
2022-04-28

### Fixes

- Await for items on parent selector to check if we can vhange the value (1e01adf1186729f76c7931259e32dae845be3f9d)

## 0.4.0
2022-04-28

### Features

- Added type date to specification (43b51de17d7f1cb7d03310bcc653030e3ceb104e)

### Fixes

- Condition to check if the value is in the posible items to be set in the SetState method (c3fb56a7ee843ac3297cf8465fb056fc5256a2b1)
- Check if its a date in setState method (e3e87fd098de93906f112b37c200a08be054e67a)

## 0.3.0
2022-04-28

### Features

- Created getSelector function to retrieve obsrvable with a given id (0f691ee3fe087a452e7fac7b537d8725607ac94d)

## 0.2.1
2022-04-28

### Fixes

- Error on index import of mAutocomplete component (32a6bb77c5bb92a22cdb9f3a4241f82f22a5efcd)

## 0.2.0
2022-04-28

### Features

- Added new component: mAutocomplete (820c3f603c96659dca4973b45aa29bb2c1843438)

## 0.1.0
2022-04-21

### Features

- Added CHANGELOG automation (7a48409467877f795d482fd1b023e8f86ceabd1e)
- Added commit messages instructions to README (7fdcabb3f4e823c17decc8954c64f35520f8d366)
- Added onChange event to all the components (b5a1475bbcb8fc739953867cd751ab1f3dfa090a)
- Updated the examples with the new onChange event (9da37b70d24beb36fced79f9b16271dffe688b78)
- Updated README with group property deleted and change event added (f8a7c1eb4195a8e2e7482553841fbcb8b2a671c7)

## 0.1.0
2022-04-21

### Features

- Added CHANGELOG automation (7a48409467877f795d482fd1b023e8f86ceabd1e)
- Added commit messages instructions to README (7fdcabb3f4e823c17decc8954c64f35520f8d366)