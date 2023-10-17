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
import { discountTypeApi } from "../features/setup/api/discountTypeApi";
import { termDaysApi } from "../features/setup/api/termDaysApi";
import { locationApi } from "../features/user-management/api/locationApi";
import { departmentApi } from "../features/user-management/api/departmentApi";
import { companyApi } from "../features/user-management/api/companyApi";
import { userRoleApi } from "../features/user-management/api/userRoleApi";
import { userAccountApi } from "../features/user-management/api/userAccountApi";
import { selectedRowSlice } from "../features/misc/reducers/selectedRowSlice";

export const store = configureStore({
  reducer: {
    login: loginSlice.reducer,
    permissions: permissionsSlice.reducer,
    selectedRow: selectedRowSlice.reducer,
    [loginApi.reducerPath]: loginApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [productCategoryApi.reducerPath]: productCategoryApi.reducer,
    [productSubCategoryApi.reducerPath]: productSubCategoryApi.reducer,
    [meatTypeApi.reducerPath]: meatTypeApi.reducer,
    [uomApi.reducerPath]: uomApi.reducer,
    [storeTypeApi.reducerPath]: storeTypeApi.reducer,
    [discountTypeApi.reducerPath]: discountTypeApi.reducer,
    [termDaysApi.reducerPath]: termDaysApi.reducer,
    [locationApi.reducerPath]: locationApi.reducer,
    [departmentApi.reducerPath]: departmentApi.reducer,
    [companyApi.reducerPath]: companyApi.reducer,
    [userRoleApi.reducerPath]: userRoleApi.reducer,
    [userAccountApi.reducerPath]: userAccountApi.reducer,
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
      discountTypeApi.middleware,
      termDaysApi.middleware,
      locationApi.middleware,
      departmentApi.middleware,
      companyApi.middleware,
      userRoleApi.middleware,
      userAccountApi.middleware,
    ]),
});

setupListeners(store.dispatch);
