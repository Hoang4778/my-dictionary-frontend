// store/index.js
import { configureStore } from "@reduxjs/toolkit";
import recentWordsReducer from "./recentWordsSlice";

export const store = configureStore({
  reducer: {
    recentWords: recentWordsReducer,
  },
});
