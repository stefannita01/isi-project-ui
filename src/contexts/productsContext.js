import React from "react";
import { productsStore } from "../stores/productsStore";

export const ProductsContext = React.createContext(productsStore);
