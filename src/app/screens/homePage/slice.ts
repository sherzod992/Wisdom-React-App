import { createSlice } from '@reduxjs/toolkit';
import { HomePageState } from '../../../lib/types/screen';


const initialState: HomePageState = { 
    popularLessons: [],
    newLessons: [],
    topUsers: []
}

const homePageSlice = createSlice({ //method
    name: 'homePage', //object propery
    initialState,
    reducers: {
        setPopularLessons: (state, action) => {
            state.popularLessons = action.payload;
        },
        setNewLessons: (state, action) => {
            state.newLessons = action.payload;
        },
        setTopUsers: (state, action) => {
            state.topUsers = action.payload;
        }
    }
});


export const {setPopularLessons, setNewLessons, setTopUsers} = homePageSlice.actions;
export const homePageReducer = homePageSlice.reducer;
export default homePageReducer