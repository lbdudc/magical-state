const oddPage = [
  {
    value: [2022, 3, 31, 15, 20],
    label: "15:20",
  },
  {
    value: [2022, 3, 31, 15, 25],
    label: "15:25",
  },
  {
    value: [2022, 3, 31, 15, 30],
    label: "15:30",
  },
  {
    value: [2022, 3, 31, 15, 35],
    label: "15:35",
  },
  {
    value: [2022, 3, 31, 15, 40],
    label: "15:40",
  },
];

const evenPage = [
  {
    value: [2022, 3, 31, 16, 20],
    label: "16:20",
  },
  {
    value: [2022, 3, 31, 16, 25],
    label: "16:25",
  },
  {
    value: [2022, 3, 31, 16, 30],
    label: "16:30",
  },
  {
    value: [2022, 3, 31, 16, 35],
    label: "16:35",
  },
  {
    value: [2022, 3, 31, 16, 40],
    label: "16:40",
  },
];

async function getInstants(params) {
  const f = async () => {
    await sleep(500);
    return new Promise((resolve) => {
      if (params["CURRENT_PAGE"] == 3) {
        resolve([]);
      }
      if (params["CURRENT_PAGE"] % 2) {
        resolve(oddPage);
      } else {
        resolve(evenPage);
      }
    });
  };
  return await f();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default { getInstants };
