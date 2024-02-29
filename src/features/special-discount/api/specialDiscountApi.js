import { api } from "../../api";

const specialDiscountApi = api
  .enhanceEndpoints({
    addTagTypes: ["Special Discount", "ApprovalHistoryById"],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      //Main CRUD
      createSpecialDiscount: builder.mutation({
        query: (body) => ({
          url: "/special-discount",
          method: "POST",
          body: body,
        }),
        invalidatesTags: ["Special Discount"],
        transformResponse: (response) => response.value,
      }),

      getAllSpecialDiscount: builder.query({
        query: (params) => ({
          params: params,
          url: "/special-discount",
          method: "GET",
        }),
        providesTags: ["Special Discount"],
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
      }),

      updateSpecialDiscount: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `/special-discount/${id}`,
          method: "PUT",
          body: body,
        }),
        invalidatesTags: ["Special Discount"],
        transformResponse: (response) => response.value,
      }),

      voidSpecialDiscount: builder.mutation({
        query: ({ id }) => ({
          url: `/special-discount/void/${id}`,
          method: "PUT",
        }),
        invalidatesTags: ["Special Discount"],
      }),

      cancelSpecialDiscount: builder.mutation({
        query: ({ id }) => ({
          url: `/special-discount/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Special Discount"],
      }),

      //Approvals
      approveSpecialDiscount: builder.mutation({
        query: ({ id }) => ({
          url: `/special-discount/approve/${id}`,
          method: "PUT",
        }),
        invalidatesTags: ["Special Discount"],
      }),

      rejectSpecialDiscount: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `/special-discount/reject/${id}`,
          method: "PUT",
          body: body,
        }),
        invalidatesTags: ["Special Discount"],
      }),

      //Others
      getSpecialDiscountApprovalHistoryById: builder.query({
        query: ({ id }) => ({
          url: `/special-discount/approval-history/${id}`,
          method: "GET",
        }),
        providesTags: ["ApprovalHistoryById"],
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
      }),
    }),
  });

export const {
  useCreateSpecialDiscountMutation,
  useGetAllSpecialDiscountQuery,
  useUpdateSpecialDiscountMutation,
  useVoidSpecialDiscountMutation,
  useCancelSpecialDiscountMutation,
  useLazyGetSpecialDiscountApprovalHistoryByIdQuery,
  useApproveSpecialDiscountMutation,
  useRejectSpecialDiscountMutation,
} = specialDiscountApi;
