import { runInAction, makeAutoObservable } from "mobx";
import { requestsService } from "../services/requestsService";

class RequestsStore {
  requests = [];

  constructor() {
    makeAutoObservable(this);
  }

  getRequestById = async (id) => {
    const local = this.requests.find((request) => request.id === parseInt(id));
    if (local) return local;
    const remote = await requestsService.getRequest(id);
    runInAction(() => {
      this.requests.push(remote);
    });
    return remote;
  };

  updateRequest = async (requestDetails) => {
    const requestIndex = this.requests.findIndex(
      (request) => request.id === requestDetails.id
    );

    const newRequest = await requestsService.updateRequest(requestDetails);
    runInAction(() => {
      this.requests = [
        ...this.requests.slice(0, requestIndex),
        newRequest,
        ...this.requests.slice(requestIndex + 1),
      ];
    });

    return newRequest;
  };

  initialize = async () => {
    let requests;
    try {
      requests = await requestsService.getAll();
    } catch (err) {
      requests = [];
    } finally {
      runInAction(() => {
        this.requests = [...requests];
      });
    }
  };
}

export const requestsStore = new RequestsStore();
