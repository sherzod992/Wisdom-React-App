import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { homePageReducer } from './screens/homePage/slice.ts';
import reduxLogger from "redux-logger"
import lessonPageReducer from './screens/productPage/slice.ts';
export const store = configureStore({
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  reducer: {
    homePage: homePageReducer,
    productPage: lessonPageReducer,
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
