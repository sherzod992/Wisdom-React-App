import { Route, Switch, useRouteMatch } from "react-router-dom";
import Products from "./Products.tsx";
import ChosenProducts from "./ChosenProduct.tsx";
import "../../../css/products.css"
import React from "react";

 export default function ProductsPage() {
  const products = useRouteMatch();
    return (
    <div className="products-page">
     <Switch>
     <Route path={`${products.path}/:productId`}>
        <ChosenProducts/>
      </Route>
      <Route path={`${products.path}`}>
        <Products/>
      </Route>
     </Switch>
    </div>
    );
  }
  