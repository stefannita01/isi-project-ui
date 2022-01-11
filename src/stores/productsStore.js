import { runInAction, makeAutoObservable } from "mobx";
import { productsService } from "../services/productsService";

class ProductsStore {
  products = [];
  productsLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  createProduct = async (productDetails) => {
    this.productsLoading = true;
    try {
      const product = await productsService.createProduct(productDetails);
      runInAction(() => {
        this.products.push(product);
      });
    } catch (err) {
      runInAction(() => {
        this.productsLoading = false;
      });
      throw err;
    } finally {
      runInAction(() => {
        this.productsLoading = false;
      });
    }
  };

  initialize = async () => {
    this.productsLoading = true;
    try {
      const products = await productsService.getAll();
      runInAction(() => {
        this.products = [...products];
      });
    } catch (err) {
      runInAction(() => {
        this.products = [];
      });
    } finally {
      runInAction(() => {
        this.productsLoading = false;
      });
    }
  };
}

export const productsStore = new ProductsStore();
