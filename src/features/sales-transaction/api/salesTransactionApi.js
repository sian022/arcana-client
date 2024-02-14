import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { decryptString } from "../../../utils/CustomFunctions";

export const salesTransactionApi = createApi({
  reducerPath: "salesTransactionApi",
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
  tagTypes: ["Clients"],

  endpoints: (builder) => ({
    getAllClientsForPOS: builder.query({
      query: (params) => ({
        url: "/clients/pos",
        method: "GET",
        params,
      }),
      providesTags: ["Clients"],
      transformResponse: (response) => response.value,
      transformErrorResponse: (response) => response.value,
    }),

    getAllSalesTransaction: builder.query({
      query: (params) => ({
        url: "/sales-transaction",
        method: "GET",
        params,
      }),
      providesTags: ["Sales Transaction"],
      transformResponse: (response) => response.value,
      transformErrorResponse: (response) => response.value,
    }),

    uploadCiAttachment: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/sales-transaction/${id}/upload`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Sales Transaction"],
    }),
  }),
});

export const {
  useGetAllClientsForPOSQuery,
  useUploadCiAttachmentMutation,
  useGetAllSalesTransactionQuery,
} = salesTransactionApi;
