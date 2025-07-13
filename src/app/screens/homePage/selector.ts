import { createSelector } from "reselect"
import { AppRootState } from "../../../lib/types/screen"

const selectHomePage = (state:AppRootState)=> state.homePage;


export const retriverPopularLessons = createSelector(
    selectHomePage,
    (HomePage)=>HomePage.popularLessons
);
export const retriverNewLessons =createSelector(
    selectHomePage,
    (HomePage)=>HomePage.newLessons
);
export const retriverTopUsers = createSelector(
    selectHomePage,
    (HomePage)=>HomePage.topUsers
);

