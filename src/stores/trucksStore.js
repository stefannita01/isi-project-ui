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
}

export const trucksStore = new TrucksStore();
