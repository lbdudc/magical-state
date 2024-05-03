const spatialItems = [
  { label: "AUTONOMOUS_COMMUNITY", value: 1 },
  { label: "PROVINCE", value: 2 },
  { label: "MOBILITY_AREA", value: 3 },
];

const temporalItems = [
  { label: "YEARLY", value: 1 },
  { label: "MONTHLY", value: 2 },
];

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

export default { getSpatialItems, getTemporalItems };
