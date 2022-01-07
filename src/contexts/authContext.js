import React from "react";
import { authStore } from "../stores/authStore";

export const AuthContext = React.createContext(authStore);
