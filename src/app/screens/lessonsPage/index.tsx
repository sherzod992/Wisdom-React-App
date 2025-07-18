import React from "react";
import { Route, Switch, useParams } from "react-router-dom";
import { CartItem } from "../../../lib/types/search.ts";
import "../../../css/products.css";

import Lessons from "./Lessons.tsx";
import '../../../css/PopularLessonsFilter.css'
interface LessonPageProps {
  onAdd: (item: CartItem) => void;
}

function LessonPageWrapper({ onAdd }: LessonPageProps) {
  const { productId } = useParams<{ productId: string }>();
  return <Lessons  />;
}

export default function LessonsPage({ onAdd }: LessonPageProps) {
  return (
    <div className="products-page">
      <Switch>
        <Route path="/lessons/:lessonId">
          <LessonPageWrapper onAdd={onAdd} />
        </Route>
        <Route path="/lessons" exact>
          <Lessons  />
        </Route>
      </Switch>
    </div>
  );
}
