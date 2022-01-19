import { useRef, useEffect, useContext, useState, useMemo } from "react";
import { RequestsContext } from "../../contexts/requestsContext";
import { observer } from "mobx-react-lite";
import { routeService } from "../../services/routeService";
import { requestRouteFeatureLayerFactory } from "./requestRouteFeatureLayerFactory";
import { requestPointsFeatureLayerFactory } from "./requestPointsFeatureLayerFactory";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Map from "../arcgis/Map";
import Graphic from "@arcgis/core/Graphic";
import { BUSY_TRUCK } from "../../constants/graphicsConstants";

const Track = observer(() => {
  const { requests, getRequestById } = useContext(RequestsContext);
  const mapViewRef = useRef();
  const [trackedRequestId, setTrackedRequestId] = useState(null);
  const [trackedRequestPointsGraphics, setTrackedRequestPointsGraphics] =
    useState([]);
  const [trackedRequestRouteGraphic, setTrackedRequestRouteGraphic] = useState(
    []
  );
  const [currentTruckPoint, setCurrentTruckPoint] = useState(null);
  const [currentTimeouts, setCurrentTimeouts] = useState([]);

  // new route id selected: get request points
  useEffect(async () => {
    if (trackedRequestId !== null) {
      const request = await getRequestById(trackedRequestId);
      const requestGraphics = [
        request.pickupLocation,
        request.dropOffLocation,
      ].map(pointToGraphic);

      setTrackedRequestPointsGraphics(requestGraphics);
      currentTimeouts.forEach(clearTimeout);
      setCurrentTimeouts([]);
    }
  }, [trackedRequestId]);

  // new request points: get request route
  useEffect(async () => {
    const route = await routeService.getRoute(trackedRequestPointsGraphics);
    setTrackedRequestRouteGraphic([route]);
  }, [trackedRequestPointsGraphics]);

  const requestPointsLayer = useMemo(
    () => requestPointsFeatureLayerFactory(trackedRequestPointsGraphics),
    [trackedRequestPointsGraphics]
  );

  const routeLayer = useMemo(
    () => requestRouteFeatureLayerFactory(trackedRequestRouteGraphic),
    [trackedRequestRouteGraphic]
  );

  useEffect(() => {
    if (trackedRequestRouteGraphic.length) {
      setCurrentTimeouts(
        trackedRequestRouteGraphic[0].geometry.paths[0].map(([x, y], i) =>
          setTimeout(() => {
            setCurrentTruckPoint(
              new Graphic({
                geometry: {
                  type: "point",
                  longitude: x,
                  latitude: y,
                },
                symbol: BUSY_TRUCK,
              })
            );
          }, i * 500)
        )
      );
    }
  }, [routeLayer]);

  useEffect(() => {
    mapViewRef.current.view.graphics.removeAll();
    currentTruckPoint &&
      mapViewRef.current.view.graphics.add(currentTruckPoint);
  }, [currentTruckPoint]);

  return (
    <>
      <h2>Select a request to track</h2>
      <RadioGroup
        value={trackedRequestId}
        onChange={(e) => {
          setTrackedRequestId(e.target.value);
        }}
      >
        {requests.map((request) => (
          <FormControlLabel
            key={request.id}
            value={request.id}
            control={<Radio />}
            label={getRequestLabel(request)}
          />
        ))}
      </RadioGroup>
      <Map ref={mapViewRef} layers={[routeLayer, requestPointsLayer]} />
    </>
  );
});

export default Track;

///

const pointToGraphic = ({ longitude, latitude, id }, i) => ({
  geometry: {
    type: "point",
    longitude,
    latitude,
  },
  attributes: {
    ObjectId: id,
    pickup: 1 - (i % 2),
  },
});

const getRequestLabel = (request) =>
  `Request #${request.id}: ${request.quantity} ${request.product.type} from ${request.pickupLocation.address} to ${request.dropOffLocation.address}`;
