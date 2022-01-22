import { useForm } from "../../hooks/useForm";
import {
  TextField,
  Card,
  CardContent,
  Button,
  CardActions,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import styles from "./Forms.module.css";
import { requestsService } from "../../services/requestsService";
import { useContext, useState, useRef, useEffect } from "react";
import { SnackbarContext } from "./../../contexts/snackbarContext";
import { ProductsContext } from "../../contexts/productsContext";
import { observer } from "mobx-react-lite";
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import Graphic from "@arcgis/core/Graphic";
import { geocodeService } from "../../services/geocodeService";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DateAdapter from "@mui/lab/AdapterDayjs";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";

const CreateProductForm = observer(({ products }) => {
  const [formValues, { handleChange, reset }] = useForm({
    productId: "",
    pickupLocation: { longitude: "", latitude: "", address: "" },
    dropOffLocation: { longitude: "", latitude: "", address: "" },
    pickUpDate: new Date().toISOString().split("T")[0],
    dropOffDate: new Date().toISOString().split("T")[0],
    quantity: "",
  });
  const mapDiv = useRef(null);

  const { productsLoading: isLoading } = useContext(ProductsContext);
  const { setSuccessSnack, setErrorSnack } = useContext(SnackbarContext);

  const [pickupCoordinates, setpickupCoordinates] = useState([]);
  const [dropOffCoordinates, setdropOffCoordinates] = useState([]);

  const resetForm = () => {
    setpickupCoordinates([]);
    setdropOffCoordinates([]);
    reset();
  };

  useEffect(async () => {
    if (pickupCoordinates.length) {
      const locatorResponse = await geocodeService.getAdress(pickupCoordinates);
      handleChange({
        target: {
          name: "pickupLocation",
          value: {
            longitude: pickupCoordinates[0],
            latitude: pickupCoordinates[1],
            address: locatorResponse.address,
          },
        },
      });
    } else {
      handleChange({
        target: {
          name: "pickupLocation",
          value: {
            longitude: "",
            latitude: "",
            address: "",
          },
        },
      });
    }
  }, [pickupCoordinates]);

  useEffect(async () => {
    if (dropOffCoordinates.length) {
      const locatorResponse = await geocodeService.getAdress(
        dropOffCoordinates
      );
      handleChange({
        target: {
          name: "dropOffLocation",
          value: {
            longitude: dropOffCoordinates[0],
            latitude: dropOffCoordinates[1],
            address: locatorResponse.address,
          },
        },
      });
    } else {
      handleChange({
        target: {
          name: "dropOffLocation",
          value: {
            longitude: "",
            latitude: "",
            address: "",
          },
        },
      });
    }
  }, [dropOffCoordinates]);

  const eventListener = (view, e) => {
    const getPoint = (type) =>
      new Graphic({
        geometry: e.mapPoint,
        symbol: {
          type: "simple-marker",
          color: type === "origin" ? "white" : "black",
          size: "8px",
        },
      });

    if (view.graphics.length === 0) {
      view.graphics.add(getPoint("origin"));
      setpickupCoordinates([e.mapPoint.longitude, e.mapPoint.latitude]);
    } else if (view.graphics.length === 1) {
      view.graphics.add(getPoint("destination"));
      setdropOffCoordinates([e.mapPoint.longitude, e.mapPoint.latitude]);
    } else {
      view.graphics.removeAll();
      setpickupCoordinates([]);
      setdropOffCoordinates([]);
    }
  };

  useEffect(() => {
    if (mapDiv.current) {
      const map = new WebMap({
        basemap: "arcgis-navigation",
      });
      const view = new MapView({
        container: mapDiv.current,
        map: map,
        center: [-118.24532, 34.05398], //Longitude, latitude
        zoom: 14,
      });

      view.on("click", (e) => eventListener(view, e));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await requestsService.createRequest(formValues);
      setSuccessSnack("Request added");
      resetForm();
    } catch (err) {
      setErrorSnack(err.message);
    }
  };

  return (
    <>
      <LocalizationProvider dateAdapter={DateAdapter}>
        <Card variant="outlined">
          <CardContent>
            <h2>Add request</h2>
            <form className={styles.verticalForm} onSubmit={handleSubmit}>
              <TextField
                label="Product"
                name="productId"
                value={formValues.productId}
                select
                onChange={handleChange}
              >
                {products.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.type}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label={`Pickup location ${
                  formValues.pickupLocation.address ? "" : "(select on map)"
                }`}
                name="pickupAddress"
                value={formValues.pickupLocation.address}
                disabled
              />
              <TextField
                label={`Drop-off location ${
                  formValues.dropOffLocation.address ? "" : "(select on map)"
                }`}
                name="dropOffAddress"
                value={formValues.dropOffLocation.address}
                disabled
              />
              <TextField
                label="Budget"
                name="budget"
                type="number"
                value={formValues.budget}
                onChange={handleChange}
              />
              <DesktopDatePicker
                label="Pickup date"
                inputFormat="YYYY-MM-DD"
                onChange={(value) =>
                  handleChange({ target: { name: "pickUpDate", value } })
                }
                value={formValues.pickUpDate}
                renderInput={(params) => (
                  <TextField {...params} required={false} />
                )}
              />
              <DesktopDatePicker
                label="Drop-off date"
                inputFormat="YYYY-MM-DD"
                onChange={(value) =>
                  handleChange({ target: { name: "dropOffDate", value } })
                }
                value={formValues.dropOffDate}
                renderInput={(params) => (
                  <TextField {...params} required={false} />
                )}
              />
              <TextField
                label="Quantity"
                name="quantity"
                type="number"
                value={formValues.quantity}
                onChange={handleChange}
              />
              <div style={{ height: "35vh", width: "100%" }} ref={mapDiv}></div>

              <CardActions sx={{ justifyContent: "flex-end" }}>
                {isLoading ? (
                  <CircularProgress />
                ) : (
                  <>
                    <Button type="button" color="error" onClick={resetForm}>
                      Reset
                    </Button>
                    <Button type="submit">Submit</Button>
                  </>
                )}
              </CardActions>
            </form>
          </CardContent>
        </Card>
      </LocalizationProvider>
    </>
  );
});

export default CreateProductForm;
