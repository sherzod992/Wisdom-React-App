import { createSlice } from "@reduxjs/toolkit";
import { LessonPageState } from "../../../lib/types/screen.ts";
const initialState: LessonPageState = {
    admin: null,
    chosenLesson: null,
    lessons: [],
};

const lessonPageSlice = createSlice({
    name: "LessonPage",
    initialState,
    reducers:{
        setLesson:(state,action)=>{
            state.admin = action.payload
        },
        setChosenLesson:(state,action)=>{
            state.chosenLesson = action.payload;
        },
        setLessons:(state,action)=>{
            state.lessons = action.payload;
        }
    }
})
export const {setLesson,setChosenLesson,setLessons} = lessonPageSlice.actions;
export default lessonPageSlice.reducer;