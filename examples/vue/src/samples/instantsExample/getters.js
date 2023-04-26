import instantsService from "../../mockServices/instantsService";

export default async (propId, params, store) => {
  switch (propId) {
    case "INSTANT_FILTER":
      return instantsService.getInstants(params);
  }
};
