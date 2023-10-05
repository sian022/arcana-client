import { createSlice } from "@reduxjs/toolkit";

const storePermissions = sessionStorage.getItem("permissions");
const parseData = JSON.parse(storePermissions);

export const permissionsSlice = createSlice({
  name: "permissions",
  initialState: {
    permissions: parseData || [],
  },
  reducers: {
    setPermissisons: (state, action) => {
      sessionStorage.setItem("permissions", JSON.stringify(action.payload));
      state.permissions = action.payload;
      console.log(action);
    },
  },
});

export const { setPermissisons } = permissionsSlice.actions;
