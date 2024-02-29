import { api } from "../../api";

const meatTypeApi = api
  .enhanceEndpoints({ addTagTypes: ["Meat Type"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      postMeatType: builder.mutation({
        query: (body) => ({
          url: "/MeatType/AddNewMeatType",
          method: "POST",
          body: body,
        }),
        invalidatesTags: ["Meat Type"],
      }),
      getAllMeatTypes: builder.query({
        query: (params) => ({
          params: params,
          url: "/MeatType/GetMeatType",
          method: "GET",
        }),
        providesTags: ["Meat Type"],
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
      }),
      putMeatType: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `/MeatType/UpdateMeatType/${id}`,
          method: "PUT",
          body: body,
        }),
        invalidatesTags: ["Meat Type"],
      }),
      patchMeatTypeStatus: builder.mutation({
        query: (id) => ({
          url: `/MeatType/UpdateMeatTypeStatus/${id}`,
          method: "PATCH",
        }),
        invalidatesTags: ["Meat Type"],
      }),
    }),
  });

export const {
  useGetAllMeatTypesQuery,
  usePostMeatTypeMutation,
  usePutMeatTypeMutation,
  usePatchMeatTypeStatusMutation,
} = meatTypeApi;
