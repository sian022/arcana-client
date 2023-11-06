import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { decryptString } from "../../../utils/CustomFunctions";

export const listingFeeApi = createApi({
  reducerPath: "listingFeeApi",
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
  tagTypes: ["Listing Fee"],
  endpoints: (builder) => ({
    postListingFee: builder.mutation({
      query: (body) => ({
        body: body,
        url: "/ListingFee/AddNewListingFee",
        method: "POST",
      }),
      invalidatesTags: ["Listing Fee"],
      transformResponse: (response) => response.data,
      transformErrorResponse: (response) => response.data,
    }),

    // getAllClients: builder.query({
    //   query: (params) => ({
    //     params: params,
    //     url: "/Clients/GetAllClients",
    //     method: "GET",
    //   }),
    //   providesTags: ["Listing Fee"],
    //   transformResponse: (response) => response.data,
    //   transformErrorResponse: (response) => response.data,
    // }),
  }),
});

export const { usePostListingFeeMutation } = listingFeeApi;
