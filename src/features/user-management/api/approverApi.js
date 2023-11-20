import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { decryptString } from "../../../utils/CustomFunctions";

export const approverApi = createApi({
  reducerPath: "approverApi",
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
  tagTypes: ["Approver"],
  endpoints: (builder) => ({
    getAllApprovers: builder.query({
      query: () => ({
        url: "/Approvers/GetAllApprovers",
        method: "GET",
      }),
      providesTags: ["Approver"],
      transformResponse: (response) => response.data,
      transformErrorResponse: (response) => response.data,
    }),
    addApproversPerModule: builder.mutation({
      query: (body) => ({
        url: "/Approvers/AssignApprover",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Approver"],
    }),
    getApproversPerModule: builder.query({
      query: () => ({
        url: "/Approver/GetApproversPerModules",
        method: "GET",
      }),
      providesTags: ["Approver"],
      transformResponse: (response) => response.data,
      transformErrorResponse: (response) => response.data,
    }),
    putUpdateApproversPerModule: builder.mutation({
      query: ({ moduleName, ...body }) => ({
        url: `/Approver/UpdateApproversPerModule`,
        method: "PUT",
        params: { moduleName },
        body,
      }),
      invalidatesTags: ["Approver"],
    }),
  }),
});

export const {
  useGetAllApproversQuery,
  useAddApproversPerModuleMutation,
  useGetApproversPerModuleQuery,
  usePutUpdateApproversPerModuleMutation,
} = approverApi;
