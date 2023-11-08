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

    getAllListingFee: builder.query({
      query: (params) => ({
        params: params,
        url: "/ListingFee/GetAllListingFee",
        method: "GET",
      }),
      providesTags: ["Listing Fee"],
      transformResponse: (response) => response.data,
      transformErrorResponse: (response) => response.data,
    }),

    putApproveListingFee: builder.mutation({
      query: ({ id }) => ({
        url: `/ListingFee/ApproveListingFee/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["Listing Fee"],
    }),

    putRejectListingFee: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/ListingFee/RejectListingFee/${id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["Listing Fee"],
    }),

    putUpdateListingFee: builder.mutation({
      query: ({ id, params, ...body }) => ({
        url: `/ListingFee/UpdateListingFeeItems/${id}`,
        method: "PUT",
        body: body,
        params: params,
      }),
      invalidatesTags: ["Listing Fee"],
    }),
  }),
});

export const {
  usePostListingFeeMutation,
  useGetAllListingFeeQuery,
  usePutApproveListingFeeMutation,
  usePutRejectListingFeeMutation,
  usePutUpdateListingFeeMutation,
} = listingFeeApi;
