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
    getApproverByModule: builder.query({
      query: (params) => ({
        url: "/Approver/GetApproverByModule",
        method: "GET",
        params,
      }),
      providesTags: ["Approver"],
      transformResponse: (response) => response.data,
      transformErrorResponse: (response) => response.data,
    }),
  }),
});

export const {
  useGetAllApproversQuery,
  useAddApproversPerModuleMutation,
  useGetApproverByModuleQuery,
} = approverApi;
