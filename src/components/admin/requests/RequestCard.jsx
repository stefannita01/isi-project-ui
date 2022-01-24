import {
  AccordionActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect, useState } from "react";
import { trucksService } from "../../../services/trucksService";

const RequestCard = ({ request, expanded, onChange, onTrucksReady }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [trucks, setTrucks] = useState([]);

  useEffect(() => {
    if (expanded) {
      if (!trucks.length) {
        const getSuitableTrucks = async () => {
          setIsLoading(true);

          const response = await trucksService.getSuitableTrucks(request.id);

          setIsLoading(false);

          setTrucks(response.map((item) => item.truck));
        };

        getSuitableTrucks();
      } else {
        onTrucksReady(trucks);
      }
    }
  }, [expanded]);

  useEffect(() => {
    onTrucksReady(trucks);
  }, [trucks]);

  return (
    <Accordion
      expanded={expanded}
      onChange={() => onChange()}
      sx={{ marginBottom: "16px" }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">
          {request.quantity} {request.product.type}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          <Typography variant="body1">
            From {request.pickupLocation.address} to{" "}
            {request.dropOffLocation.address}
          </Typography>
        )}
      </AccordionDetails>
      <AccordionActions>
        <Button type="button">Accept</Button>
      </AccordionActions>
    </Accordion>
  );
};

export default RequestCard;
