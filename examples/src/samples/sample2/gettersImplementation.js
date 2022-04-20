import instantsService from "../../mockServices/instantsService";
import InterfaceGetters from "../../../../src/interface";

export default class MyInterface extends InterfaceGetters {
  async getValues(propId, params, store) {
    switch (propId) {
      case "INSTANT_FILTER":
        return instantsService.getInstants(params);
    }
  }
}
