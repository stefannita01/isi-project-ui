import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import { useRef, useEffect, useContext } from "react";
import { RequestsContext } from "../../contexts/requestsContext";
import { observer } from "mobx-react-lite";
import Graphic from "@arcgis/core/Graphic";
import { routeService } from "../../services/routeService";

const Track = observer(() => {
  const { requests } = useContext(RequestsContext);
  const mapDiv = useRef(null);
  useEffect(async () => {
    if (requests?.length) {
      if (mapDiv.current) {
        const map = new WebMap({
          basemap: "arcgis-navigation",
        });
        const view = new MapView({
          center: [-118.24532, 34.05398], //Longitude, latitude
          zoom: 14,
        });
        view.container = mapDiv.current;
        view.map = map;

        const request = requests[0];
        const pickupPoint = new Graphic({
          geometry: {
            type: "point",
            latitude: request.pickupLocation.latitude,
            longitude: request.pickupLocation.longitude,
          },
          symbol: {
            type: "simple-marker",
            color: "white",
            size: "8px",
          },
        });
        const dropOffPoint = new Graphic({
          geometry: {
            type: "point",
            latitude: request.dropOffLocation.latitude,
            longitude: request.dropOffLocation.longitude,
          },
          symbol: {
            type: "simple-marker",
            color: "black",
            size: "8px",
          },
        });

        view.graphics.add(pickupPoint);
        view.graphics.add(dropOffPoint);

        const routeResponse = await routeService.getRoute(view.graphics);
        const trackTruck = (paths) => {
          let currentPoint;
          paths.forEach(([x, y], i) => {
            setTimeout(() => {
              if (currentPoint) {
                view.graphics.remove(currentPoint);
              }
              currentPoint = new Graphic({
                geometry: {
                  type: "point",
                  longitude: x,
                  latitude: y,
                },
                symbol: {
                  type: "simple-marker",
                  color: "red",
                  size: "10px",
                },
              });
              view.graphics.add(currentPoint);
            }, i * 500);
          });
        };
        routeResponse.forEach((result) => {
          view.graphics.add(result.route);
          trackTruck(result.route.geometry.paths[0]);
        });
      }
    }
  }, [requests]);

  return (
    <>
      <div ref={mapDiv} style={{ height: "50vh", width: "100%" }}></div>
    </>
  );
});

export default Track;
