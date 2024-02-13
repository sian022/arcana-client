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
        params: params,
        url: "/clients/pos",
        method: "GET",
      }),
      providesTags: ["Clients"],
      transformResponse: (response) => response.value,
      transformErrorResponse: (response) => response.value,
    }),
  }),
});

export const { useGetAllClientsForPOSQuery } = salesTransactionApi;
