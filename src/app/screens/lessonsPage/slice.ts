import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Lesson } from "../../../lib/types/lesson";
import { Member } from "../../../lib/types/member";

interface LessonsState {
  lessonDetail: Lesson | null;
  lessons: Lesson[];
  admin: Member | null;
}

const initialState: LessonsState = {
  lessonDetail: null,
  lessons: [],
  admin: null,
};

const lessonPageSlice = createSlice({
  name: "lessonPage",
  initialState,
  reducers: {
    setLessonDetail(state, action: PayloadAction<Lesson>) {
      state.lessonDetail = action.payload;
    },
    setLessons(state, action: PayloadAction<Lesson[]>) {
      state.lessons = action.payload;
    },
    setadmin(state, action: PayloadAction<Member>) {
      state.admin = action.payload;
    },
  },
});

export const { setLessonDetail, setLessons, setadmin } = lessonPageSlice.actions;
export const lessonPageReducer = lessonPageSlice.reducer;
export default lessonPageSlice.reducer;
