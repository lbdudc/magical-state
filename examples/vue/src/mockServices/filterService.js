const comunities = [{ label: "GALICIA", value: 1 }, { label: "EXTREMADURA", value: 2 }];
const provinces = [
  { label: "A CORUÑA", value: 1 },
  { label: "LUGO", value: 2 },
  { label: "OURENSE", value: 3 },
  { label: "PONTEVEDRA", value: 4 },
  { label: "CACERES", value: 5 },
  { label: "BADAJOZ", value: 6 },
];
const mobArea = [{ label: "HOOD", value: 1 }, { label: "STREET", value: 2 }];
const years = [{ label: "2022", value: 2022 }, { label: "2021", value: 2021 }, { label: "2020", value: 2020 }];
const months = ["JANUARY", "FEBRUAY", "MARCH"];
const decades = [{ label: "2010-2019", value: 2010 }, { label: "2000-2009", value: 2000 }];
const lustrum = [{ label: "2010-2014", value: 2010 }, { label: "2015-2019", value: 2015 }];

async function getSpatialFilterItems(filter) {
  await sleep(2000);
  switch (filter["SPATIAL_AGGREGATION"]) {
    case 1:
      return new Promise((resolve) => {
        resolve(comunities);
      });
    case 2:
      return new Promise((resolve) => {
        resolve(provinces);
      });
    case 3:
      return new Promise((resolve) => {
        resolve(mobArea);
      });
  }
}

async function getTemporalFilterItems(filter) {
  await sleep(2000);
  switch (filter["TEMPORAL_AGGREGATION"]) {
    case 1:
      return new Promise((resolve) => {
        resolve(years);
      });
    case 2:
      return new Promise((resolve) => {
        resolve(months);
      });
    case 3:
      return new Promise((resolve) => {
        resolve(decades);
      });
    case 4:
      return new Promise((resolve) => {
        resolve(lustrum);
      });
    default:
      return new Promise((resolve) => {
        resolve(["algo"])
      })
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default { getSpatialFilterItems, getTemporalFilterItems };
