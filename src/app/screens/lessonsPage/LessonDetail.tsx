import {
    Badge,
    Box,
    Button,
    Container,
    Stack,
    Pagination,
    PaginationItem,
  } from "@mui/material";
  import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
  import ArrowBackIcon from "@mui/icons-material/ArrowBack";
  import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
  import SearchBar from "../../components/search.tsx";
  import { RemoveRedEye } from "@mui/icons-material";
  import React, { ChangeEvent, useEffect, useState } from "react";
  
  import { useDispatch, useSelector } from "react-redux";
  import { Dispatch } from "@reduxjs/toolkit";
  import { setLessons } from "./slice.ts";
  import { createSelector } from "@reduxjs/toolkit";
  import { retrieveLessons } from "./selector.ts";
  import { Lesson,LessonInquiry } from "../../../lib/types/lesson.ts";
  
  import { LessonCollection } from "../../../lib/enums/lesson.enum.ts";
  import { serverApi } from "../../../lib/types/config.ts";
import { useHistory } from "react-router-dom";
import { CartItem } from "../../../lib/types/search.ts";
import LessonService from "../../service/LessonService.ts";


const actionDispatch = (dispatch: Dispatch) => ({
    setLessons: (data: Lesson[]) => dispatch(setLessons(data)),
  });
  
  const lessonsRetriever = createSelector(retrieveLessons, (lessons) => ({
    lessons,
  }));
  interface LessonsProps {
    onAdd: (item: CartItem) => void;
  }

  export default function Lessons(props:LessonsProps) {
    const {onAdd} = props;
    const { setLessons} = actionDispatch(useDispatch());
    const { lessons } = useSelector(lessonsRetriever);
  
    const [lessonSerach, setLessonSearch] = useState<LessonInquiry>({
      page: 1,
      limit: 8,
      order: "createAt",
      lessonCollection: LessonCollection.SCIENCE,
      search: "",
    });
  
    const [searchText, setSearchText] = useState<string>("");
    const useHihtory = useHistory()
    useEffect(() => {
      const lesson= new LessonService();
      lesson
        .getLessons(lessonSerach)
        .then((data) => setLessons(data))
        .catch((err) => console.log(err));
    }, [lessonSerach]);
    
    useEffect(()=>{
        if(searchText===""){
            lessonSerach.search = "";
            setLessonSearch({...lessonSerach})
            
        }
    },[searchText])




    /** HANDLERS **/
  
    const searchCollectionHandler = (collection: LessonCollection) => {
      setLessonSearch({
        ...lessonSerach,
        page: 1,
        lessonCollection: collection,
      });
    };
  
    const searchOrderHendler = (order: string) => {
      setLessonSearch({
        ...lessonSerach,
        page: 1,
        order: order,
      });
    };
  
    const searchLessonHendler = () => {
      setLessonSearch({
        ...lessonSerach,
        page: 1,
        search: searchText,
      });
    };
    
    const paginationHendler = (e:ChangeEvent<any>, value: number)=>{
        lessonSerach.page = value;
        setLessonSearch({...lessonSerach})
    }

    const choseDishHandler =(id:string)=>{
        useHihtory.push(`/lessons/${id}`)
    }}
