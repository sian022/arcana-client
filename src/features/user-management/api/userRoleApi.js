import { api } from "../../api";

const userRoleApi = api
  .enhanceEndpoints({ addTagTypes: ["User Role"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      postUserRole: builder.mutation({
        query: (body) => ({
          url: "/UserRole/AddNewUserRole",
          method: "POST",
          body: body,
        }),
        invalidatesTags: ["User Role"],
      }),
      getAllUserRoles: builder.query({
        query: (params) => ({
          params: params,
          url: "/UserRole/GetUserRoles",
          method: "GET",
        }),
        providesTags: ["User Role"],
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
      }),
      putUserRole: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `/UserRole/UpdateUserRole/${id}`,
          method: "PUT",
          body: body,
        }),
        invalidatesTags: ["User Role"],
      }),
      patchUserRoleStatus: builder.mutation({
        query: (id) => ({
          url: `/UserRole/UpdateUserRoleStatus/${id}`,
          method: "PATCH",
        }),
        invalidatesTags: ["User Role"],
      }),
      putTagUserRole: builder.mutation({
        query: ({ id, permissions }) => ({
          url: `/UserRole/UntagAndTagUserRole/${id}`,
          method: "PUT",
          body: { permissions },
        }),
        invalidatesTags: ["User Role"],
      }),
    }),
  });

export const {
  usePostUserRoleMutation,
  useGetAllUserRolesQuery,
  usePutUserRoleMutation,
  usePatchUserRoleStatusMutation,
  usePutTagUserRoleMutation,
} = userRoleApi;
