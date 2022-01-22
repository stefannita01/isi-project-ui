import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useState, useRef, useContext } from "react";
import { trucksStore } from "../../stores/trucksStore";
import { trucksFeatureLayerFactory } from "./trucksFeatureLayerFactory";
import {
  Button,
  TextField,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
} from "@mui/material";
import { useForm } from "../../hooks/useForm";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Graphic from "@arcgis/core/Graphic";
import Map from "../arcgis/Map";
import styles from "../forms/Forms.module.css";
import { geocodeService } from "../../services/geocodeService";
import { SnackbarContext } from "../../contexts/snackbarContext";
import { trucksService } from "../../services/trucksService";
import { autorun } from "mobx";

const Trucks = observer(() => {
  const { setSuccessSnack, setErrorSnack } = useContext(SnackbarContext);
  const mapViewRef = useRef();

  useEffect(() => {
    const initializeTrucksStore = async () => {
      await trucksStore.initialize();
    };

    initializeTrucksStore();
  }, []);

  const [trucksGraphics, setTrucksGraphics] = useState([]);
  const [addTruckFormOpen, setAddTruckFormOpen] = useState(false);
  const [clickListener, setClickListener] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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

  const toggleAddTruckForm = () => {
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

  useEffect(() => {
    autorun(() => {
      setTrucksGraphics(
        trucksStore.trucks.map(
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
                busy: truck.busy ? 1 : 0,
              },
            })
        )
      );
    });
  }, [trucksStore.trucks]);

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

  const trucksLayer = useMemo(
    () => trucksFeatureLayerFactory(trucksGraphics),
    [trucksGraphics]
  );

  return (
    <>
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
                label="position (select on map)"
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

      <Map ref={mapViewRef} layers={addTruckFormOpen ? [] : [trucksLayer]} />
    </>
  );
});

export default Trucks;
