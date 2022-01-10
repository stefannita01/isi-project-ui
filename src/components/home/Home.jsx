import React, { useRef, useEffect, useContext } from "react";
// import Locate from "@arcgis/core/widgets/Locate";
// import Track from "@arcgis/core/widgets/Track";
import Graphic from "@arcgis/core/Graphic";
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import RouteParameters from "@arcgis/core/rest/support/RouteParameters";
import FeatureSet from "@arcgis/core/rest/support/FeatureSet";
import * as route from "@arcgis/core/rest/route";
import * as locator from "@arcgis/core/rest/locator";
import { AppBar, Box, Toolbar, IconButton, Button } from "@mui/material";
import TopBar from "../top-bar/TopBar";
import { observer } from "mobx-react-lite";
import styles from "./Home.module.css";
import CreateProductForm from "../forms/CreateProductForm";
import CreateRequestForm from "../forms/CreateRequestForm";
import { ProductsContext } from "../../contexts/productsContext";

const Home = observer(() => {
  const productsStore = useContext(ProductsContext);

  useEffect(() => {
    productsStore.initialize();
  }, [productsStore]);

  const products = productsStore.products;

  return (
    <>
      <TopBar></TopBar>
      <div className={styles.appContent}>
        <CreateProductForm></CreateProductForm>
        {productsStore.products.length ? (
          <CreateRequestForm products={[...products]}></CreateRequestForm>
        ) : (
          <></>
        )}
      </div>
    </>
  );

  // const mapDiv = useRef(null);
  // const routeUrl =
  //   "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";
  // useEffect(() => {
  //   if (mapDiv.current) {
  //     const map = new WebMap({
  //       basemap: "arcgis-navigation",
  //     });
  //     const view = new MapView({
  //       container: mapDiv.current,
  //       map: map,
  //       center: [-118.24532, 34.05398], //Longitude, latitude
  //       zoom: 14,
  //     });
  //     view.on("click", (e) => {
  //       const geocodeUrl =
  //         "http://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer";
  //       locator
  //         .locationToAddress(geocodeUrl, {
  //           location: {
  //             x: e.mapPoint.longitude,
  //             y: e.mapPoint.latitude,
  //           },
  //         })
  //         .then((data) => console.log(data.address));
  //       if (view.graphics.length === 0) {
  //         addGraphic("origin", e.mapPoint);
  //       } else if (view.graphics.length === 1) {
  //         addGraphic("destination", e.mapPoint);
  //         getRoute();
  //       } else {
  //         view.graphics.removeAll();
  //         addGraphic("origin", e.mapPoint);
  //       }
  //     });
  //     function addGraphic(type, point) {
  //       const graphic = new Graphic({
  //         geometry: point,
  //         symbol: {
  //           type: "simple-marker",
  //           color: type === "origin" ? "white" : "black",
  //           size: "8px",
  //         },
  //       });
  //       view.graphics.add(graphic);
  //     }
  //     function moveOnRoute(paths) {
  //       let currentPoint;
  //       paths.forEach(([x, y], i) => {
  //         setTimeout(() => {
  //           if (currentPoint) {
  //             view.graphics.remove(currentPoint);
  //           }
  //           currentPoint = new Graphic({
  //             geometry: {
  //               type: "point",
  //               longitude: x,
  //               latitude: y,
  //             },
  //             symbol: {
  //               type: "simple-marker",
  //               color: "red",
  //               size: "10px",
  //             },
  //           });
  //           view.graphics.add(currentPoint);
  //         }, i * 500);
  //       });
  //     }
  //     function getRoute() {
  //       const routeParams = new RouteParameters({
  //         stops: new FeatureSet({
  //           features: view.graphics.toArray(),
  //         }),
  //       });
  //       route
  //         .solve(routeUrl, routeParams)
  //         .then(function (data) {
  //           data.routeResults.forEach(function (result) {
  //             result.route.symbol = {
  //               type: "simple-line",
  //               color: [5, 150, 255],
  //               width: 3,
  //             };
  //             view.graphics.add(result.route);
  //             moveOnRoute(result.route.geometry.paths[0]);
  //           });
  //         })
  //         .catch(function (error) {
  //           console.log(error);
  //         });
  //     }
  //   }
  // }, []);
  // return <div className={styles.mapDiv} ref={mapDiv}></div>;
});

export default Home;
