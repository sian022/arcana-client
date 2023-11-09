import { createSlice } from "@reduxjs/toolkit";

export const disclosureSlice = createSlice({
  name: "disclosure",
  initialState: {
    sidebar: true,
  },
  reducers: {
    toggleSidebar: (state) => {
      state.sidebar = !state.sidebar;
    },
  },
});

export const { toggleSidebar } = disclosureSlice.actions;

export default disclosureSlice.reducer;
