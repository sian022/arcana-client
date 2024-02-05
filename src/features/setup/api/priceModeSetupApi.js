import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { decryptString } from "../../../utils/CustomFunctions";

export const priceModeSetupApi = createApi({
  reducerPath: "priceModeSetupApi",
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
  tagTypes: ["Price Mode Setup"],
  endpoints: (builder) => ({
    postPriceMode: builder.mutation({
      query: (body) => ({
        url: "/price-mode",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Price Mode Setup"],
    }),

    getAllPriceMode: builder.query({
      query: (params) => ({
        params: params,
        url: "/price-mode/page",
        method: "GET",
      }),
      providesTags: ["Price Mode Setup"],
      transformResponse: (response) => response.value,
      transformErrorResponse: (response) => response.value,
    }),

    putPriceMode: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/price-mode/${id}/information`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["Price Mode Setup"],
    }),

    patchPriceModeStatus: builder.mutation({
      query: (id) => ({
        url: `/price-mode/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Price Mode Setup"],
    }),
  }),
});

export const {
  usePostPriceModeMutation,
  useGetAllPriceModeQuery,
  usePutPriceModeMutation,
  usePatchPriceModeStatusMutation,
} = priceModeSetupApi;
