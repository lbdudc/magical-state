function itemSelection(newEl, items, positions) {
  let pos = items.findIndex((el) => {
    return el.value == newEl;
  });

  let notOnInitPos = true;
  let aux = null;
  while (notOnInitPos) {
    const deeper = Object.keys(positions).filter(
      (el) =>
        positions[el] >= pos &&
        (!aux || aux > positions[el])
    );
    if (deeper.length == 0) {
      notOnInitPos = false;
    } else {
      aux = pos;
      pos = pos - deeper.length;
    }
  }
  positions[newEl] = pos;
  //push the new element to the first position of the items
  const selected = items.splice(
    items.findIndex((el) => {
      return el.value == newEl;
    }),
    1
  );
  items.unshift(selected[0]);

  return { items, positions };
}

function itemDeselection(values, items, positions) {
  const key = Object.keys(positions).find(
    (el) => values.find((v) => v == el) == null
  );
  const el = items.find((el) => el.value == key);
  items.splice(
    items.findIndex((el) => el.value == key),
    1
  );
  //count the elements that should be positioned after the deselected element
  let toAdd = 0;
  values.forEach(
    (el) =>
    (toAdd =
      positions[el] > positions[key] ? toAdd + 1 : toAdd)
  );
  items.splice(positions[key] + toAdd, 0, el);
  delete positions[key];

  return { items, positions };

}

export default {
  itemSelection,
  itemDeselection
}