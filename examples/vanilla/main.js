import spec from "./spec.json";
import implementation from "./magical-state";
import { Store } from "../../index";

const cb = (state) => {
  console.log("Updated state");
  console.log(state);
}
const store = new Store(spec, implementation, cb);
console.log(store);


function crearSelect(spec) {
  const s = document.createElement("select");
  s.id = spec.id;
  s.label = spec.label;
  spec.options.forEach(option => {
    const o = document.createElement("option");
    o.value = option.value;
    o.innerText = option.label;
  })
  s.addEventListener("click", (v) => {
    store.actualizarValorSelect(spec.id, NuevoValor);
  })
}

store.getSelects().forEach(select => {
  crearSelect(select).addTo(body);
})

document.querySelector('#app').innerHTML = `
  <h1>Hello Vite!</h1>
  <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
`


/**
 * devuelve lista de inputs con sus posibles valores; para los
 * selects es fácil porque son id, label y options, pero para el resto
 * de componentes no sé qué formato debería tener; igual cada objeto
 * devuelto de esta lista debería tener un "type" para identificar el
 * tipo de componente o algo así
 */
const ui = store.getUI();
/**
 * ui.elements = lista de inputs con sus posibles valores; para los
 * selects es fácil porque son id, label y options, pero para el resto
 * de componentes no sé qué formato debería tener; igual cada objeto
 * devuelto de esta lista debería tener un "type" para identificar el
 * tipo de componente o algo así
 *
 * ui.elements se actualiza cuando sea necesario
 */

/**
 * ui.onUpdate = función que sirve para definir qué se hace cuando
 * se actualiza elements
 *
 * recibe un parámetro que a su vez recibe el propio objeto ui;
 * es decir, la implementación sería algo como:
 *
 * onUpdate(callback) {
 *   // código para detectar cuando se actualiza la lista de inputs
 *   callback(this);
 * }
 */
function redraw(ui) {
  ui.elements.forEach(element => {
    documento.createElement(aslbaldfasdf)
  });
}

redraw(ui);
ui.onUpdate(redraw);
