import { createSlice } from "@reduxjs/toolkit";

export const badgeSlice = createSlice({
  name: "badge",
  initialState: {
    value: {},
  },
  reducers: {
    setBadge: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setBadge } = badgeSlice.actions;

export default badgeSlice.reducer;
