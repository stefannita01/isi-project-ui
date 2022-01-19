import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useState } from "react";
import { trucksStore } from "../../stores/trucksStore";
import { trucksFeatureLayerFactory } from "./trucksFeatureLayerFactory";
import Graphic from "@arcgis/core/Graphic";
import Map from "../arcgis/Map";

const Trucks = observer(() => {
  const [trucks, setTrucks] = useState([]);
  const [trucksGraphics, setTrucksGraphics] = useState([]);

  useEffect(async () => {
    await trucksStore.initialize();
  }, [trucksStore]);

  useEffect(() => {
    setTrucks(trucksStore.trucks);
  }, [trucksStore.trucks]);

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

  return (
    <>
      <Map layers={[trucksLayer]} />
    </>
  );
});

export default Trucks;
