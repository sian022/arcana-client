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
  tagTypes: ["Clients", "Sales Transaction"],

  endpoints: (builder) => ({
    getAllClientsForPOS: builder.query({
      query: (params) => ({
        url: "/clients/pos",
        method: "GET",
        params,
      }),
      providesTags: ["Clients"],
      transformResponse: (response) => response.value,
    }),

    getAllSalesTransaction: builder.query({
      query: (params) => ({
        url: "/sales-transaction",
        method: "GET",
        params,
      }),
      providesTags: ["Sales Transaction"],
      transformResponse: (response) => response.value,
    }),

    voidSalesTransaction: builder.mutation({
      query: ({ id }) => ({
        url: `/sales-transaction/${id}/void`,
        method: "PATCH",
      }),
      invalidatesTags: ["Sales Transaction"],
    }),

    uploadCiAttachment: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/sales-transaction/${id}/upload`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["Sales Transaction"],
    }),

    //Payment
    clearSalesTransaction: builder.mutation({
      query: (body) => ({
        url: "/sales-transaction/clear",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Sales Transaction"],
    }),
  }),
});

export const {
  useGetAllClientsForPOSQuery,
  useGetAllSalesTransactionQuery,
  useVoidSalesTransactionMutation,
  useUploadCiAttachmentMutation,
  useClearSalesTransactionMutation,
} = salesTransactionApi;
