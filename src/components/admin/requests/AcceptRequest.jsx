import { Button } from "@mui/material";
import { useContext, useState } from "react";
import { trucksService } from "../../../services/trucksService";
import { contractsService } from "../../../services/contractsService";
import { SnackbarContext } from "../../../contexts/snackbarContext";
import { CircularProgress } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const AcceptRequest = ({ requestId, weight, volume, quantity }) => {
  const { setSuccessSnack, setErrorSnack } = useContext(SnackbarContext);

  const [isLoading, setIsLoading] = useState(false);
  const [trucks, setTrucks] = useState([]);
  const [noTrucksFound, setNoTrucksFound] = useState(false);
  const [truckId, setTruckId] = useState("");

  const getSuitableTrucks = async () => {
    setIsLoading(true);

    try {
      const suitableTrucks = await trucksService.getSuitableTrucks(
        weight,
        volume,
        quantity
      );
      suitableTrucks.length
        ? setTrucks(suitableTrucks)
        : setNoTrucksFound(true);
    } catch (err) {
      setErrorSnack(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const createContract = async () => {
    setIsLoading(true);

    try {
      await contractsService.createContract(truckId, requestId);
      setSuccessSnack("Contract created");
    } catch (err) {
      setErrorSnack(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const switchRender = () => {
    if (isLoading) return <CircularProgress />;

    if (trucks.length) {
      return (
        <>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Truck</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Truck"
              value={truckId}
              onChange={(e) => {
                setTruckId(e.target.value);
              }}
            >
              {trucks.map((truck) => (
                <MenuItem key={truck.id} value={truck.id}>
                  Truck #{truck.id}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {truckId && (
            <Button type="button" onClick={createContract}>
              Confirm
            </Button>
          )}
        </>
      );
    }

    if (noTrucksFound) return <p>No suitable trucks.</p>;

    return (
      <>
        <Button type="button" onClick={getSuitableTrucks}>
          Accept
        </Button>
      </>
    );
  };

  return <>{switchRender()}</>;
};

export default AcceptRequest;
