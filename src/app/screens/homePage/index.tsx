import React, { useEffect } from "react";

import PopularLessons from "./PopularLessons.tsx";
import NewLessons from "./NewLessons.tsx";
import PurchasedLessons from "./PurchasedLessons.tsx";

import Events from "./Events.tsx";

import "../../../css/home.css";
import "../../../css/lesson.css"
import "../../../css/welcome.css"
import { useDispatch } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";

import {
  setPopularLessons,
  setNewLessons,
  setTopUsers,
} from "./slice.ts";

import { Lesson } from "../../../lib/types/lesson.ts";
import { CartItem } from "../../../lib/types/search.ts";
import { LessonCollection } from "../../../lib/enums/lesson.enum.ts";
import LessonService from "../../service/LessonService.ts";
import { Member } from "../../../lib/types/member.ts";
import MemberService from "../../service/MemberService.ts";
import Welcome from "./welcome.tsx";

interface HomePageProps {
  onAdd: (item: CartItem) => void;
  setLoginOpen?: (isOpen: boolean) => void;
}

const actionDispatch = (dispatch: Dispatch) => ({
  setPopularLessons: (data: Lesson[]) => dispatch(setPopularLessons(data)),
  setNewLessons: (data: Lesson[]) => dispatch(setNewLessons(data)),
  setTopUsers: (data: Member[]) => dispatch(setTopUsers(data)),
});

export default function HomePage({ onAdd, setLoginOpen }: HomePageProps) {
  const dispatch = useDispatch();
  const { setPopularLessons, setNewLessons, setTopUsers } = actionDispatch(dispatch);

  useEffect(() => {
    const lessonService = new LessonService();

    // ✅ Popular Lessons - 5개로 제한
    lessonService
      .getLessons({
        page: 1,
        limit: 5,
      })
      .then((data) => {
        console.log("✅ Popular Lessons 로딩:", data);
        setPopularLessons(data);
      })
      .catch((err) => console.error("❌ Popular lessons error:", err));

    // ✅ New Lessons - 최신 업로드 순으로 정렬
    lessonService
      .getLessons({
        page: 1,
        limit: 8,
        order: "createdAt", // 최신 업로드 순
      })
      .then((data) => {
        console.log("✅ New Lessons 로딩:", data);
        setNewLessons(data);
      })
      .catch((err) => console.error("❌ New lessons error:", err));

    // ✅ Top Users - Events용 강의 데이터로 활용
    const memberService = new MemberService();
    memberService
      .getTopUsers()
      .then((data) => {
        console.log("✅ Top Users 로딩:", data);
        setTopUsers(data);
      })
      .catch((err) => console.error("❌ Top users error:", err));
  }, []);

  return (
    <div className="homepage">
      <Welcome />
      <PurchasedLessons />
      <PopularLessons onAdd={onAdd} setLoginOpen={setLoginOpen} />
      <NewLessons onAdd={onAdd} setLoginOpen={setLoginOpen} />
      <Events />
    </div>
  );
}
