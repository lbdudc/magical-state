import InterfaceGetters from "../../../../src/interface";
import aggregationService from "../../mockServices/aggregationService";
import filterService from "../../mockServices/filterService";

export default class MyInterface extends InterfaceGetters {
    async getValues(propId, params, store) {
        switch (propId) {
            case "SPATIAL_AGGREGATION":
                return aggregationService.getSpatialItems();
            case "TEMPORAL_AGGREGATION":
                return aggregationService.getTemporalItems();
            case "TEMPORAL_FILTER":
                return filterService.getTemporalFilterItems(params);
            case "SPATIAL_FILTER":
                return filterService.getSpatialFilterItems(params);
        }
    }
}
