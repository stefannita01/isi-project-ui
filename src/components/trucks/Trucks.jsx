import { observer } from "mobx-react-lite";
import { useEffect, useState, useRef } from "react";
import { trucksStore } from "../../stores/trucksStore";
import Map from "../arcgis/Map";
import AddTruck from "./AddTruck";
import { useTrucksLayer } from "../../hooks/trucksLayer/useTrucksLayer";

const Trucks = observer(({ canAddTruck }) => {
  const mapViewRef = useRef();

  useEffect(() => {
    const initializeTrucksStore = async () => {
      await trucksStore.initialize();
    };

    initializeTrucksStore();
  }, []);

  const [addTruckFormOpen, setAddTruckFormOpen] = useState(false);

  const trucksLayer = useTrucksLayer(trucksStore.trucks);

  return (
    <>
      <Map ref={mapViewRef} layers={addTruckFormOpen ? [] : [trucksLayer]} />
      {canAddTruck && (
        <AddTruck
          mapViewRef={mapViewRef}
          onOpenStatusChange={(isOpen) => setAddTruckFormOpen(isOpen)}
        />
      )}
    </>
  );
});

export default Trucks;
