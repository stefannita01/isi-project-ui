import { useEffect, useMemo, useState } from "react";
import { trucksFeatureLayerFactory } from "./trucksFeatureLayerFactory";
import Graphic from "@arcgis/core/Graphic";

export const useTrucksLayer = (trucks) => {
  const [trucksGraphics, setTrucksGraphics] = useState([]);

  useEffect(() => {
    setTrucksGraphics(
      trucks.map(
        (truck) =>
          new Graphic({
            geometry: {
              type: "point",
              latitude: truck.position.latitude,
              longitude: truck.position.longitude,
            },
            attributes: {
              id: truck.id,
              location: truck.position.address,
              busy: truck.busy ? 1 : 0,
            },
          })
      )
    );
  }, [trucks]);

  const trucksLayer = useMemo(
    () => trucksFeatureLayerFactory(trucksGraphics),
    [trucksGraphics]
  );

  return trucksLayer;
};
