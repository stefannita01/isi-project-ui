import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useState, useRef } from "react";
import { trucksStore } from "../../stores/trucksStore";
import { trucksFeatureLayerFactory } from "./trucksFeatureLayerFactory";
import Graphic from "@arcgis/core/Graphic";
import Map from "../arcgis/Map";
import { autorun } from "mobx";
import AddTruck from "./AddTruck";

const Trucks = observer(({ canAddTruck }) => {
  const mapViewRef = useRef();

  useEffect(() => {
    const initializeTrucksStore = async () => {
      await trucksStore.initialize();
    };

    initializeTrucksStore();
  }, []);

  const [trucksGraphics, setTrucksGraphics] = useState([]);
  const [addTruckFormOpen, setAddTruckFormOpen] = useState(false);

  useEffect(() => {
    autorun(() => {
      setTrucksGraphics(
        trucksStore.trucks.map(
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
    });
  }, []);

  const trucksLayer = useMemo(
    () => trucksFeatureLayerFactory(trucksGraphics),
    [trucksGraphics]
  );

  return (
    <>
      {canAddTruck && (
        <AddTruck
          mapViewRef={mapViewRef}
          onOpenStatusChange={(isOpen) => setAddTruckFormOpen(isOpen)}
        />
      )}

      <Map ref={mapViewRef} layers={addTruckFormOpen ? [] : [trucksLayer]} />
    </>
  );
});

export default Trucks;
