import { api } from "../../api";

const userAccountApi = api
  .enhanceEndpoints({ addTagTypes: ["User", "Cluster"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      postUser: builder.mutation({
        query: (body) => ({
          url: "/User/AddNewUser",
          method: "POST",
          body: body,
        }),
        invalidatesTags: ["User", "Cluster"],
      }),
      getAllUsers: builder.query({
        query: (params) => ({
          params: params,
          url: "/User/GetUser",
          method: "GET",
        }),
        providesTags: ["User"],
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
      }),
      putUser: builder.mutation({
        query: ({ id, password, ...body }) => ({
          url: `/User/UpdateUser/${id}`,
          method: "PUT",
          body: body,
        }),
        invalidatesTags: ["User", "Cluster"],
      }),
      patchUserStatus: builder.mutation({
        query: (id) => ({
          url: `/User/UpdateUserStatus/${id}`,
          method: "PATCH",
        }),
        invalidatesTags: ["User"],
      }),

      patchChangePassword: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `/User/ChangeUserPassword/${id}`,
          method: "PATCH",
          body: body,
        }),
        // invalidatesTags: ["User"],
      }),

      patchResetPassword: builder.mutation({
        query: (id) => ({
          url: `/User/ResetPassword/${id}`,
          method: "PATCH",
        }),
        // invalidatesTags: ["User"],
      }),
    }),
  });

export const {
  usePostUserMutation,
  useGetAllUsersQuery,
  usePutUserMutation,
  usePatchUserStatusMutation,
  usePatchChangePasswordMutation,
  usePatchResetPasswordMutation,
} = userAccountApi;
