import { createSlice } from "@reduxjs/toolkit";

export const selectedStoreTypeSlice = createSlice({
  name: "selectedStoreType",
  initialState: {
    value: "",
    objectValue: "",
  },
  reducers: {
    setSelectedStoreType: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setSelectedStoreType } = selectedStoreTypeSlice.actions;

export default selectedStoreTypeSlice.reducer;
