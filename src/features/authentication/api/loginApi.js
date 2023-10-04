import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const loginApi = createApi({
  reducerPath: "loginApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASEURL,
  }),
  endpoints: (builder) => ({
    postLogin: builder.mutation({
      query: (payload) => ({
        url: "/Authenticate/Authenticate",
        method: "POST",
        headers: { Accept: "application/json" },
        body: payload,
      }),
    }),
  }),
});

export const { usePostLoginMutation } = loginApi;
