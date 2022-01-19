import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

const requestRouteFeatureLayerFactory = (routeGraphics) =>
  new FeatureLayer({
    source: routeGraphics.length ? routeGraphics : [],
    objectIdField: "ObjectId",
    renderer: {
      type: "simple",
      symbol: {
        type: "simple-line",
        width: 3,
        color: {
          a: 1,
          b: 255,
          g: 150,
          r: 5,
        },
        join: "round",
        miterLimit: 2,
        style: "solid",
      },
    },
  });

export { requestRouteFeatureLayerFactory };
