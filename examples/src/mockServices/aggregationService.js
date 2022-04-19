const spatialItems = ["AUTONOMOUS_COMMUNITY", "PROVINCE", "MOBILITY_AREA"];

const temporalItems = ["YEARLY", "MONTHLY"];

async function getSpatialItems() {
  const f = () => {
    return new Promise((resolve) => {
      resolve(spatialItems);
    });
  };
  return await f();
}

async function getTemporalItems() {
  const f = () => {
    return new Promise((resolve) => {
      resolve(temporalItems);
    });
  };
  return await f();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default { getSpatialItems, getTemporalItems };
