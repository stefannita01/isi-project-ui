import { createContext } from "react";
import { contractsStore } from "../stores/contractsStore";

export const ContractsContext = createContext(contractsStore);
