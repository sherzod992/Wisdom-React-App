
import React from "react";
import Statistics from "./Statics.tsx";
import PopularDishes from "./PopularDishes.tsx";
import "../../../css/home.css"
import NewDishes from "./NewDishes.tsx";
import Advertisement from "./Advertisement.tsx";
import ActiveUsers from "./ActiveUsers.tsx";
import Events from "./Events.tsx";
export default function HomePage() {
  return (
    <div className="homepage">
      <Statistics />
      <PopularDishes />
      <NewDishes/>
      <Advertisement/>
      <ActiveUsers/>
      <Events/>
    </div>
  );
}