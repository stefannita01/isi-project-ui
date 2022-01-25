import * as route from "@arcgis/core/rest/route";
import RouteParameters from "@arcgis/core/rest/support/RouteParameters";
import FeatureSet from "@arcgis/core/rest/support/FeatureSet";

const serviceUrl =
  "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";

export const routeService = {
  getRoute: async (graphics) => {
    const routeParams = new RouteParameters({
      stops: new FeatureSet({
        features: graphics,
      }),
    });
    const response = await route.solve(serviceUrl, routeParams);

    response.routeResults.forEach(function (result) {
      result.route.symbol = {
        type: "simple-line",
        color: [5, 150, 255],
        width: 3,
      };
    });
    return response.routeResults[0].route;
  },
};
