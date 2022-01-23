import {
  AccordionActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const RequestCard = ({ request, expanded, onChange }) => {
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
        <Typography variant="body1">
          From {request.pickupLocation.address} to{" "}
          {request.dropOffLocation.address}
        </Typography>
      </AccordionDetails>
      <AccordionActions>
        <Button type="button">Accept</Button>
      </AccordionActions>
    </Accordion>
  );
};

export default RequestCard;
