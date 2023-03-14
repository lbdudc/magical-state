function formatDateInverse(date) {
  if (date) {
    let currentDate = date;
    // if date is in milliseconds
    if (!(date instanceof Date)) {
      let milliseconds = typeof date == "string" ? parseInt(date) : date;
      currentDate = new Date(milliseconds);
    }
    let year = currentDate.getFullYear();
    let month = ("0" + (currentDate.getMonth() + 1)).slice(-2);
    let day = ("0" + currentDate.getDate()).slice(-2);
    return year + "-" + month + "-" + day;
  }
}

export default async (propId, items, store, prevVal) => {
  return new Promise((resolve) => {
    switch (propId) {
      case "TEMPROAL_FILTER":
        resolve(items[items.length - 1].value);
        break;
      case "DATE_FILTER":
        resolve(formatDateInverse(new Date()));
        break;
      default:
        resolve();
        break;
    }
  });
};
