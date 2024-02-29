import { api } from "../../api";

const departmentApi = api
  .enhanceEndpoints({ addTagTypes: ["Department"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      postDepartment: builder.mutation({
        query: (body) => ({
          url: "/Department/AddNewDepartment",
          method: "POST",
          body: body,
        }),
        invalidatesTags: ["Department"],
      }),
      getAllDepartments: builder.query({
        query: (params) => ({
          params: params,
          url: "/Department/GetAllDepartment",
          method: "GET",
        }),
        providesTags: ["Department"],
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
      }),
      putDepartment: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `/Department/UpdateDepartment/${id}`,
          method: "PUT",
          body: body,
        }),
        invalidatesTags: ["Department"],
      }),
      patchDepartmentStatus: builder.mutation({
        query: (id) => ({
          url: `/Department/UpdateDepartmentStatus/${id}`,
          method: "PATCH",
        }),
        invalidatesTags: ["Department"],
      }),
    }),
  });

export const {
  usePostDepartmentMutation,
  useGetAllDepartmentsQuery,
  usePutDepartmentMutation,
  usePatchDepartmentStatusMutation,
} = departmentApi;
