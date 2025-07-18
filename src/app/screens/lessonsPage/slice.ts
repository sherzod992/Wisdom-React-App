import { createSlice } from "@reduxjs/toolkit";
import { LessonPageState } from "../../../lib/types/screen.ts";

const initialState: LessonPageState = {
    admin: null,
    lessonDetail: null,
    lessons: [],
};

const lessonPageSlice = createSlice({
    name: "lessonPage", // 🔄 kichik harf bilan nomlash – redux reducer nomi bilan mos bo'lishi kerak
    initialState,
    reducers: {
        setadmin: (state, action) => {
            state.admin = action.payload;
        },
        setLessonDetail: (state, action) => {
            state.lessonDetail = action.payload; // ✅ to‘g‘ri maydon
        },
        setLessons: (state, action) => {
            state.lessons = action.payload; // ✅ to‘g‘ri maydon
        }
    }
});

export const { setadmin,setLessonDetail,setLessons } = lessonPageSlice.actions;
export const lessonPageReducer = lessonPageSlice.reducer;
export default lessonPageSlice.reducer; // ✅ to‘g‘ri export
