import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  CircularProgress,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useForm } from "../../../hooks/useForm";
import { AuthContext } from "../../../contexts/authContext";
import { SnackbarContext } from "./../../../contexts/snackbarContext";
import styles from "../Auth.module.css";

const Register = () => {
  const { authenticated } = useContext(AuthContext);
  const navigate = useRef(useNavigate());
  useEffect(() => {
    if (authenticated) {
      navigate.current("/home");
    }
  }, [authenticated]);

  const { register } = useContext(AuthContext);
  const { setSuccessSnack, setErrorSnack } = useContext(SnackbarContext);

  const [isLoading, setIsLoading] = useState(false);
  const [formValues, { handleChange }] = useForm({
    email: "",
    password: "",
    phone: "",
    userRole: "CLIENT",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const response = await register(formValues);
      setSuccessSnack(response.message);
    } catch (err) {
      setErrorSnack(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authFormContainer}>
      <form className={styles.authForm} onSubmit={handleSubmit}>
        <TextField
          name="email"
          label="Email"
          type="email"
          value={formValues.email}
          onChange={handleChange}
        />
        <TextField
          name="password"
          label="Password"
          type="password"
          value={formValues.password}
          onChange={handleChange}
        />
        <TextField
          name="phone"
          label="Phone number"
          type="text"
          value={formValues.phone}
          onChange={handleChange}
        />
        <FormControl fullWidth>
          <InputLabel id="register-form-account-type-label">
            Account type
          </InputLabel>
          <Select
            name="userRole"
            id="register-form-account-type"
            labelId="register-form-account-type-label"
            value={formValues.userRole}
            onChange={handleChange}
            label="Account type"
          >
            <MenuItem value="CLIENT">Client</MenuItem>
            <MenuItem value="TRANSPORTER">Transporter</MenuItem>
          </Select>
        </FormControl>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <Button type="submit">Register</Button>
        )}
      </form>
      <p>
        Already registered? <Link to={"/login"}>Log in</Link>
      </p>
    </div>
  );
};

export default Register;
