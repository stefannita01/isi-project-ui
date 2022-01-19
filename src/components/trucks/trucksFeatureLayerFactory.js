import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import {
  DEFAULT_POINT,
  BUSY_TRUCK,
  AVAILABLE_TRUCK,
} from "../../constants/graphicsConstants";

const trucksFeatureLayerFactory = (trucksGraphics) =>
  new FeatureLayer({
    source: trucksGraphics,
    fields: [
      {
        name: "id",
        alias: "id",
        type: "oid",
      },
      {
        name: "location",
        alias: "location",
        type: "string",
      },
      {
        name: "busy",
        alias: "busy",
        type: "integer",
      },
    ],
    objectIdField: "id",
    popupTemplate: {
      title: ({ graphic: { attributes } }) =>
        `Truck #${attributes.id}, ${attributes.busy ? "busy" : "free"}`,
      content: "{location}",
      outFields: ["*"],
    },
    renderer: {
      type: "unique-value",
      field: "busy",
      defaultSymbol: DEFAULT_POINT,
      uniqueValueInfos: [
        {
          value: 1,
          symbol: BUSY_TRUCK,
        },
        {
          value: 0,
          symbol: AVAILABLE_TRUCK,
        },
      ],
    },
  });

export { trucksFeatureLayerFactory };
