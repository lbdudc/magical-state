const comunities = ["GALICIA", "EXTREMADURA"];
const provinces = [
  "A CORUÑA",
  "LUGO",
  "OURENSE",
  "PONTEVEDRA",
  "CACERES",
  "BADAJOZ",
];
const mobArea = ["HOOD", "STREET"];
const years = ["2022", "2021", "2020"];
const months = ["JANUARY", "FEBRUAY", "MARCH"];

async function getSpatialFilterItems(filter) {
  await sleep(2000);
  switch (filter) {
    case "AUTONOMOUS_COMMUNITY":
      return new Promise((resolve) => {
        resolve(comunities);
      });
    case "PROVINCE":
      return new Promise((resolve) => {
        resolve(provinces);
      });
    case "MOBILITY_AREA":
      return new Promise((resolve) => {
        resolve(mobArea);
      });
  }
}

async function getTemporalFilterItems(filter) {
  await sleep(2000);
  switch (filter) {
    case "YEARLY":
      return new Promise((resolve) => {
        resolve(years);
      });
    case "MONTHLY":
      return new Promise((resolve) => {
        resolve(months);
      });
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default { getSpatialFilterItems, getTemporalFilterItems };
