import { api } from "../../api";

const approverApi = api
  .enhanceEndpoints({ addTagTypes: ["Approver"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getAllApprovers: builder.query({
        query: () => ({
          url: "/Approvers/GetAllApprovers",
          method: "GET",
        }),
        providesTags: ["Approver"],
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
      }),

      addApproversPerModule: builder.mutation({
        query: (body) => ({
          url: "/Approvers/AssignApprover",
          method: "POST",
          body,
        }),
        invalidatesTags: ["Approver"],
      }),

      getApproversPerModule: builder.query({
        query: () => ({
          url: "/Approver/GetApproversPerModules",
          method: "GET",
        }),
        providesTags: ["Approver"],
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
      }),

      getApproversByModule: builder.query({
        query: (params) => ({
          url: "/Approver/GetApproverByModule",
          method: "GET",
          params,
        }),
        providesTags: ["Approver"],
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
      }),

      putUpdateApproversPerModule: builder.mutation({
        query: ({ moduleName, ...body }) => ({
          url: `/Approver/UpdateApproversPerModule`,
          method: "PUT",
          params: { moduleName },
          body,
        }),
        invalidatesTags: ["Approver"],
      }),
    }),
  });

export const {
  useGetAllApproversQuery,
  useAddApproversPerModuleMutation,
  useGetApproversPerModuleQuery,
  usePutUpdateApproversPerModuleMutation,
  useGetApproversByModuleQuery,
} = approverApi;
