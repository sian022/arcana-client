import { api } from "../../api";

const termDaysApi = api
  .enhanceEndpoints({ addTagTypes: ["Term Days"] })
  .injectEndpoints({
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
