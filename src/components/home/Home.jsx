import React, { useEffect, useContext } from "react";
import { observer } from "mobx-react-lite";
import CreateProductForm from "../forms/CreateProductForm";
import CreateRequestForm from "../forms/CreateRequestForm";
import { ProductsContext } from "../../contexts/productsContext";
import Requests from "../admin/requests/Requests";
import Users from "../admin/users/Users";
import { EUserRole } from "../../constants/EUserRole";
import NotFound from "../not-found/NotFound";
import Banned from "../banned/Banned";

const Home = observer(({ role }) => {
  const productsStore = useContext(ProductsContext);

  useEffect(() => {
    productsStore.initialize();
  }, [productsStore]);

  const products = productsStore.products;

  switch (role) {
    case EUserRole.ADMIN:
      return <Users />;
    case EUserRole.BANNED:
      return <Banned />;
    case EUserRole.CARRIER:
      return <Requests />;
    case EUserRole.CLIENT:
      return (
        <>
          <CreateProductForm></CreateProductForm>
          {productsStore.products.length ? (
            <CreateRequestForm products={[...products]}></CreateRequestForm>
          ) : (
            <></>
          )}
        </>
      );
    default:
      return <NotFound />;
  }
});

export default Home;
