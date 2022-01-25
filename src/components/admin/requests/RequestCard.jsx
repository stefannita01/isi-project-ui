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
import { useEffect, useState, useCallback, useContext } from "react";
import { trucksService } from "../../../services/trucksService";
import { contractsService } from "../../../services/contractsService";
import { SnackbarContext } from "../../../contexts/snackbarContext";

const RequestCard = ({
  request,
  mapViewRef,
  expanded,
  onChange,
  onTrucksReady,
}) => {
  const { setSuccessSnack, setErrorSnack } = useContext(SnackbarContext);

  const [isLoading, setIsLoading] = useState(true);
  const [trucks, setTrucks] = useState([]);
  const [clickListener, setClickListener] = useState(null);

  const [selectedTruck, setSelectedTruck] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    if (expanded) {
      if (!trucks.length) {
        const getSuitableTrucks = async () => {
          setIsLoading(true);

          const response = await trucksService.getSuitableTrucks(request.id);

          setIsLoading(false);

          setTrucks(response.map((item) => item.truck));
          setPrices(
            response.map((item) => ({
              id: item.truck.id,
              price: item.price.toFixed(2),
            }))
          );
        };

        getSuitableTrucks();
      } else {
        onTrucksReady(trucks);
      }
    } else {
      setSelectedTruck(null);
      setSelectedPrice(null);
    }
  }, [expanded]);

  useEffect(() => {
    onTrucksReady(trucks);
  }, [trucks]);

  useEffect(() => {
    setSelectedPrice(
      selectedTruck
        ? prices.find((price) => price.id === selectedTruck.id)
        : null
    );
  }, [selectedTruck, prices]);

  const handleGraphicClick = useCallback(
    async (e) => {
      const response = await mapViewRef.current.view.hitTest(e.screenPoint);
      if (response.results.length) {
        const graphic = response.results[0].graphic.attributes;
        if (graphic.truckId !== undefined) {
          setSelectedTruck(
            trucks.find((truck) => truck.id === graphic.truckId)
          );
        }
      }
    },
    [trucks, selectedTruck]
  );

  useEffect(() => {
    if (mapViewRef.current) {
      if (clickListener) {
        clickListener.remove();
        setClickListener(null);
      }

      if (expanded) {
        setClickListener(
          mapViewRef.current.view.on("click", handleGraphicClick)
        );
      }
    }
  }, [expanded, handleGraphicClick]);

  const onAccept = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const contract = await contractsService.createContract(
        selectedTruck.id,
        request.id,
        parseFloat(selectedPrice.price)
      );
      setSuccessSnack(`Contract #${contract.id} created`);
    } catch (err) {
      setErrorSnack(err.message);
    } finally {
      setIsLoading(false);
    }
  };

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
          <>
            <Typography variant="body1">
              From <strong>{request.pickupLocation.address}</strong>
            </Typography>
            <Typography variant="body1">
              To <strong>{request.dropOffLocation.address}</strong>
            </Typography>
            <Typography variant="body2" component="div">
              {selectedTruck && selectedPrice && (
                <>
                  <p>
                    Selected truck: <strong>Truck #{selectedTruck.id}</strong>
                  </p>
                  <p>
                    Price: <strong>{selectedPrice.price} EUR</strong>
                  </p>
                </>
              )}
              {trucks.length === 0 && (
                <p>No trucks can satisfy this request.</p>
              )}
            </Typography>
          </>
        )}
      </AccordionDetails>
      <AccordionActions>
        <Button type="button" disabled={!selectedTruck} onClick={onAccept}>
          Accept
        </Button>
      </AccordionActions>
    </Accordion>
  );
};

export default RequestCard;
