import "./App.css";
import { useContext, useEffect, useRef } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { AuthContext } from "./contexts/authContext";
import { SnackbarContext } from "./contexts/snackbarContext";
import PrivateRoute from "./components/private-route/PrivateRoute";
import Register from "./components/auth/register/Register";
import LogIn from "./components/auth/login/LogIn";
import Home from "./components/home/Home";
import { observer } from "mobx-react-lite";
import { Snackbar, Alert } from "@mui/material";
import { useSnack } from "./hooks/useSnack";

const DEFAULT_ROUTE = "/";

const App = observer(() => {
  const { authenticated } = useContext(AuthContext);
  const navigate = useRef(useNavigate());
  const [snack, snackApi] = useSnack();

  useEffect(() => {
    navigate.current(authenticated ? DEFAULT_ROUTE : "/login");
  }, [authenticated]);

  return (
    // for the love of god destructure snackApi when you use it
    <SnackbarContext.Provider value={{ snack, ...snackApi }}>
      <Snackbar
        open={snack.open}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        autoHideDuration={3000}
        onClose={snackApi.setClosedSnack}
      >
        <Alert severity={snack.severity}>{snack.message}</Alert>
      </Snackbar>
      <Routes>
        <Route path={DEFAULT_ROUTE} element={<PrivateRoute />}>
          <Route path="" element={<Home />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LogIn />} />
      </Routes>
    </SnackbarContext.Provider>
  );
});

export default App;
