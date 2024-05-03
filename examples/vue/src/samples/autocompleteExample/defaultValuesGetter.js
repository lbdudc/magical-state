export default async (propId, items, store, prevVal) => {
  return new Promise((resolve) => {
    switch (propId) {
      case "SPATIAL_AGGREGATION":
        resolve([items[0].value]);
        break;
      case "SPATIAL_FILTER":
        resolve(items[1].value);
        break;
    }
  });
};
