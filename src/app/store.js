import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { loginSlice } from "../features/authentication/reducers/loginSlice";
import { loginApi } from "../features/authentication/api/loginApi";

export const store = configureStore({
  reducer: {
    login: loginSlice.reducer,
    [loginApi.reducerPath]: loginApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([loginApi.middleware]),
});

setupListeners(store.dispatch);
