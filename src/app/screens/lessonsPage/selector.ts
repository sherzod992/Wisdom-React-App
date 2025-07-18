import { RootState } from "../../store";

const selectLessonsPage = (state: RootState) => state.lessonsPage;

export const retrieveLessonDetail = (state: RootState) => selectLessonsPage(state).lessonDetail;
export const retrieveLessons = (state: RootState) => selectLessonsPage(state).lessons;
export const retrieveAdmin = (state: RootState) => selectLessonsPage(state).admin;
