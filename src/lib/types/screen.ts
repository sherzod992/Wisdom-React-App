import exp from "constants";
import { Lesson } from "./lesson";
import { Member } from "./member";



export interface AppRootState { // interface yaratilyapti
    homePage: HomePageState; // buni ichida homepage degan bolim bor (component)
    lessonPage: LessonPageState;
}
//difination
export interface HomePageState {
    popularLesson:Lesson[];
    newLesson:Lesson[];
    topUsers:Member[];
}

/** PRODUCT PAGE **/

export interface LessonPageState{
    teacher:Member|null;
    chosenLesson: Lesson|null;
    lessons:Lesson[];
}


/** OrDErS PAGe **/