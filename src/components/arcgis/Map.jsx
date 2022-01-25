import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import {
  useRef,
  useEffect,
  useMemo,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";

function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  return () => setValue((value) => value + 1); // update the state to force render
}

const Map = forwardRef(
  ({ layers = [], height = "50vh", width = "100%" }, ref) => {
    const mapDiv = useRef(null);
    const viewRef = useRef();

    const map = useMemo(
      () =>
        new WebMap({
          basemap: "arcgis-navigation",
        }),
      []
    );

    const view = useMemo(
      () =>
        new MapView({
          center: [-118.24532, 34.05398], // longitude, latitude
          zoom: 14,
          map,
          container: mapDiv.current,
        }),
      [mapDiv.current]
    );

    useImperativeHandle(ref, () => ({
      view,
    }));

    const forceUpdate = useForceUpdate();

    useEffect(() => {
      forceUpdate(); // dirtiest hack of my life. I basically hate myself. but idk how else to fix this lol
    }, [mapDiv.current]);

    useEffect(() => {
      view.popup.close();
      map.layers.length && map.removeAll();
      layers?.length && map.addMany(layers);
    }, [layers]);

    return (
      <div ref={viewRef}>
        <div ref={mapDiv} style={{ height, width }}></div>
      </div>
    );
  }
);

export default Map;
