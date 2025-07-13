import React from "react";

import { Route, Switch, useLocation} from "react-router-dom";
import  ProducPage  from "./screens/productPage/index.tsx";
import  OrdersPage  from "./screens/orderPage/index.tsx";
import  UsersPage  from "./screens/usersPage/index.tsx";
import HomePage from "./screens/homePage/index.tsx"
import  HomeNavbar  from "./components/headers/HomeNavbar.tsx";
import  OtherNavbar  from "./components/headers/OtherNavbar.tsx";
import  Footer  from "./components/footer/index.tsx";
import "../css/navbar.css"
import "../css/footer.css"
// import "../css/index.css";
import "../css/app.css"
import  HelpPage  from "./screens/helpPage/intex.tsx";


function App() {
  const location = useLocation();
   console.log("location",location)
     
  return (
    <>
    {location.pathname === "/" ? <HomeNavbar/> : <OtherNavbar/>} 
        <Switch>
          <Route path="/products">
            <ProducPage />
          </Route>
          <Route path="/orders">
            <OrdersPage />
          </Route>
          <Route path="/member-page">
            <UsersPage />
          </Route>
          <Route path="/help">
            <HelpPage />
          </Route>
          <Route path="/">
          <HomePage />
          </Route>
        </Switch>
        <Footer />
    </>

  );
}

export default App; 