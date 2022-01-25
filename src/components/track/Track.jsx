import { useRef, useEffect, useContext, useState, useMemo } from "react";
import { observer } from "mobx-react-lite";
import { routeService } from "../../services/routeService";
import { requestRouteFeatureLayerFactory } from "./requestRouteFeatureLayerFactory";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Map from "../arcgis/Map";
import Graphic from "@arcgis/core/Graphic";
import { AVAILABLE_TRUCK, BUSY_TRUCK } from "../../constants/graphicsConstants";
import { ContractsContext } from "../../contexts/contractsContext";
import { useRequestPointsLayer } from "../../hooks/requestPointsLayer/useRequestPointsLayer";
import { trucksStore } from "../../stores/trucksStore";
import { requestsStore } from "../../stores/requestsStore";

const Track = observer(() => {
  const {
    inProgressContracts: contracts,
    getContractById,
    updateContract,
  } = useContext(ContractsContext);
  const { updateTruck } = trucksStore;

  const mapViewRef = useRef();
  const [trackedContractId, setTrackedContractId] = useState(null);

  const [trackedRequest, setTrackedRequest] = useState(null);
  const [trackedRequestRouteGraphic, setTrackedRequestRouteGraphic] = useState(
    []
  );
  const [currentTimeouts, setCurrentTimeouts] = useState([]);
  const [currentTruckPoint, setCurrentTruckPoint] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const setLayers = async () => {
      const contract = await getContractById(trackedContractId);
      setContract(contract);
      currentTimeouts.forEach(clearTimeout);
      setCurrentTimeouts([]);
      if (trackedContractId !== null) {
        setTrackedRequest(contract.request);
        const stops = [
          contract.truck.position,
          contract.request.pickupLocation,
          contract.request.dropOffLocation,
        ].map(pointToGraphic);
        const route = await routeService.getRoute(stops);
        setTrackedRequestRouteGraphic([route]);
      } else {
        setTrackedRequest(null);
        setTrackedRequestRouteGraphic([]);
      }
    };

    setLayers();
  }, [trackedContractId]);

  const requestPointsLayer = useRequestPointsLayer(trackedRequest);

  const routeLayer = useMemo(
    () => requestRouteFeatureLayerFactory(trackedRequestRouteGraphic),
    [trackedRequestRouteGraphic]
  );

  useEffect(() => {
    if (trackedRequestRouteGraphic.length) {
      const paths = trackedRequestRouteGraphic[0].geometry.paths.flat();
      setCurrentTimeouts(
        paths.map(([x, y], i) =>
          setTimeout(async () => {
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

            if (i === paths.length - 1) {
              const newTruck = await updateTruck({
                ...contract.truck,
                busy: false,
                position: contract.request.dropOffLocation,
              });
              setCurrentTruckPoint(
                new Graphic({
                  geometry: {
                    type: "point",
                    longitude: newTruck.position.longitude,
                    latitude: newTruck.position.latitude,
                  },
                  symbol: AVAILABLE_TRUCK,
                })
              );
              const updatedRequest = await requestsStore.updateRequest({
                ...contract.request,
                status: "COMPLETED",
              });
              updateContract({
                ...contract,
                truck: newTruck,
                request: updatedRequest,
              });
              setTrackedContractId(null);
              setCurrentTruckPoint(null);
            }
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
        value={trackedContractId}
        onChange={(e) => {
          setTrackedContractId(parseInt(e.target.value));
        }}
      >
        {contracts.map((contract) => (
          <FormControlLabel
            key={contract.id}
            value={parseInt(contract.id)}
            control={<Radio />}
            label={getRequestLabel(contract)}
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

const getRequestLabel = ({ request, id }) =>
  `Request #${id}: ${request.quantity} ${request.product.type} from ${request.pickupLocation.address} to ${request.dropOffLocation.address}`;
