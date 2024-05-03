export default async (propId, items, store, prevVal) => {
  return new Promise((resolve) => {
    switch (propId) {
      case "INSTANT_FILTER":
        resolve(items[items.length - 1].value);
        break;
      case "CURRENT_PAGE":
        resolve(0);
        break;
      default:
        resolve();
        break;
    }
  });
};
