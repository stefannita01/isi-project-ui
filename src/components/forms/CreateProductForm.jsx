import { useForm } from "../../hooks/useForm";
import {
  TextField,
  Card,
  CardContent,
  Button,
  CardActions,
  CircularProgress,
} from "@mui/material";
import styles from "./Forms.module.css";
import { useContext } from "react";
import { SnackbarContext } from "./../../contexts/snackbarContext";
import { ProductsContext } from "../../contexts/productsContext";
import { observer } from "mobx-react-lite";

const CreateProductForm = observer(() => {
  const [formValues, { handleChange, reset }] = useForm({
    weight: "",
    volume: "",
    type: "",
  });
  const { setSuccessSnack, setErrorSnack } = useContext(SnackbarContext);

  const { productsLoading, createProduct } = useContext(ProductsContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createProduct(formValues);
      setSuccessSnack("Product added");
      reset();
    } catch (err) {
      setErrorSnack(err.message);
    }
  };

  return (
    <>
      <Card variant="outlined">
        <CardContent>
          <h2>Add product</h2>
          <form className={styles.verticalForm} onSubmit={handleSubmit}>
            <TextField
              label="Name"
              name="type"
              value={formValues.type}
              onChange={handleChange}
            ></TextField>
            <TextField
              label="Weight"
              name="weight"
              value={formValues.weight}
              onChange={handleChange}
              type="number"
            ></TextField>
            <TextField
              label="Volume"
              name="volume"
              value={formValues.volume}
              onChange={handleChange}
              type="number"
            ></TextField>
            <CardActions sx={{ justifyContent: "flex-end" }}>
              {productsLoading ? (
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
        </CardContent>
      </Card>
    </>
  );
});

export default CreateProductForm;
