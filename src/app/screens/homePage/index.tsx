
import React, { useEffect } from "react";
import Statistics from "./Statics.tsx";
import PopularDishes from "./PopularLessons.tsx";
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
import PopularLessons from "./PopularLessons.tsx";


const actionDispatch = (dispatch:Dispatch)=>({
  setPopularLessons:(data:Lesson[])=>dispatch(setPopularLessons(data)),
  setNewLessons:(data:Lesson[])=>dispatch(setNewLessons(data)),
  setTopUsers: (data:Member[]) => dispatch(setTopUsers(data)),
})

export default function HomePage() {
  const dispatch = useDispatch();
  const {setPopularLessons, setNewLessons, setTopUsers}= actionDispatch(dispatch);
  useEffect(()=>{
    const lesson = new LessonService();
    lesson.getLessons({
      page:1,
      limit:4,
    }).then((data)=>setPopularLessons(data)).catch((err)=>console.log(err));
    lesson.getLessons({
      page:1,
      limit:4,
      lessonCollection:LessonCollection.SCIENCE
    }).then((data)=>setPopularLessons(data)).catch((err)=>console.log(err));
    const member = new MemberService();
    member.getTopUsers().then((data)=>{
      setTopUsers(data);
    }).catch((err) =>console.log(err))
  },[])
  return (
    <div className="homepage">
      <Statistics />
      <PopularLessons />
      <NewDishes/>
      <Advertisement/>
      <ActiveUsers/>
      <Events/>
    </div>
  );
}