import { useContext, useState } from "react";
import { RequestsContext } from "../../../contexts/requestsContext";
import { observer } from "mobx-react-lite";
import RequestCard from "./RequestCard";
import { Box } from "@mui/material";
import Map from "../../arcgis/Map";

const Requests = observer(() => {
  const { requests } = useContext(RequestsContext);
  const [expanded, setExpanded] = useState(null);

  const handleAccordionExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  return (
    <>
      {requests.length && (
        <Box sx={{ display: "flex" }}>
          <>
            <Box sx={{ width: "75%", marginRight: "16px" }}>
              <Map />
            </Box>
            <Box sx={{ width: "25%" }}>
              {requests.map((request) => (
                <RequestCard
                  key={request.id}
                  expanded={expanded === request.id}
                  onChange={() => handleAccordionExpand(request.id)}
                  request={request}
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
