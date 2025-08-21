// store/recentSearchSlice.js
import { createSlice } from "@reduxjs/toolkit";

const recentWordsSlice = createSlice({
  name: "recentWords",
  initialState: {
    words: [],
  },
  reducers: {
    addWord: (state, action) => {
      const word = action.payload;

      state.words = state.words.filter((recentWord) => recentWord != word);

      state.words.unshift(word);
    },
    applyNewList: (state, action) => {
      state.words = action.payload;
    },
  },
});

export const { addWord, applyNewList } = recentWordsSlice.actions;
export default recentWordsSlice.reducer;
