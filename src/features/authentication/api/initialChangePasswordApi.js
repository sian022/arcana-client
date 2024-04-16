import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const initialChangePasswordApi = createApi({
  reducerPath: "initialChangePasswordApi",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASEURL }),
  endpoints: (builder) => ({
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

export const { usePatchInitialChangePasswordMutation } =
  initialChangePasswordApi;
