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

    patchInitialChangePassword: builder.mutation({
      query: ({ id, token, ...body }) => ({
        url: `/User/ChangeUserPassword/${id}`,
        method: "PATCH",
        body: body,
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
  }),
});

export const { usePostLoginMutation, usePatchInitialChangePasswordMutation } =
  loginApi;
