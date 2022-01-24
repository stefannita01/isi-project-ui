import Graphic from "@arcgis/core/Graphic";
import { useEffect, useMemo, useState } from "react";
import { requestPointsFeatureLayerFactory } from "./requestPointsFeatureLayerFactory";

export const useRequestPointsLayer = (request) => {
  const [graphics, setGraphics] = useState([]);

  useEffect(() => {
    if (request) {
      const { pickupLocation, dropOffLocation } = request;

      const { longitude: pickupLongitude, latitude: pickupLatitude } =
        pickupLocation;
      const { longitude: dropOffLongitude, latitude: dropOffLatitude } =
        dropOffLocation;

      setGraphics([
        {
          geometry: {
            type: "point",
            longitude: pickupLongitude,
            latitude: pickupLatitude,
          },
          attributes: {
            id: 0,
            pickup: 1,
            address: pickupLocation.address,
          },
        },
        {
          geometry: {
            type: "point",
            longitude: dropOffLongitude,
            latitude: dropOffLatitude,
          },
          attributes: {
            id: 1,
            pickup: 0,
            address: dropOffLocation.address,
          },
        },
      ]);
    } else {
      setGraphics([]);
    }
  }, [request]);

  const requestPointsLayer = useMemo(
    () => requestPointsFeatureLayerFactory(graphics),
    [graphics]
  );

  return requestPointsLayer;
};
