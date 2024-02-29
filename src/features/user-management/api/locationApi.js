import { api } from "../../api";

const locationApi = api
  .enhanceEndpoints({ addTagTypes: ["Location"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      postLocation: builder.mutation({
        query: (body) => ({
          url: "/Location/AddNewLocation",
          method: "POST",
          body: body,
        }),
        invalidatesTags: ["Location"],
      }),
      getAllLocations: builder.query({
        query: (params) => ({
          params: params,
          url: "/Location/GetAllLocations",
          method: "GET",
        }),
        providesTags: ["Location"],
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
      }),
      putLocation: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `/Location/UpdateLocation/${id}`,
          method: "PUT",
          body: body,
        }),
        invalidatesTags: ["Location"],
      }),
      patchLocationStatus: builder.mutation({
        query: (id) => ({
          url: `/Location/UpdateLocationStatus/${id}`,
          method: "PATCH",
        }),
        invalidatesTags: ["Location"],
      }),
    }),
  });

export const {
  usePostLocationMutation,
  useGetAllLocationsQuery,
  usePutLocationMutation,
  usePatchLocationStatusMutation,
} = locationApi;
