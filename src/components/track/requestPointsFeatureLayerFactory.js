import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import {
  DEFAULT_POINT,
  REQUEST_DROPOFF,
  REQUEST_PICKUP,
} from "../../constants/graphicsConstants";

const requestPointsFeatureLayerFactory = (points) => {
  return new FeatureLayer({
    source: points,
    objectIdField: "ObjectId",
    fields: [
      {
        name: "ObjectId",
        alias: "ObjectId",
        type: "oid",
      },
      {
        name: "pickup",
        alias: "pickup",
        type: "integer",
      },
    ],
    renderer: {
      type: "unique-value",
      field: "pickup",
      defaultSymbol: DEFAULT_POINT,
      uniqueValueInfos: [
        {
          value: 1,
          symbol: REQUEST_PICKUP,
        },
        {
          value: 0,
          symbol: REQUEST_DROPOFF,
        },
      ],
    },
  });
};

export { requestPointsFeatureLayerFactory };
