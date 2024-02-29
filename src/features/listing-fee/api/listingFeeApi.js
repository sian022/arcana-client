import { api } from "../../api";

const listingFeeApi = api
  .enhanceEndpoints({
    addTagTypes: ["Listing Fee", "Clients For Listing", "Notification"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      postListingFee: builder.mutation({
        query: (body) => ({
          body: body,
          url: "/ListingFee/AddNewListingFee",
          method: "POST",
        }),
        invalidatesTags: ["Listing Fee", "Notification"],
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => ({
          function: "postListingFee",
          ...response.value,
        }),
      }),

      getAllListingFee: builder.query({
        query: (params) => ({
          params: params,
          url: "/ListingFee/GetAllListingFee",
          method: "GET",
        }),
        providesTags: ["Listing Fee"],
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
      }),

      putApproveListingFee: builder.mutation({
        query: ({ id }) => ({
          url: `/ListingFee/ApproveListingFee/${id}`,
          method: "PUT",
        }),
        invalidatesTags: ["Listing Fee", "Notification"],
      }),

      putRejectListingFee: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `/ListingFee/RejectListingFee/${id}`,
          method: "PUT",
          body: body,
        }),
        invalidatesTags: ["Listing Fee", "Notification"],
      }),

      putUpdateListingFee: builder.mutation({
        query: ({ id, params, ...body }) => ({
          url: `/ListingFee/UpdateListingFeeItems/${id}`,
          method: "PUT",
          body: body,
          params: params,
        }),
        invalidatesTags: ["Listing Fee", "Clients For Listing", "Notification"],
      }),

      deleteCancelListingFee: builder.mutation({
        query: (id) => ({
          url: `/ListingFee/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Listing Fee", "Clients For Listing", "Notification"],
      }),

      getListingFeeApprovalHistoriesById: builder.query({
        query: ({ id }) => ({
          url: `/listing-fee/${id}/approval-history`,
          method: "GET",
        }),
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
      }),
    }),
  });

export const {
  usePostListingFeeMutation,
  useGetAllListingFeeQuery,
  usePutApproveListingFeeMutation,
  usePutRejectListingFeeMutation,
  usePutUpdateListingFeeMutation,
  useDeleteCancelListingFeeMutation,

  //Approval History
  useLazyGetListingFeeApprovalHistoriesByIdQuery,
} = listingFeeApi;
