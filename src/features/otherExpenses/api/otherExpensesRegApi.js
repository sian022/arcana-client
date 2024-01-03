import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { decryptString } from "../../../utils/CustomFunctions";

export const otherExpensesRegApi = createApi({
  reducerPath: "otherExpensesRegApi",
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
  tagTypes: ["Expenses"],
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
      query: (id) => ({
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
        url: `/Expenses/RejectExpenseRequest`,
        method: "PUT",
        body: body,
        params: { id },
      }),
      invalidatesTags: ["Expenses"],
    }),

    putUpdateExpenses: builder.mutation({
      query: ({ id, params, ...body }) => ({
        url: `/Expenses/UpdateExpenses/${id}`,
        method: "PUT",
        body: body,
        params: params,
      }),
      invalidatesTags: ["Expenses"],
    }),
  }),
});

export const {
  useGetAllExpensesQuery,
  usePostExpensesMutation,
  usePutApproveExpensesMutation,
  usePutRejectExpensesMutation,
  usePutUpdateExpensesMutation,
} = otherExpensesRegApi;
