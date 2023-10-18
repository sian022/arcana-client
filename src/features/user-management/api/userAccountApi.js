import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { decryptString } from "../../../utils/CustomFunctions";

export const userAccountApi = createApi({
  reducerPath: "userAccountApi",
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
  tagTypes: ["User"],
  endpoints: (builder) => ({
    postUser: builder.mutation({
      query: (body) => ({
        url: "/User/AddNewUser",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["User"],
    }),
    getAllUsers: builder.query({
      query: (params) => ({
        params: params,
        url: "/User/GetUser",
        method: "GET",
      }),
      providesTags: ["User"],
      transformResponse: (response) => response.data,
      transformErrorResponse: (response) => response.data,
    }),
    putUser: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/User/UpdateUser/${id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["User"],
    }),
    patchUserStatus: builder.mutation({
      query: (id) => ({
        url: `/User/UpdateUserStatus/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  usePostUserMutation,
  useGetAllUsersQuery,
  usePutUserMutation,
  usePatchUserStatusMutation,
} = userAccountApi;
