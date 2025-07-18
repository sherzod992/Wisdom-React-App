import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { homePageReducer } from './screens/homePage/slice.ts';
import { lessonPageReducer } from './screens/lessonsPage/slice.ts';
import reduxLogger from "redux-logger"

export const store = configureStore({
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  reducer: {
    homePage: homePageReducer,
    lessonsPage: lessonPageReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
