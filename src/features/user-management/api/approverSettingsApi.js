import { api } from "../../api";

const approverSettingsApi = api
  .enhanceEndpoints({ addTagTypes: ["Approver Settings"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      addApproversByRange: builder.mutation({
        query: (body) => ({
          url: "/Approvers/AssignApproverWithRange",
          method: "POST",
          body,
        }),
        invalidatesTags: ["Approver Settings"],
      }),

      getApproversByRange: builder.query({
        query: (params) => ({
          url: "/Approver/GetApproverByModule",
          method: "GET",
          params,
        }),
        providesTags: ["Approver Settings"],
        transformResponse: (response) => response.value,
        transformErrorResponse: (response) => response.value,
      }),

      putUpdateApproversByRange: builder.mutation({
        query: ({ moduleName, ...body }) => ({
          url: `/Approver/UpdateApproversPerModule`,
          method: "PUT",
          params: { moduleName },
          body,
        }),
        invalidatesTags: ["Approver Settings"],
      }),
    }),
  });

export const {
  useAddApproversByRangeMutation,
  useGetApproversByRangeQuery,
  usePutUpdateApproversByRangeMutation,
} = approverSettingsApi;
