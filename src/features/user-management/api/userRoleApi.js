import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { decryptString } from "../../../utils/CustomFunctions";

export const userRoleApi = createApi({
  reducerPath: "userRoleApi",
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
  tagTypes: ["User Role"],
  endpoints: (builder) => ({
    postUserRole: builder.mutation({
      query: (body) => ({
        url: "/UserRole/AddNewUserRole",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["User Role"],
    }),
    getAllUserRoles: builder.query({
      query: (params) => ({
        params: params,
        url: "/UserRole/GetUserRoles",
        method: "GET",
      }),
      providesTags: ["User Role"],
      transformResponse: (response) => response.data,
      transformErrorResponse: (response) => response.data,
    }),
    putUserRole: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/UserRole/UpdateUserRole/${id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["User Role"],
    }),
    patchUserRoleStatus: builder.mutation({
      query: (id) => ({
        url: `/UserRole/UpdateUserRoleStatus/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["User Role"],
    }),
  }),
});

export const {
  usePostUserRoleMutation,
  useGetAllUserRolesQuery,
  usePutUserRoleMutation,
  usePatchUserRoleStatusMutation,
} = userRoleApi;
