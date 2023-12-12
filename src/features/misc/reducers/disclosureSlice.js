import { createSlice } from "@reduxjs/toolkit";

export const disclosureSlice = createSlice({
  name: "disclosure",
  initialState: {
    sidebar: true,
    sidebarSmallScreen: false,
  },
  reducers: {
    toggleSidebar: (state) => {
      state.sidebar = !state.sidebar;
    },
    toggleSidebarSmallScreen: (state) => {
      state.sidebarSmallScreen = !state.sidebarSmallScreen;
    },
  },
});

export const { toggleSidebar, toggleSidebarSmallScreen } =
  disclosureSlice.actions;

export default disclosureSlice.reducer;
