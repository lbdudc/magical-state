import spec from "./spec.json";
import getValues from "./magical-state";
import { Store } from "../../index.js";

const cb = (state) => {
  console.log("Updated state");
  console.log(state);
}
const store = new Store(spec, getValues, null, cb);


let crearSelect = (spec) => {
  const s = document.createElement("select");
  s.id = spec.id;
  s.label = spec.label;
  s.addEventListener("input", (v) => {
    store.change(s.id, v.target.value)
  })
  document.getElementById("app").appendChild(s);
}

function populateSelector(event) {
  const selectorId = event.detail.id;
  const selector = store.getSelector(selectorId);
  let hSelec = document.getElementById(selectorId);
  while (hSelec.options.length > 0) {
    hSelec.remove(0);
  }
  selector.items.forEach(option => {
    const o = document.createElement("option");
    o.value = option.value;
    o.innerText = option.label;
    hSelec.options.add(o);
  });

  hSelec.value = selector.value;
}

document.addEventListener("itemsLoaded", populateSelector);

store.observable.forEach(select =>
  crearSelect(select)
);