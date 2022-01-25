import { runInAction, makeAutoObservable } from "mobx";
import { contractsService } from "../services/contractsService";

class ContractsStore {
  contracts = [];

  get inProgressContracts() {
    return this.contracts.filter(
      (contract) => contract.request.status !== "COMPLETED"
    );
  }

  constructor() {
    makeAutoObservable(this);
  }

  getContractById = async (id) => {
    if (!this.contracts.length) {
      await this.initialize();
    }

    return this.contracts.find((contract) => contract.id === id);
  };

  updateContract = (contractDetails) => {
    const contractIndex = this.contracts.findIndex(
      (contract) => contract.id === contractDetails.id
    );

    this.contracts = [
      ...this.contracts.slice(0, contractIndex),
      contractDetails,
      ...this.contracts.slice(contractIndex + 1),
    ];

    return contractDetails;
  };

  initialize = async () => {
    let contracts;
    try {
      contracts = await contractsService.getAll();
    } catch (err) {
      contracts = [];
    } finally {
      runInAction(() => {
        this.contracts = [...contracts];
      });
    }
  };
}

export const contractsStore = new ContractsStore();
