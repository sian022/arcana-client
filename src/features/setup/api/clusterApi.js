import { api } from "../../api";

const clusterApi = api
  .enhanceEndpoints({ addTagTypes: ["Cluster"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      postCluster: builder.mutation({
        query: (body) => ({
          url: "/Cluster/AddNewCluster",
          method: "POST",
          body: body,
        }),
        invalidatesTags: ["Cluster"],
      }),

      getAllClusters: builder.query({
        query: (params) => ({
          params: params,
          url: "/Cluster/GetAllCluster",
          method: "GET",
        }),
        providesTags: ["Cluster"],
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
      }),

      putCluster: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `/Cluster/UpdateCluster/${id}`,
          method: "PUT",
          body: body,
        }),
        invalidatesTags: ["Cluster"],
      }),

      patchClusterStatus: builder.mutation({
        query: (id) => ({
          url: `/Cluster/UpdateClusterStatus/${id}`,
          method: "PATCH",
        }),
        invalidatesTags: ["Cluster"],
      }),

      postTagUserInCluster: builder.mutation({
        query: (body) => ({
          url: "/Cluster/TagUserInCluster",
          method: "POST",
          body: body,
        }),
        invalidatesTags: ["Cluster"],
      }),

      deleteUntagUserInCluster: builder.mutation({
        query: ({ id, ...params }) => ({
          url: `/Cluster/UntagUserInCluster/${id}`,
          method: "DELETE",
          params: params,
        }),
        invalidatesTags: ["Cluster"],
      }),
    }),
  });

export const {
  usePostClusterMutation,
  useGetAllClustersQuery,
  usePutClusterMutation,
  usePatchClusterStatusMutation,
  usePostTagUserInClusterMutation,
  useDeleteUntagUserInClusterMutation,
} = clusterApi;
