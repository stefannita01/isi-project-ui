import * as locator from "@arcgis/core/rest/locator";

const serviceUrl =
  "http://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer";

export const geocodeService = {
  getAdress: async ([longitude, latitude]) => {
    return await locator.locationToAddress(serviceUrl, {
      location: { longitude, latitude },
    });
  },
};
