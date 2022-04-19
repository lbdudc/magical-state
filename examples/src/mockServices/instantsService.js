const instants = [
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

const instantsb = [
  {
    value: [2022, 3, 31, 15, 20],
    label: "15:20",
  },
  {
    value: [2022, 3, 31, 15, 25],
    label: "15:25",
  },
];

let a = false;

async function getInstants(params) {
  a = !a;
  const f = () => {
    return new Promise((resolve) => {
      if (a) {
        resolve(instants);
      } else {
        resolve(instantsb);
      }
    });
  };
  return await f();
}

export default { getInstants };
