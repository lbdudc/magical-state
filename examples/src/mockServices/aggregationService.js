const spatialItems = [{ label: "AUTONOMOUS_COMMUNITY", value: 1 }, { label: "PROVINCE", value: 2 }, { label: "MOBILITY_AREA", value: 3 }];

const temporalItems = [{ label: "mockLabels.year", value: 1 }, { label: "mockLabels.month", value: 2 }];

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
