import { InterfaceGetters } from "../../index";

class MyInterface extends InterfaceGetters {
  async getValues(propId, params) {
    switch (propId) {
      case "SPATIAL_AGGREGATION":
      return await [{
        label: "country-level",
        value: "COUNTRY",
      },{
        label: "region-level",
        value: "REGION",
      }]
      case "SPATIAL_FILTER":
      switch (params) {
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
    }
  }
}

export default new MyInterface();
