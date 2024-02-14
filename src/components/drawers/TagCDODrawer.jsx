import React, { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { TextField } from "@mui/material";
import CommonDrawer from "../CommonDrawer";
import { useDispatch, useSelector } from "react-redux";
import ErrorSnackbar from "../ErrorSnackbar";
import useDisclosure from "../../hooks/useDisclosure";
import SuccessSnackbar from "../SuccessSnackbar";
import CommonDialog from "../CommonDialog";
import { clusterTagSchema } from "../../schema/schema";
import useSnackbar from "../../hooks/useSnackbar";
import ControlledAutocomplete from "../ControlledAutocomplete";
import { useGetAllUsersQuery } from "../../features/user-management/api/userAccountApi";
import { usePostTagUserInClusterMutation } from "../../features/setup/api/clusterApi";

function TagCDODrawer({ editMode, open, onClose }) {
  const { showSnackbar } = useSnackbar();

  const [snackbarMessage, setSnackbarMessage] = useState("");

  //Redux States
  const selectedRowData = useSelector((state) => state.selectedRow.value);

  //Disclosures
  const {
    isOpen: isConfirmSubmitOpen,
    onOpen: onConfirmSubmitOpen,
    onClose: onConfirmSubmitClose,
  } = useDisclosure();

  const {
    isOpen: isSuccessOpen,
    onOpen: onSuccessOpen,
    onClose: onSuccessClose,
  } = useDisclosure();

  const {
    isOpen: isErrorOpen,
    onOpen: onErrorOpen,
    onClose: onErrorClose,
  } = useDisclosure();

  //React Hook Form
  const {
    handleSubmit,
    formState: { errors, isValid, isDirty },
    register,
    setValue,
    reset,
    control,
    watch,
    getValues,
  } = useForm({
    resolver: yupResolver(clusterTagSchema.schema),
    mode: "onChange",
    defaultValues: clusterTagSchema.defaultValues,
  });

  //RTK Query
  const { data: cdoData, isFetching } = useGetAllUsersQuery({
    Status: true,
    Role: "CDO",
  });

  const [postTagUserInCluster, { isLoading: isTagLoading }] =
    usePostTagUserInClusterMutation();

  //Drawer Functions
  const onTagSubmit = async (data) => {
    const { clusterId, userId } = data;

    try {
      await postTagUserInCluster({
        clusters: [{ clusterId, userId: userId.id }],
      }).unwrap();
      setSnackbarMessage("CDO tagged successfully");
      onClose();
      onConfirmSubmitClose();
      reset();
      onSuccessOpen();
    } catch (error) {
      console.log(error);
      if (error?.data?.error?.message) {
        setSnackbarMessage(error?.data?.error?.message);
      } else {
        setSnackbarMessage(`Error tagging CDO`);
      }

      onErrorOpen();
    }
  };

  const handleDrawerClose = () => {
    onClose();
    reset();
  };

  //Misc Functions

  useEffect(() => {
    if (open) {
      setValue("clusterId", selectedRowData?.id);
    }
  }, [open]);

  return (
    <>
      <CommonDrawer
        drawerHeader={"Tag CDO"}
        open={open}
        onClose={handleDrawerClose}
        disableSubmit={!isValid}
        onSubmit={onConfirmSubmitOpen}
        // zIndex={editMode && 1300}
      >
        <TextField
          label="Cluster"
          size="small"
          disabled
          value={selectedRowData?.cluster}
        />

        <ControlledAutocomplete
          name={`userId`}
          control={control}
          options={cdoData?.users || []}
          getOptionLabel={(option) => option.fullname}
          disableClearable
          loading={isFetching}
          isOptionEqualToValue={(option, value) => true}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              label="CDO"
              required
              helperText={errors?.userId?.message}
              error={errors?.userId}
              // sx={{ width: "300px" }}
            />
          )}
          onChange={(_, value) => {
            if (watch("clientId") && watch("listingItems")[0]?.itemId) {
              onClientConfirmationOpen();
              setConfirmationValue(value);
              return watch("clientId");
            } else {
              return value;
            }
          }}
        />
      </CommonDrawer>

      <CommonDialog
        open={isConfirmSubmitOpen}
        onClose={onConfirmSubmitClose}
        onYes={handleSubmit(onTagSubmit)}
        isLoading={isTagLoading}
        question
      >
        Confirm tagging of CDO for{" "}
        <span style={{ textTransform: "uppercase", fontWeight: "bold" }}>
          {selectedRowData?.cluster || "item"}
        </span>
        ?
      </CommonDialog>

      <SuccessSnackbar
        open={isSuccessOpen}
        onClose={onSuccessClose}
        message={snackbarMessage}
      />

      <ErrorSnackbar
        open={isErrorOpen}
        onClose={onErrorClose}
        message={snackbarMessage}
      />
    </>
  );
}

export default TagCDODrawer;
