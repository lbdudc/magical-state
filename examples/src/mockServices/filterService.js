const comunities = [{ label: "GALICIA", value: 1 }, { label: "EXTREMADURA", value: 2 }];
const provinces = [
  { label: "A CORUÑA", value: 1 },
  { label: "LUGO", value: 2 },
  { label: "OURENSE", value: 3 },
  { label: "PONTEVEDRA", value: 4 },
  { label: "CACERES", value: 5 },
  { label: "BADAJOZ", value: 6 },
];
const mobArea = [{ label: "HOOD", value: 1 }, { label: "STREET", value: 1 }];
const years = [{ label: "2022", value: 2022 }, { label: "2021", value: 2021 }, { label: "2020", value: 2020 }];
const months = ["JANUARY", "FEBRUAY", "MARCH"];

async function getSpatialFilterItems(filter) {
  await sleep(2000);
  switch (filter) {
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
  switch (filter) {
    case 1:
      return new Promise((resolve) => {
        resolve(years);
      });
    case 2:
      return new Promise((resolve) => {
        resolve(months);
      });
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default { getSpatialFilterItems, getTemporalFilterItems };
