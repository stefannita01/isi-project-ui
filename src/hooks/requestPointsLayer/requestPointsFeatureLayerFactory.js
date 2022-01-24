import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import {
  DEFAULT_POINT,
  REQUEST_DROPOFF,
  REQUEST_PICKUP,
} from "../../constants/graphicsConstants";

const requestPointsFeatureLayerFactory = (graphics) =>
  new FeatureLayer({
    source: graphics,
    fields: [
      {
        name: "id",
        alias: "id",
        type: "oid",
      },
      {
        name: "pickup",
        alias: "pickup",
        type: "integer",
      },
      {
        name: "address",
        alias: "address",
        type: "string",
      },
    ],
    objectIdField: "id",
    popupTemplate: {
      title: ({ graphic: { attributes } }) =>
        attributes.pickup ? "Pickup" : "Destination",
      content: "{address}",
      outFields: ["*"],
    },
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

export { requestPointsFeatureLayerFactory };
