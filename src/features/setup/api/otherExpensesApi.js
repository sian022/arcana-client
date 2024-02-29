import { api } from "../../api";

const otherExpensesApi = api
  .enhanceEndpoints({ addTagTypes: ["Other Expenses"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      postOtherExpenses: builder.mutation({
        query: (body) => ({
          url: "/OtherExpenses/AddNewExpense",
          method: "POST",
          body: body,
        }),
        invalidatesTags: ["Other Expenses"],
      }),

      getAllOtherExpenses: builder.query({
        query: (params) => ({
          params: params,
          url: "/OtherExpenses/GetAllOtherExpenses",
          method: "GET",
        }),
        providesTags: ["Other Expenses"],
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
      }),

      putOtherExpenses: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `/OtherExpenses/UpdateOtherExpenses/${id}`,
          method: "PUT",
          body: body,
        }),
        invalidatesTags: ["Other Expenses"],
      }),

      patchOtherExpensesStatus: builder.mutation({
        query: (id) => ({
          url: `/OtherExpenses/UpdateOtherExpensesStatus/${id}`,
          method: "PATCH",
        }),
        invalidatesTags: ["Other Expenses"],
      }),
    }),
  });

export const {
  usePostOtherExpensesMutation,
  useGetAllOtherExpensesQuery,
  usePutOtherExpensesMutation,
  usePatchOtherExpensesStatusMutation,
} = otherExpensesApi;
