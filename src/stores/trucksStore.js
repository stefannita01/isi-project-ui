import { runInAction, makeAutoObservable } from "mobx";
import { trucksService } from "../services/trucksService";

class TrucksStore {
  trucks = [];

  constructor() {
    makeAutoObservable(this);
  }

  initialize = async () => {
    const trucks = await trucksService.getAll();
    runInAction(() => {
      this.trucks = [...trucks];
    });
  };

  createTruck = async (truckDetails) => {
    const truck = await trucksService.createTruck(truckDetails);
    runInAction(() => {
      this.trucks.push(truck);
    });
    return truck;
  };
}

export const trucksStore = new TrucksStore();
