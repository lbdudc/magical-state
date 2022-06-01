import aggregationService from "../../mockServices/aggregationService";
import filterService from "../../mockServices/filterService";

export default async (propId, params, store) => {
  switch (propId) {
    case "SPATIAL_AGGREGATION":
      return aggregationService.getSpatialItems();
    case "SPATIAL_FILTER":
      return filterService.getSpatialFilterItems(params);
  }
}
