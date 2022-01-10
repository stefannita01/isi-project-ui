import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";

export const useMap = (mapDiv) => {
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
  }
};
