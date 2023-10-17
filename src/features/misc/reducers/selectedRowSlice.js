import { createSlice } from "@reduxjs/toolkit";

export const selectedRowSlice = createSlice({
  name: "selectedRow",
  initialState: {
    value: false,
  },
  reducers: {
    setSelectedRow: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setSelectedRow } = selectedRowSlice.actions;

export default selectedRowSlice.reducer;
