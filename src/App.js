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
import esriConfig from "@arcgis/core/config";

const DEFAULT_ROUTE = "/";
const ESRI_API_KEY =
  "AAPK4fb8e9ce7a384cbc9528d136d298a5d8G4WgtP59lif5y_uxke9pKgsDrdvRQjhC_D8DgRXbm0PJS4lc0TvTgRBM-oRSgw2O";
const DEFAULT_ESRI_API_KEY = "https://js.arcgis.com/[4.x]/@arcgis/core/assets";

const App = observer(() => {
  const { authenticated } = useContext(AuthContext);
  const navigate = useRef(useNavigate());
  const [snack, snackApi] = useSnack();

  useEffect(() => {
    navigate.current(authenticated ? DEFAULT_ROUTE : "/login");
    esriConfig.apiKey = authenticated ? ESRI_API_KEY : DEFAULT_ESRI_API_KEY;
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
        <Route path="/track" element={<PrivateRoute />}></Route>
      </Routes>
    </SnackbarContext.Provider>
  );
});

export default App;
