import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { decryptString } from "../../../utils/CustomFunctions";

export const priceModeItemsApi = createApi({
  reducerPath: "priceModeItemsApi",
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
  tagTypes: ["Price Mode Items"],
  endpoints: (builder) => ({
    postItemsToPriceMode: builder.mutation({
      query: (body) => ({
        url: "/price-mode-items",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Price Mode Items"],
    }),

    getAllItemsByPriceModeId: builder.query({
      query: (params) => ({
        params: params,
        url: `/price-mode-items`,
        method: "GET",
      }),
      providesTags: ["Price Mode Items"],
      transformResponse: (response) => response.value,
      transformErrorResponse: (response) => response.value,
    }),

    getAllPriceModeForClients: builder.query({
      query: () => ({
        url: "/price-mode",
        method: "GET",
      }),
      providesTags: ["Price Mode Items"],
      transformResponse: (response) => response.value,
      transformErrorResponse: (response) => response.value,
    }),

    updatePriceModeItemStatus: builder.mutation({
      query: ({ id }) => ({
        url: `/price-change-items/${id}/archive`,
        method: "PATCH",
      }),
      invalidatesTags: ["Price Mode Items"],
    }),

    postPriceChange: builder.mutation({
      query: (body) => ({
        url: "/PriceChange/AddNewPriceChange",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Price Mode Items"],
    }),

    postAddPriceChange: builder.mutation({
      query: (body) => ({
        url: "/PriceChange/AddNewPriceChange",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Price Change"],
    }),

    getPriceChangeByPriceModeItemId: builder.query({
      query: (params) => ({
        url: "/item-price-change/",
        method: "GET",
        params: params,
      }),
      providesTags: ["Price Change"],
      transformResponse: (response) => response.value,
      transformErrorResponse: (response) => response.value,
    }),

    deletePriceChange: builder.mutation({
      query: ({ id }) => ({
        url: `/PriceChange/DeletePriceChange/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Price Change"],
    }),
  }),
});

export const {
  usePostItemsToPriceModeMutation,
  useGetAllItemsByPriceModeIdQuery,
  useLazyGetAllItemsByPriceModeIdQuery,
  useGetAllPriceModeForClientsQuery,
  useUpdatePriceModeItemStatusMutation,
  useLazyGetPriceChangeByPriceModeItemIdQuery,
  usePostPriceChangeMutation,
  usePostAddPriceChangeMutation,
  useDeletePriceChangeMutation,
} = priceModeItemsApi;
