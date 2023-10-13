import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { loginSlice } from "../features/authentication/reducers/loginSlice";
import { loginApi } from "../features/authentication/api/loginApi";
import { permissionsSlice } from "../features/authentication/reducers/permissionsSlice";
import { productsApi } from "../features/setup/api/productsApi";
import { productCategoryApi } from "../features/setup/api/productCategoryApi";
import { productSubCategoryApi } from "../features/setup/api/productSubCategoryApi";
import { meatTypeApi } from "../features/setup/api/meatTypeApi";
import { uomApi } from "../features/setup/api/uomApi";
import { storeTypeApi } from "../features/setup/api/storeTypeApi";

export const store = configureStore({
  reducer: {
    login: loginSlice.reducer,
    permissions: permissionsSlice.reducer,
    [loginApi.reducerPath]: loginApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [productCategoryApi.reducerPath]: productCategoryApi.reducer,
    [productSubCategoryApi.reducerPath]: productSubCategoryApi.reducer,
    [meatTypeApi.reducerPath]: meatTypeApi.reducer,
    [uomApi.reducerPath]: uomApi.reducer,
    [storeTypeApi.reducerPath]: storeTypeApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      loginApi.middleware,
      productsApi.middleware,
      productCategoryApi.middleware,
      productSubCategoryApi.middleware,
      meatTypeApi.middleware,
      uomApi.middleware,
      storeTypeApi.middleware,
    ]),
});

setupListeners(store.dispatch);
