import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { homePageReducer } from './screens/homePage/slice.ts';
import { lessonPageReducer } from './screens/lessonsPage/slice.ts';

export const store = configureStore({
  reducer: {
    homePage: homePageReducer,
    lessonsPage: lessonPageReducer,  // E'tibor bering: bu nom `selector.ts` bilan mos bo'lishi kerak
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: process.env.NODE_ENV !== 'production', // DevTools faqat ishlab chiqishda yoqilsin
});

// RootState tipi — store ichidagi barcha reducerlardan olingan global state tipi
export type RootState = ReturnType<typeof store.getState>;

// AppDispatch tipi — store.dispatch funksiyasining tipi
export type AppDispatch = typeof store.dispatch;

// AppThunk tipi — Redux Thunk uchun generik tipi
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
