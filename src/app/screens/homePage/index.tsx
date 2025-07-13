
import React from "react";
import Statistics from "./Statics.tsx";
import PopularDishes from "./PopularDishes.tsx";
import "../../../css/home.css"
import NewDishes from "./NewDishes.tsx";
import Advertisement from "./Advertisement.tsx";
import ActiveUsers from "./ActiveUsers.tsx";
import Events from "./Events.tsx";

import { useDispatch} from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";

import {setPopularLessons, setNewLessons, setTopUsers} from "./slice.ts"
import { Lesson } from "../../../lib/types/lesson.ts";
import { LessonCollection } from "../../../lib/enums/lesson.enum.ts";
import LessonService from "../../service/LessonService.ts";
import { Member } from "../../../lib/types/member.ts";
import MemberService from "../../service/MemberService.ts";


const actionDispatch = (dispatch:Dispatch)=>({
  setPopularLessons:(data:Lesson[])=>dispatch(setPopularLessons(data)),
  setNewLessons:(data:Lesson[])=>dispatch(setNewLessons(data)),
  setTopUsers: (data:Member[]) => dispatch(setTopUsers(data)),
})

export default function HomePage() {
  const dispatch = useDispatch();
  const {setPopularLessons, setNewLessons, setTopUsers}= actionDispatch(dispatch);
  const lessons = new LessonService();
  lessons.getLessons({
    page:1,
    limit:4
  });
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