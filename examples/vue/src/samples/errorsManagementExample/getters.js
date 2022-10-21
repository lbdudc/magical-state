import filterService from "../../mockServices/filterService";

export default async (propId, params, store) => {
  switch (propId) {
    default:
      return filterService.getSpatialFilterItems({ SPATIAL_AGGREGATION: 1 });
  }
};
