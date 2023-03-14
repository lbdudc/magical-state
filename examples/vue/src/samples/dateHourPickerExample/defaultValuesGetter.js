export default async (propId, items, store, prevVal) => {
  return new Promise((resolve) => {
    switch (propId) {
      case "DATE_FILTER":
        resolve("2022-01-23");
        break;
    }
  });
};
