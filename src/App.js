import "./App.css";
import { useContext, useEffect, useRef } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { AuthContext } from "./contexts/authContext";
import { SnackbarContext } from "./contexts/snackbarContext";
import PrivateRoute from "./components/private-route/PrivateRoute";
import Register from "./components/auth/register/Register";
import LogIn from "./components/auth/login/LogIn";
import Home from "./components/home/Home";
import Track from "./components/track/Track";
import TopBar from "./components/top-bar/TopBar";
import { observer } from "mobx-react-lite";
import { Snackbar, Alert } from "@mui/material";
import { useSnack } from "./hooks/useSnack";
import esriConfig from "@arcgis/core/config";
import styles from "./components/home/Home.module.css";
import Requests from "./components/admin/requests/Requests";
import NotFound from "./components/not-found/NotFound";
import Trucks from "./components/trucks/Trucks";

// work laptop test commit
// testing local project git config

const DEFAULT_ROUTE = "/";
const ESRI_API_KEY =
  "AAPK4fb8e9ce7a384cbc9528d136d298a5d8G4WgtP59lif5y_uxke9pKgsDrdvRQjhC_D8DgRXbm0PJS4lc0TvTgRBM-oRSgw2O";
const DEFAULT_ESRI_API_KEY = "https://js.arcgis.com/[4.x]/@arcgis/core/assets";

const App = observer(() => {
  const { authenticated, user } = useContext(AuthContext);
  const navigate = useRef(useNavigate());
  const [snack, snackApi] = useSnack();

  useEffect(() => {
    if (!authenticated) {
      navigate.current("/login");
    }
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
      {authenticated && <TopBar role={user.role}></TopBar>}
      <div className={styles.appContent}>
        <Routes>
          <Route path="*" element={<NotFound />} />
          {authenticated && (
            <>
              <Route path={DEFAULT_ROUTE} element={<PrivateRoute />}>
                <Route path="/" element={<Home role={user.role} />} />
              </Route>
              {user.role === "CLIENT" && (
                <>
                  <Route path="track" element={<Track />} />
                </>
              )}
              {user.role === "CARRIER" && (
                <>
                  <Route
                    path="trucks"
                    element={<Trucks canAddTruck={true} />}
                  />
                </>
              )}
            </>
          )}

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<LogIn />} />
        </Routes>
      </div>
    </SnackbarContext.Provider>
  );
});

export default App;
