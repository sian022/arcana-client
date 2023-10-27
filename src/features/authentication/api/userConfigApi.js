import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { decryptString } from "../../../utils/CustomFunctions";

export const userConfigApi = createApi({
  reducerPath: "userConfigApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASEURL,
    prepareHeaders: (headers) => {
      headers.set("Accept", "application/json");
      headers.set(
        "Authorization",
        `Bearer ${decryptString(sessionStorage.getItem("token"))}`
      );
    },
  }),
  tagTypes: ["User Config"],
  endpoints: (builder) => ({
    patchUserPassword: builder.mutation({
      query: (payload) => ({
        url: "/User/ChangePassword",
        method: "PATCH",
        headers: { Accept: "application/json" },
        body: payload,
      }),
    }),
  }),
});

export const { usePatchUserPasswordMutation } = userConfigApi;
