const comunities = [{ label: "GALICIA", value: 1 }, { label: "EXTREMADURA", value: 2 }];
const provinces = [
  { label: "A CORUÑA", value: 3 },
  { label: "LUGO", value: 4 },
  { label: "OURENSE", value: 5 },
  { label: "PONTEVEDRA", value: 6 },
  { label: "CACERES", value: 7 },
  { label: "BADAJOZ", value: 8 },
];
const mobArea = [{ label: "HOOD", value: 9 }, { label: "STREET", value: 10 }];

async function getSpatialFilterItems(filter) {
  let items = [];
  await sleep(2000);
  return new Promise((resolve) => {
    let params = filter["SPATIAL_AGGREGATION"];
    if (!Array.isArray(params)) {
      params = [params];
    }
    params.forEach(element => {
      switch (element) {
        case 1:
          items = items.concat(comunities);
          break;
        case 2:
          items = items.concat(provinces);
          break;
        case 3:
          items = items.concat(mobArea);
          break;
      }
    });
    resolve(items);
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default { getSpatialFilterItems };
