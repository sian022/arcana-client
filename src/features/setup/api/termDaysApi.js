import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { decryptString } from "../../../utils/CustomFunctions";

export const termDaysApi = createApi({
  reducerPath: "termDaysApi",
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
  tagTypes: ["Term Days"],
  endpoints: (builder) => ({
    postTermDays: builder.mutation({
      query: (body) => ({
        url: "/TermDays/AddNewTermDays",
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["Term Days"],
    }),
    getAllTermDays: builder.query({
      query: (params) => ({
        params: params,
        url: "/TermDays/GetTermDays",
        method: "GET",
      }),
      providesTags: ["Term Days"],
      transformResponse: (response) => response.value,
      transformErrorResponse: (response) => response.value,
    }),
    putTermDays: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/TermDays/UpdateTermDays/${id}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["Term Days"],
    }),
    patchTermDaysStatus: builder.mutation({
      query: (id) => ({
        url: `/TermDays/UpdateTermDaysStatus/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Term Days"],
    }),
  }),
});

export const {
  usePostTermDaysMutation,
  useGetAllTermDaysQuery,
  usePutTermDaysMutation,
  usePatchTermDaysStatusMutation,
} = termDaysApi;
