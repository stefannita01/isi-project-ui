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
      this.trucks = [...this.trucks, truck];
    });
    return truck;
  };

  updateTruck = async (truckDetails) => {
    const truckIndex = this.trucks.findIndex(
      (truck) => truck.id === truckDetails.id
    );

    const newTruck = await trucksService.updateTruck(truckDetails);
    runInAction(() => {
      this.trucks = [
        ...this.trucks.slice(0, truckIndex),
        newTruck,
        ...this.trucks.slice(truckIndex + 1),
      ];
    });

    return newTruck;
  };
}

export const trucksStore = new TrucksStore();
