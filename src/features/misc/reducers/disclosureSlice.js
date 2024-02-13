import { createSlice } from "@reduxjs/toolkit";

export const disclosureSlice = createSlice({
  name: "disclosure",
  initialState: {
    sidebar: JSON.parse(localStorage.getItem("sidebarToggled")) ?? true,
    sidebarSmallScreen: false,
  },
  reducers: {
    toggleSidebar: (state) => {
      localStorage.setItem("sidebarToggled", !state.sidebar);
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
