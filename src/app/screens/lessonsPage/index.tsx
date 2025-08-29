import React from "react";
import { Route, Switch, useParams } from "react-router-dom";
import { CartItem } from "../../../lib/types/search.ts";
import "../../../css/products.css";

import Lessons from "./Lessons.tsx";
import '../../../css/PopularLessonsFilter.css'
interface LessonPageProps {
  onAdd: (item: CartItem) => void;
  setLoginOpen?: (isOpen: boolean) => void;
}

function LessonPageWrapper({ onAdd, setLoginOpen }: LessonPageProps) {
  const { productId } = useParams<{ productId: string }>();
  return <Lessons onAdd={onAdd} setLoginOpen={setLoginOpen} />;
}

export default function LessonsPage({ onAdd, setLoginOpen }: LessonPageProps) {
  return (
    <div className="products-page">
      <Switch>
        <Route path="/lessons/:lessonId">
          <LessonPageWrapper onAdd={onAdd} setLoginOpen={setLoginOpen} />
        </Route>
        <Route path="/lessons" exact>
          <Lessons onAdd={onAdd} setLoginOpen={setLoginOpen} />
        </Route>
      </Switch>
    </div>
  );
}
