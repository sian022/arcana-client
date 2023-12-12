import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { decryptString } from "../../../utils/CustomFunctions";

export const departmentApi = createApi({
  reducerPath: "departmentApi",
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
  tagTypes: ["Department"],
  endpoints: (builder) => ({
    postDepartment: builder.mutation({
      query: (body) => ({
        url: "/Department/AddNewDepartment",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Department"],
    }),
    getAllDepartments: builder.query({
      query: (params) => ({
        params: params,
        url: "/Department/GetAllDepartment",
        method: "GET",
      }),
      providesTags: ["Department"],
      transformResponse: (response) => response.value,
      transformErrorResponse: (response) => response.value,
    }),
    putDepartment: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/Department/UpdateDepartment/${id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["Department"],
    }),
    patchDepartmentStatus: builder.mutation({
      query: (id) => ({
        url: `/Department/UpdateDepartmentStatus/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Department"],
    }),
  }),
});

export const {
  usePostDepartmentMutation,
  useGetAllDepartmentsQuery,
  usePutDepartmentMutation,
  usePatchDepartmentStatusMutation,
} = departmentApi;
