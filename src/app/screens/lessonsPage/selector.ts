import { createSelector } from "reselect"
import { AppRootState } from "../../../lib/types/screen";

const selectLessonsPage= (state:AppRootState)=>state.lessonPage;


export const retrieveAdmin= createSelector(
    selectLessonsPage,
     (LessonsPage)=>LessonsPage.admin
);
export const retrieveLessonDetail = createSelector(
    selectLessonsPage,
     (LessonsPage)=>LessonsPage.lessonDetail
);
export const retrieveLessons = createSelector(
    selectLessonsPage,
     (LessonsPage)=>LessonsPage.lessons
); 