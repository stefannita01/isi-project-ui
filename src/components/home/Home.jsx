import React, { useRef, useEffect } from "react";
import Locate from "@arcgis/core/widgets/Locate";
import Track from "@arcgis/core/widgets/Track";
import Graphic from "@arcgis/core/Graphic";
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";

import styles from "./Home.module.css";

const Home = () => {
  const mapDiv = useRef(null);

  useEffect(() => {
    if (mapDiv.current) {
      const webmap = new WebMap({
        basemap: "streets-vector",
      });

      const view = new MapView({
        container: mapDiv.current,
        map: webmap,
      });

      const locate = new Locate({
        view: view,
        useHeadingEnabled: false,
        goToLocationEnabled: true,
        goToOverride: function (view, options) {
          options.target.scale = 2000;
          return view.goTo(options.target);
        },
      });

      view.ui.add(locate, "top-left");
    }
  }, []);

  return <div className={styles.mapDiv} ref={mapDiv}></div>;
};

export default Home;
