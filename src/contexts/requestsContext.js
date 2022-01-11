import React from "react";
import { requestsStore } from "../stores/requestsStore";

export const RequestsContext = React.createContext(requestsStore);
