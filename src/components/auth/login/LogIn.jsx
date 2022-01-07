import { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField, CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import { useForm } from "../../../hooks/useForm";
import { AuthContext } from "../../../contexts/authContext";
import { SnackbarContext } from "./../../../contexts/snackbarContext";
import styles from "../Auth.module.css";

const LogIn = () => {
  const { authenticated } = useContext(AuthContext);
  const navigate = useRef(useNavigate());

  useEffect(() => {
    if (authenticated) {
      navigate.current("/home");
    }
  }, [authenticated]);

  const { login } = useContext(AuthContext);
  const { setErrorSnack } = useContext(SnackbarContext);

  const [formValues, handleChange] = useForm({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      await login(formValues);
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
        {isLoading ? (
          <CircularProgress />
        ) : (
          <Button type="submit">Log In</Button>
        )}
      </form>
      <p>
        Not yet a member? <Link to={"/register"}>Register</Link>
      </p>
    </div>
  );
};

export default LogIn;
