import React, { useEffect } from "react";
import Statistics from "./Statics.tsx";
import PopularLessons from "./PopularLessons.tsx";
import NewLessons from "./NewLessons.tsx";
import Advertisement from "./Advertisement.tsx";
import ActiveUsers from "./ActiveUsers.tsx";
import Events from "./Events.tsx";

import "../../../css/home.css";

import { useDispatch } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";

import {
  setPopularLessons,
  setNewLessons,
  setTopUsers,
} from "./slice.ts";

import { Lesson } from "../../../lib/types/lesson.ts";
import { LessonCollection } from "../../../lib/enums/lesson.enum.ts";
import LessonService from "../../service/LessonService.ts";
import { Member } from "../../../lib/types/member.ts";
import MemberService from "../../service/MemberService.ts";

const actionDispatch = (dispatch: Dispatch) => ({
  setPopularLessons: (data: Lesson[]) => dispatch(setPopularLessons(data)),
  setNewLessons: (data: Lesson[]) => dispatch(setNewLessons(data)),
  setTopUsers: (data: Member[]) => dispatch(setTopUsers(data)),
});

export default function HomePage() {
  const dispatch = useDispatch();
  const { setPopularLessons, setNewLessons, setTopUsers } = actionDispatch(dispatch);

  useEffect(() => {
    const lessonService = new LessonService();

    // ✅ Popular Lessons
    lessonService
      .getLessons({
        page: 1,
        limit: 4,
      })
      .then((data) => setPopularLessons(data))
      .catch((err) => console.error("Popular lessons error:", err));

    // ✅ New Lessons (example: SCIENCE collection)
    lessonService
      .getLessons({
        page: 1,
        limit: 4,
        lessonCollection: LessonCollection.SCIENCE,
      })
      .then((data) => setNewLessons(data))
      .catch((err) => console.error("New lessons error:", err));

    // ✅ Top Users
    const memberService = new MemberService();
    memberService
      .getTopUsers()
      .then((data) => setTopUsers(data))
      .catch((err) => console.error("Top users error:", err));
  }, []);

  return (
    <div className="homepage">
      <Statistics />
      <PopularLessons />
      <NewLessons />
      <Advertisement />
      <ActiveUsers />
      <Events />
    </div>
  );
}
