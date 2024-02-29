import { api } from "../../api";

const discountTypeApi = api
  .enhanceEndpoints({ addTagTypes: ["DIscount Type"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      postDiscountType: builder.mutation({
        query: (body) => ({
          url: "/VariableDiscount/AddNewVariableDiscount",
          method: "POST",
          body: body,
        }),
        invalidatesTags: ["Discount Type"],
      }),
      getAllDiscountTypes: builder.query({
        query: (params) => ({
          params: params,
          url: "/VariableDiscount/GetVariableDiscount",
          method: "GET",
        }),
        providesTags: ["Discount Type"],
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
      }),
      putDiscountType: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `/VariableDiscount/UpdateVariableDiscount/${id}`,
          method: "PUT",
          body: body,
        }),
        invalidatesTags: ["Discount Type"],
      }),
      patchDiscountTypeStatus: builder.mutation({
        query: (id) => ({
          url: `/VariableDiscount/UpdateVariableDiscountStatus/${id}`,
          method: "PATCH",
        }),
        invalidatesTags: ["Discount Type"],
      }),

      deleteVariableDiscount: builder.mutation({
        query: (id) => ({
          url: `/VariableDiscount/DeleteVariableDiscount/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Discount Type"],
      }),
    }),
  });

export const {
  usePostDiscountTypeMutation,
  useGetAllDiscountTypesQuery,
  usePutDiscountTypeMutation,
  usePatchDiscountTypeStatusMutation,
  useDeleteVariableDiscountMutation,
} = discountTypeApi;
