import aggregationService from "../../mockServices/aggregationService";
import multipleFilterService from "../../mockServices/multipleFilterService";

export default async (propId, params, store) => {
  switch (propId) {
    case "SPATIAL_AGGREGATION":
      return aggregationService.getSpatialItems();
    case "SPATIAL_FILTER":
      return multipleFilterService.getSpatialFilterItems(params);
  }
}
