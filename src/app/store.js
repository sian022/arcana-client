import { configureStore } from "@reduxjs/toolkit";
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
import { selectedStoreTypeSlice } from "../features/prospect/reducers/selectedStoreTypeSlice";
import { prospectApi } from "../features/prospect/api/prospectApi";
import { badgeSlice } from "../features/prospect/reducers/badgeSlice";
import { registrationApi } from "../features/registration/api/registrationApi";
import { regularRegistrationSlice } from "../features/registration/reducers/regularRegistrationSlice";
import { sedarApi } from "../features/user-management/api/sedarApi";
import { userConfigApi } from "../features/authentication/api/userConfigApi";
import { listingFeeApi } from "../features/listing-fee/api/listingFeeApi";
import { disclosureSlice } from "../features/misc/reducers/disclosureSlice";
import { approverApi } from "../features/user-management/api/approverApi";
import { notificationApi } from "../features/notification/api/notificationApi";
import { phLocationsApi } from "../features/location/api/phLocationsApi";
import { clusterApi } from "../features/setup/api/clusterApi";
import { otherExpensesApi } from "../features/setup/api/otherExpensesApi";
import { otherExpensesRegApi } from "../features/otherExpenses/api/otherExpensesRegApi";
import { priceModeSetupApi } from "../features/setup/api/priceModeSetupApi";
import { priceModeItemsApi } from "../features/setup/api/priceModeItemsApi";
import { salesTransactionApi } from "../features/sales-management/api/salesTransactionApi";
import { specialDiscountApi } from "../features/special-discount/api/specialDiscountApi";
import { rdfSmsApi } from "../features/misc/api/rdfSmsApi";
import { advancePaymentApi } from "../features/sales-management/api/advancePaymentApi";
import { api } from "../features/api";

export const store = configureStore({
  reducer: {
    login: loginSlice.reducer,
    permissions: permissionsSlice.reducer,
    selectedRow: selectedRowSlice.reducer,
    selectedStoreType: selectedStoreTypeSlice.reducer,
    badge: badgeSlice.reducer,
    regularRegistration: regularRegistrationSlice.reducer,
    disclosure: disclosureSlice.reducer,
    [api.reducerPath]: api.reducer,
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
    [approverApi.reducerPath]: approverApi.reducer,
    [prospectApi.reducerPath]: prospectApi.reducer,
    [registrationApi.reducerPath]: registrationApi.reducer,
    [sedarApi.reducerPath]: sedarApi.reducer,
    [userConfigApi.reducerPath]: userConfigApi.reducer,
    [listingFeeApi.reducerPath]: listingFeeApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    [phLocationsApi.reducerPath]: phLocationsApi.reducer,
    [clusterApi.reducerPath]: clusterApi.reducer,
    [otherExpensesApi.reducerPath]: otherExpensesApi.reducer,
    [otherExpensesRegApi.reducerPath]: otherExpensesRegApi.reducer,
    [priceModeSetupApi.reducerPath]: priceModeSetupApi.reducer,
    [priceModeItemsApi.reducerPath]: priceModeItemsApi.reducer,
    [salesTransactionApi.reducerPath]: salesTransactionApi.reducer,
    [specialDiscountApi.reducerPath]: specialDiscountApi.reducer,
    [rdfSmsApi.reducerPath]: rdfSmsApi.reducer,
    [advancePaymentApi.reducerPath]: advancePaymentApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      api.middleware,
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
      approverApi.middleware,
      prospectApi.middleware,
      registrationApi.middleware,
      sedarApi.middleware,
      userConfigApi.middleware,
      listingFeeApi.middleware,
      notificationApi.middleware,
      phLocationsApi.middleware,
      clusterApi.middleware,
      otherExpensesApi.middleware,
      otherExpensesRegApi.middleware,
      priceModeSetupApi.middleware,
      priceModeItemsApi.middleware,
      salesTransactionApi.middleware,
      specialDiscountApi.middleware,
      rdfSmsApi.middleware,
      advancePaymentApi.middleware,
    ]),
});

setupListeners(store.dispatch);
