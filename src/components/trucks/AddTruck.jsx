import {
  Button,
  TextField,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
} from "@mui/material";
import { SnackbarContext } from "../../contexts/snackbarContext";
import { useForm } from "../../hooks/useForm";
import { geocodeService } from "../../services/geocodeService";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { useState, useContext, useEffect } from "react";
import { trucksStore } from "../../stores/trucksStore";
import styles from "../forms/Forms.module.css";
import Graphic from "@arcgis/core/Graphic";

const AddTruck = ({ mapViewRef, onOpenStatusChange }) => {
  const [addTruckFormOpen, setAddTruckFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [clickListener, setClickListener] = useState(null);
  const [truckCoordinates, setTruckCoordinates] = useState([]);

  const [addTruckFormValues, { handleChange, reset }] = useForm({
    priceEmpty: "",
    priceFull: "",
    weight: "",
    volume: "",
    position: {
      address: "",
      longitude: "",
      latitude: "",
    },
  });

  const { setSuccessSnack, setErrorSnack } = useContext(SnackbarContext);

  const toggleAddTruckForm = () => {
    onOpenStatusChange(!addTruckFormOpen);
    setAddTruckFormOpen(!addTruckFormOpen);
  };

  useEffect(() => {
    mapViewRef.current.view.graphics.removeAll();
    if (clickListener) {
      clickListener.remove();
      setClickListener(null);
    }

    if (addTruckFormOpen) {
      setClickListener(
        mapViewRef.current.view.on("click", (e) => {
          const { longitude, latitude } = e.mapPoint;
          setTruckCoordinates([longitude, latitude]);

          mapViewRef.current.view.graphics.removeAll();
          mapViewRef.current.view.graphics.add(
            new Graphic({
              geometry: e.mapPoint,
              symbol: {
                type: "simple-marker",
                color: "white",
                size: "8px",
              },
            })
          );
        })
      );
    } else {
      reset();
    }
  }, [addTruckFormOpen]);

  useEffect(() => {
    if (truckCoordinates.length) {
      const getAddressAndSetFormValues = async () => {
        const [longitude, latitude] = truckCoordinates;
        const address = (await geocodeService.getAdress(truckCoordinates))
          .address;
        handleChange({
          target: {
            name: "position",
            value: { longitude, latitude, address },
          },
        });
      };

      getAddressAndSetFormValues();
    }
  }, [truckCoordinates]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      Object.keys(addTruckFormValues)
        .filter((key) => key !== "position")
        .forEach((key) => {
          addTruckFormValues[key] = parseInt(addTruckFormValues[key]);
        });
      const truck = await trucksStore.createTruck(addTruckFormValues);
      setSuccessSnack(`Created truck #${truck.id}`);
    } catch (err) {
      setErrorSnack(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card sx={{ marginBottom: "16px" }}>
      <CardContent>
        <Button onClick={toggleAddTruckForm} sx={{ marginBottom: "8px" }}>
          {addTruckFormOpen ? <RemoveIcon /> : <AddIcon />} New truck
        </Button>

        {addTruckFormOpen && (
          <form className={styles.verticalForm} onSubmit={handleSubmit}>
            <TextField
              value={addTruckFormValues.priceEmpty}
              label="Price when empty"
              name="priceEmpty"
              type="number"
              onChange={handleChange}
            />
            <TextField
              value={addTruckFormValues.priceFull}
              label="Price when full"
              name="priceFull"
              type="number"
              onChange={handleChange}
            />
            <TextField
              value={addTruckFormValues.volume}
              label="Volume"
              name="volume"
              type="number"
              onChange={handleChange}
            />
            <TextField
              value={addTruckFormValues.weight}
              label="Weight"
              name="weight"
              type="number"
              onChange={handleChange}
            />
            <TextField
              value={addTruckFormValues.position.address}
              label="Position (select on map)"
              disabled
            />
            <CardActions sx={{ justifyContent: "flex-end" }}>
              {isLoading ? (
                <CircularProgress />
              ) : (
                <>
                  <Button type="button" color="error" onClick={reset}>
                    Reset
                  </Button>
                  <Button type="submit">Submit</Button>
                </>
              )}
            </CardActions>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default AddTruck;
