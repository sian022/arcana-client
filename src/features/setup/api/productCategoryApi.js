import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { decryptString } from "../../../utils/CustomFunctions";

export const productCategoryApi = createApi({
  reducerPath: "productCategoryApi",
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
  tagTypes: ["Product Category"],
  endpoints: (builder) => ({
    postProductCategory: builder.mutation({
      query: (body) => ({
        url: "/ProductCategory/AddNewProductCategory",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Product Category"],
    }),
    getAllProductCategory: builder.query({
      query: (params) => ({
        params: params,
        url: "/ProductCategory/GetProductCategory",
        method: "GET",
      }),
      providesTags: ["Product Category"],
      transformResponse: (response) => response.data,
      transformErrorResponse: (response) => response.data,
    }),
    putProductCategory: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/ProductCategory/UpdateProductCategory/${id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["Product Category"],
    }),
    patchProductCategoryStatus: builder.mutation({
      query: (id) => ({
        url: `/ProductCategory/UpdateProductCategoryStatus/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Product Category"],
    }),
  }),
});

export const {
  useGetAllProductCategoryQuery,
  usePostProductCategoryMutation,
  usePutProductCategoryMutation,
  usePatchProductCategoryStatusMutation,
} = productCategoryApi;
