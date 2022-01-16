import React, { useEffect, useContext } from "react";
// import Locate from "@arcgis/core/widgets/Locate";
// import Track from "@arcgis/core/widgets/Track";
import { observer } from "mobx-react-lite";
import CreateProductForm from "../forms/CreateProductForm";
import CreateRequestForm from "../forms/CreateRequestForm";
import { ProductsContext } from "../../contexts/productsContext";
import Requests from "../admin/requests/Requests";

const Home = observer(({ role }) => {
  const productsStore = useContext(ProductsContext);

  useEffect(() => {
    productsStore.initialize();
  }, [productsStore]);

  const products = productsStore.products;

  return role === "CLIENT" ? (
    <>
      <CreateProductForm></CreateProductForm>
      {productsStore.products.length ? (
        <CreateRequestForm products={[...products]}></CreateRequestForm>
      ) : (
        <></>
      )}
    </>
  ) : (
    <Requests></Requests>
  );
});

export default Home;
