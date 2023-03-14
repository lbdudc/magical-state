export default async (propId, items, store, prevVal) => {
  return new Promise((resolve) => {
    switch (propId) {
      case "TEMPORAL_AGGREGATION":
        resolve(items[1].value);
        break;
      case "SPATIAL_FILTER":
        if (items != null && items.length > 0) resolve(items[0].value);
        else resolve(null);
        break;
      default:
        resolve(null);
        break;
    }
  });
};
