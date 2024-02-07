import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { decryptString } from "../../../utils/CustomFunctions";

export const productsApi = createApi({
  reducerPath: "productsApi",
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
  tagTypes: ["Products"],
  endpoints: (builder) => ({
    postProduct: builder.mutation({
      query: (body) => ({
        url: "/Items/AddNewItem",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Products"],
    }),
    getAllProducts: builder.query({
      query: (params) => ({
        params: params,
        url: "/Items/GetAllItems",
        method: "GET",
      }),
      providesTags: ["Products"],
      transformResponse: (response) => response.value,
      transformErrorResponse: (response) => response.value,
    }),
    putProduct: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/Items/UpdateItem/${id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["Products"],
    }),
    patchProductStatus: builder.mutation({
      query: (id) => ({
        url: `/Items/UpdateItemStatus/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Products"],
    }),
  }),
});

export const {
  usePostProductMutation,
  useGetAllProductsQuery,
  useLazyGetAllProductsQuery,
  usePutProductMutation,
  usePatchProductStatusMutation,
} = productsApi;
