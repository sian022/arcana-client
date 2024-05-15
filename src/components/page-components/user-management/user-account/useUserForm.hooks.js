import { useEffect } from "react";
import { handleCatchErrorMessage } from "../../../../utils/CustomFunctions";
import { yupResolver } from "@hookform/resolvers/yup";
import { userAccountSchema } from "../../../../schema/schema";
import { useForm } from "react-hook-form";
import {
  usePostUserMutation,
  usePutUserMutation,
} from "../../../../features/user-management/api/userAccountApi";
import useSnackbar from "../../../../hooks/useSnackbar";

const useUserForm = ({
  editMode,
  selectedRowData,
  userRoleData,
  clusterData,
  onClose,
  open,
}) => {
  const snackbar = useSnackbar();

  const {
    // React Hook Form: Form and Field State
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    reset,
    control,
  } = useForm({
    resolver: yupResolver(userAccountSchema.schema),
    mode: "onChange",
    defaultValues: userAccountSchema.defaultValues,
  });

  const watchUserRole = watch("userRoleId");

  // RTK Query: User Operations
  const [postUser, { isLoading: isAddUserLoading }] = usePostUserMutation();
  const [putUser, { isLoading: isEditUserLoading }] = usePutUserMutation();

  const onSubmit = async (data) => {
    const {
      userRoleId: { id },
      clusterId,
      ...restData
    } = data;

    try {
      if (!editMode) {
        await postUser({
          ...restData,
          userRoleId: id,
          clusterId: clusterId?.id,
        }).unwrap();

        snackbar({
          message: "User Account added successfully",
          variant: "success",
        });
      } else if (editMode) {
        await putUser({
          ...restData,
          userRoleId: id,
          clusterId: clusterId?.id,
        }).unwrap();
        snackbar({
          message: "User Account updated successfully",
          variant: "success",
        });
      }

      onClose();
      reset();
    } catch (error) {
      snackbar({ message: handleCatchErrorMessage(error), variant: "error" });
    }
  };

  useEffect(() => {
    if (editMode) {
      setValue("id", selectedRowData?.id);
      setValue("fullIdNo", selectedRowData?.fullIdNo);
      setValue("fullname", selectedRowData?.fullname);
      setValue("username", selectedRowData?.username);
      setValue(
        "userRoleId",
        userRoleData?.userRoles?.find(
          (item) => item.roleName === selectedRowData?.roleName
        )
      );
      setValue(
        "clusterId",
        clusterData?.cluster?.find(
          (item) => item.cluster === selectedRowData?.cluster
        )
      );
      setValue("mobileNumber", selectedRowData?.mobileNumber);
    }
  }, [editMode, selectedRowData, setValue, userRoleData, clusterData]);

  useEffect(() => {
    if (watchUserRole?.roleName !== "CDO") {
      setValue("clusterId", null);
    }
  }, [watchUserRole, setValue]);

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  return {
    handleSubmit,
    control,
    errors,
    isValid,
    watchUserRole,
    onSubmit,
    setValue,
    watch,
    isAddUserLoading,
    isEditUserLoading,
  };
};

export default useUserForm;
