import { api } from "../../api";

const otherExpensesRegApi = api
  .enhanceEndpoints({ addTagTypes: ["Expenses"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      postExpenses: builder.mutation({
        query: (body) => ({
          body: body,
          url: "/Expenses/AddNewExpenses",
          method: "POST",
        }),
        invalidatesTags: ["Expenses"],
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
      }),

      getAllExpenses: builder.query({
        query: (params) => ({
          params: params,
          url: "/Expenses/GetAllExpenses",
          method: "GET",
        }),
        providesTags: ["Expenses"],
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
      }),

      putApproveExpenses: builder.mutation({
        query: ({ id }) => ({
          url: `/Expenses/ApproveExpense/${id}`,
          method: "PUT",
        }),
        invalidatesTags: ["Expenses"],
      }),

      // putRejectExpenses: builder.mutation({
      //   query: ({ id, ...body }) => ({
      //     url: `/Expenses/RejectExpenses/${id}`,
      //     method: "PUT",
      //     body: body,
      //   }),
      //   invalidatesTags: ["Expenses"],
      // }),

      putRejectExpenses: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `/Expenses/RejectExpenseRequest/${id}`,
          method: "PUT",
          body: body,
          // params: { id },
        }),
        invalidatesTags: ["Expenses"],
      }),

      putUpdateExpenses: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `/Expenses/UpdateExpensesInformation/${id}`,
          method: "PUT",
          body: body,
        }),
        invalidatesTags: ["Expenses"],
      }),

      patchVoidExpenseRequest: builder.mutation({
        query: (id) => ({
          url: `/Expenses/VoidExpenseRequest/${id}`,
          method: "PATCH",
        }),
        invalidatesTags: ["Expenses"],
      }),

      getExpensesApprovalHistoryById: builder.query({
        query: ({ id }) => ({
          url: `/other-expenses/${id}/approval-history`,
          method: "GET",
        }),
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
      }),
    }),
  });

export const {
  useGetAllExpensesQuery,
  usePostExpensesMutation,
  usePutApproveExpensesMutation,
  usePutRejectExpensesMutation,
  usePutUpdateExpensesMutation,
  usePatchVoidExpenseRequestMutation,

  //Approval History
  useLazyGetExpensesApprovalHistoryByIdQuery,
} = otherExpensesRegApi;
