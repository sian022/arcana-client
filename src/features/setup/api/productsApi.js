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
    getAllProducts: builder.query({
      query: (params) => ({
        params: params,
        url: "/Items/GetAllItems",
        method: "GET",
      }),
      providesTags: ["Products"],
      transformResponse: (response) => response.data,
      transformErrorResponse: (response) => response.data,
    }),
  }),
});

export const { useGetAllProductsQuery } = productsApi;
