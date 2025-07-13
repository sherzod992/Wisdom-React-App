import { Lesson } from "./lesson";
import { Member } from "./member";



export interface AppRootState { 
    homePage: HomePageState; 
    lessonPage: LessonPageState;
}

export interface HomePageState {
    popularLessons:Lesson[];
    newLessons:Lesson[];
    topUsers:Member[];
}

/** LessonPage PAGE **/

export interface LessonPageState{
    admin:Member|null;
    chosenLesson: Lesson|null;
    lessons:Lesson[];
}

