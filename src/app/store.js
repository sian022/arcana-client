import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { loginSlice } from "../features/authentication/reducers/loginSlice";
import { loginApi } from "../features/authentication/api/loginApi";
import { permissionsSlice } from "../features/authentication/reducers/permissionsSlice";

export const store = configureStore({
  reducer: {
    login: loginSlice.reducer,
    permissions: permissionsSlice.reducer,
    [loginApi.reducerPath]: loginApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([loginApi.middleware]),
});

setupListeners(store.dispatch);
