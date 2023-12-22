import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { decryptString } from "../../../utils/CustomFunctions";

export const otherExpensesApi = createApi({
  reducerPath: "otherExpensesApi",
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
  tagTypes: ["Other Expenses"],
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
