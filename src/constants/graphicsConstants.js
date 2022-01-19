const DEFAULT_POINT_COLOR = "black";
const DEFAULT_POINT_SIZE = "8px";

export const DEFAULT_POINT = {
  type: "simple-marker",
  color: DEFAULT_POINT_COLOR,
  size: DEFAULT_POINT_SIZE,
};

export const BUSY_TRUCK = {
  ...DEFAULT_POINT,
  color: "red",
};

export const AVAILABLE_TRUCK = {
  ...DEFAULT_POINT,
  color: "green",
};

export const REQUEST_PICKUP = {
  ...DEFAULT_POINT,
  color: "white",
};

export const REQUEST_DROPOFF = DEFAULT_POINT;
