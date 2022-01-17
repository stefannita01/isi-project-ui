import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useRef, useState } from "react";
import { trucksStore } from "../../stores/trucksStore";
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import Graphic from "@arcgis/core/Graphic";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

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
              busy: truck.busy,
            },
          })
      )
    );
  }, [trucks]);

  const trucksLayer = useMemo(
    () =>
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
            type: "string",
          },
        ],
        popupTemplate: {
          title: "Truck #{id}, busy: {busy}",
          content: "{location}",
        },
      }),
    [trucksGraphics]
  );

  useEffect(() => {
    map.layers.length && map.removeAll();
    map.add(trucksLayer);
  }, [trucksLayer]);

  const mapDiv = useRef(null);
  const map = useMemo(
    () =>
      new WebMap({
        basemap: "arcgis-navigation",
      }),
    []
  );

  const view = useMemo(
    () =>
      new MapView({
        center: [-118.24532, 34.05398], //Longitude, latitude
        zoom: 14,
        map,
        container: mapDiv.current,
      }),
    [mapDiv.current]
  );

  return (
    <>
      <div ref={mapDiv} style={{ height: "50vh", width: "100%" }}></div>
    </>
  );
});

export default Trucks;