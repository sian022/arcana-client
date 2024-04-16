import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { loginSlice } from "../features/authentication/reducers/loginSlice";
import { permissionsSlice } from "../features/authentication/reducers/permissionsSlice";
import { selectedRowSlice } from "../features/misc/reducers/selectedRowSlice";
import { selectedStoreTypeSlice } from "../features/prospect/reducers/selectedStoreTypeSlice";
import { badgeSlice } from "../features/prospect/reducers/badgeSlice";
import { regularRegistrationSlice } from "../features/registration/reducers/regularRegistrationSlice";
import { sedarApi } from "../features/user-management/api/sedarApi";
import { disclosureSlice } from "../features/misc/reducers/disclosureSlice";
import { rdfSmsApi } from "../features/misc/api/rdfSmsApi";
import { api } from "../features/api";
import { initialChangePasswordApi } from "../features/authentication/api/initialChangePasswordApi";

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
    [initialChangePasswordApi.reducerPath]: initialChangePasswordApi.reducer,
    [sedarApi.reducerPath]: sedarApi.reducer,
    [rdfSmsApi.reducerPath]: rdfSmsApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      api.middleware,
      initialChangePasswordApi.middleware,
      sedarApi.middleware,
      rdfSmsApi.middleware,
    ]),
});

setupListeners(store.dispatch);
