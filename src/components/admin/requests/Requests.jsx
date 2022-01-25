import { useContext, useEffect, useState, useRef } from "react";
import { RequestsContext } from "../../../contexts/requestsContext";
import { observer } from "mobx-react-lite";
import RequestCard from "./RequestCard";
import { Box } from "@mui/material";
import Map from "../../arcgis/Map";
import { trucksStore } from "../../../stores/trucksStore";
import { useTrucksLayer } from "../../../hooks/trucksLayer/useTrucksLayer";
import { useRequestPointsLayer } from "../../../hooks/requestPointsLayer/useRequestPointsLayer";

const Requests = observer(() => {
  const {
    newRequests: requests,
    getRequestById,
    initialize: initializeRequests,
  } = useContext(RequestsContext);
  const mapViewRef = useRef();
  const [expanded, setExpanded] = useState(null);
  const [trucks, setTrucks] = useState(trucksStore.trucks);
  const [request, setRequest] = useState(null);

  const handleAccordionExpand = async (id) => {
    const expandedId = expanded === id ? null : id;
    setExpanded(expandedId);
    setTrucks(expandedId ? trucks : trucksStore.trucks);
    expandedId === null && setRequest(null);
  };

  const handleCardTrucksReady = async (trucks) => {
    setTrucks(trucks);
    setRequest(expanded ? await getRequestById(expanded) : null);
  };

  useEffect(() => {
    const initRequestsStore = async () => {
      await initializeRequests();
    };

    if (!requests.length) {
      initRequestsStore();
    }
  });

  useEffect(() => {
    const initTrucksStore = async () => {
      await trucksStore.initialize();
      setTrucks(trucksStore.trucks);
    };

    if (!trucksStore.trucks.length) {
      initTrucksStore();
    }
  }, []);

  const trucksLayer = useTrucksLayer(trucks);
  const requestPointsLayer = useRequestPointsLayer(request);

  return (
    <>
      {requests.length && (
        <Box sx={{ display: "flex" }}>
          <>
            <Box sx={{ width: "75%", marginRight: "16px" }}>
              <Map
                ref={mapViewRef}
                layers={[trucksLayer, requestPointsLayer]}
              />
            </Box>
            <Box sx={{ width: "25%" }}>
              {requests.map((request) => (
                <RequestCard
                  key={request.id}
                  mapViewRef={mapViewRef}
                  expanded={expanded === request.id}
                  onChange={() => handleAccordionExpand(request.id)}
                  request={request}
                  onTrucksReady={handleCardTrucksReady}
                />
              ))}
            </Box>
          </>
        </Box>
      )}
      {!requests.length && <Box>No requests.</Box>}
    </>
  );
});

export default Requests;
