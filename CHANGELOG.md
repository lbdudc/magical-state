# CHANGELOG

<!--- next entry here -->

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