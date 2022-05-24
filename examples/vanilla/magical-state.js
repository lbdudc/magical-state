export default async (propId, params) => {
  switch (propId) {
    case "SPATIAL_AGGREGATION":
      return await [{
        label: "country-level",
        value: "COUNTRY",
      }, {
        label: "region-level",
        value: "REGION",
      }]
    case "SPATIAL_FILTER":
      switch (params["SPATIAL_AGGREGATION"]) {
        case "COUNTRY":
          return await [{
            label: "España",
            value: "SPAIN"
          }, {
            label: "Francia",
            value: "FRANCE"
          }];
        case "REGION":
          return await [{
            label: "Galicia",
            value: "GALICIA"
          }, {
            label: "Asturias",
            value: "ASTURIAS"
          }];
      }
    case "INSTANT_FILTER":
      const date = new Date(params.DATE_FILTER);
      const today = new Date();
      console.log(today.getDate() - 5)
      if (date > today.setDate(today.getDate() - 5)) {
        return await [{
          value: [2022, 3, 31, 15, 20],
          label: "15:20",
        },
        {
          value: [2022, 3, 31, 16, 0],
          label: "16:00",
        }];
      } else {
        return await [{
          value: [2022, 3, 31, 9, 20],
          label: "09:20",
        },
        {
          value: [2022, 3, 31, 9, 30],
          label: "09:30",
        }];
      }
  }
}

