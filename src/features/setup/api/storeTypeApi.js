import { api } from "../../api";

const storeTypeApi = api
  .enhanceEndpoints({ addTagTypes: ["Store Type"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      postStoreType: builder.mutation({
        query: (body) => ({
          url: "/StoreType/AddNewStoreType",
          method: "POST",
          body: body,
        }),
        invalidatesTags: ["Store Type"],
      }),
      getAllStoreTypes: builder.query({
        query: (params) => ({
          params: params,
          url: "/StoreType/GetAllStoreTypes",
          method: "GET",
        }),
        providesTags: ["Store Type"],
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
      }),
      putStoreType: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `/StoreType/UpdateStoreType/${id}`,
          method: "PUT",
          body: body,
        }),
        invalidatesTags: ["Store Type"],
      }),
      patchStoreTypeStatus: builder.mutation({
        query: (id) => ({
          url: `/StoreType/UpdateStoreTypeStatus/${id}`,
          method: "PATCH",
        }),
        invalidatesTags: ["Store Type"],
      }),
    }),
  });

export const {
  usePostStoreTypeMutation,
  useGetAllStoreTypesQuery,
  usePutStoreTypeMutation,
  usePatchStoreTypeStatusMutation,
} = storeTypeApi;
