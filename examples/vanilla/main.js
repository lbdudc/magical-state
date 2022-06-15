import spec from "./spec.json";
import getValues from "./magical-state";
import { createStore } from "../../index.js";

const cb = (state) => {
  return new Promise(async (resolve) => {
    console.log("Updated state");
    console.log(state);
    resolve();
  });
}
const store = createStore(spec, getValues, null, cb);


let createSelector = (selector) => {
  let s = document.createElement("select");
  s.id = selector.id;
  s.label = selector.label;
  s.addEventListener("input", (v) => {
    store.change(s.id, v.target.value)
  })
  document.getElementById("app").appendChild(s);
}

let createDatePicker = (selector) => {
  let input = document.createElement('input');
  input.id = selector.id;
  input.label = selector.label;
  input.type = 'date';
  if (selector?.value) {
    input.value = selector.value;
  }
  input.addEventListener("input", (v) => {
    store.change(input.id, v.target.value)
  })
  const container = document.getElementById("app");
  container.appendChild(input);
}

function populateSelector(event) {
  const { id, type, items, value } = event.detail;
  let hSelec = document.getElementById(id);
  while (hSelec.options.length > 0) {
    hSelec.remove(0);
  }
  if (type == 'select') {
    items.forEach(option => {
      const o = document.createElement("option");
      o.value = option.value;
      o.innerText = option.label;
      hSelec.options.add(o);
    });
  }

  hSelec.value = value;
}

document.addEventListener("itemsLoaded", populateSelector);

store.getUI().forEach(selector => {
  switch (selector.type) {
    case "select":
      createSelector(selector);
      break;
    case "date":
      createDatePicker(selector);
      break;
  }
}
);