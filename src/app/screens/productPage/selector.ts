import { createSelector } from "reselect"
import { AppRootState } from "../../../lib/types/screen.ts"

const selectLessonsPage = (state:AppRootState)=>state.lessonPage;


export const retrieveLesson = createSelector(
    selectLessonsPage,
     (LessonsPage)=>LessonsPage.admin
);
export const retrieveChosenLesson = createSelector(
    selectLessonsPage,
     (LessonsPage)=>LessonsPage.chosenLesson
);
export const retrieveLessons = createSelector(
    selectLessonsPage,
     (LessonsPage)=>LessonsPage.lessons
); 