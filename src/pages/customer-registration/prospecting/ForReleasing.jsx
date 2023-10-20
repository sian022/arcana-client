import React, { useEffect, useState } from "react";
import AddArchiveSearchMixin from "../../../components/mixins/AddArchiveSearchMixin";
import useDisclosure from "../../../hooks/useDisclosure";
import { Box, TextField } from "@mui/material";
import CommonTable from "../../../components/CommonTable";
import CommonDrawer from "../../../components/CommonDrawer";
import { prospectSchema } from "../../../schema/schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import ControlledAutocomplete from "../../../components/ControlledAutocomplete";
import { useGetAllStoreTypesQuery } from "../../../features/setup/api/storeTypeApi";
import {
  useGetAllApprovedProspectsQuery,
  usePatchProspectStatusMutation,
  usePostProspectMutation,
  usePutProspectMutation,
} from "../../../features/prospect/api/prospectApi";
import CommonTableSkeleton from "../../../components/CommonTableSkeleton";
import { useDispatch, useSelector } from "react-redux";
import { setBadge } from "../../../features/prospect/reducers/badgeSlice";
import CommonDialog from "../../../components/CommonDialog";
import SuccessSnackbar from "../../../components/SuccessSnackbar";
import ErrorSnackbar from "../../../components/ErrorSnackbar";
import { debounce } from "../../../utils/CustomFunctions";
import FreebieForm from "./FreebieForm";

function ForReleasing() {
  const [drawerMode, setDrawerMode] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);
  const [newProspectName, setNewProspectName] = useState("");

  const dispatch = useDispatch();
  const badges = useSelector((state) => state.badge.value);
  const selectedRowData = useSelector((state) => state.selectedRow.value);
  const selectedStoreType = useSelector(
    (state) => state.selectedStoreType.value
  );

  //Disclosures
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();

  const {
    isOpen: isFreebieFormOpen,
    onOpen: onFreebieFormOpen,
    onClose: onFreebieFormClose,
  } = useDisclosure();

  const {
    isOpen: isArchiveOpen,
    onOpen: onArchiveOpen,
    onClose: onArchiveClose,
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

  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onClose: onConfirmClose,
  } = useDisclosure();

  const {
    isOpen: isFreebieConfirmOpen,
    onOpen: onFreebieConfirmOpen,
    onClose: onFreebieConfirmClose,
  } = useDisclosure();

  //Constants
  const excludeKeys = [
    "createdAt",
    "isActive",
    "origin",
    "addedBy",
    "status",
    "freebies",
  ];

  //React Hook Form
  const {
    handleSubmit,
    formState: { errors, isValid },
    register,
    setValue,
    reset,
    control,
    watch,
  } = useForm({
    resolver: yupResolver(prospectSchema.schema),
    mode: "onChange",
    defaultValues: prospectSchema.defaultValues,
  });

  //RTK Query
  const [postProspect] = usePostProspectMutation();
  const { data, isLoading } = useGetAllApprovedProspectsQuery({
    Search: search,
    Status: status,
    PageNumber: page + 1,
    PageSize: rowsPerPage,
    StoreType: selectedStoreType !== "Main" ? selectedStoreType : "",
    WithFreebies: true,
  });
  const [putProspect] = usePutProspectMutation();
  const [patchProspectStatus] = usePatchProspectStatusMutation();

  const { data: storeTypeData } = useGetAllStoreTypesQuery();

  //Drawer Handlers
  const onDrawerSubmit = async (data) => {
    try {
      const {
        storeTypeId: { id },
        ...restData
      } = data;

      if (drawerMode === "add") {
        await postProspect({
          ...restData,
          storeTypeId: id,
        }).unwrap();
        setSnackbarMessage("Prospect added successfully");
      } else if (drawerMode === "edit") {
        await putProspect({
          ...restData,
          storeTypeId: id,
        }).unwrap();
        setSnackbarMessage("Prospect updated successfully");
      }

      onConfirmClose();
      handleDrawerClose();

      if (drawerMode === "add") {
        setNewProspectName(watch("businessName"));
        debounce(onFreebieConfirmOpen(), 2000);
      }

      reset();
      onSuccessOpen();
    } catch (error) {
      setSnackbarMessage(error.data.messages[0]);
      onErrorOpen();
    }
  };

  const onArchiveSubmit = async () => {
    try {
      await patchProspectStatus(selectedId).unwrap();
      onArchiveClose();
      setSnackbarMessage(
        `Prospect ${status ? "archived" : "restored"} successfully`
      );
      onSuccessOpen();
    } catch (error) {
      setSnackbarMessage(error.data.messages[0]);
      onErrorOpen();
    }
  };

  const handleAddOpen = () => {
    setDrawerMode("add");
    onDrawerOpen();
  };

  const handleEditOpen = (editData) => {
    setDrawerMode("edit");
    onDrawerOpen();

    setValue("id", editData.id);
    setValue("ownersName", editData.ownersName);
    setValue("ownersAddress", editData.address);
    setValue("phoneNumber", editData.phoneNumber);
    setValue("businessName", editData.businessName);
    setValue(
      "storeTypeId",
      storeTypeData?.storeTypes.find(
        (item) => item.storeType === editData.storeTypeName
      )
    );
  };

  const handleArchiveOpen = (id) => {
    onArchiveOpen();
    setSelectedId(id);
  };

  const handleDrawerClose = () => {
    reset();
    onDrawerClose();
    setSelectedId("");
  };

  const handleFreebieFormYes = () => {
    onFreebieFormOpen();
    onFreebieConfirmClose();
  };

  //useEffects
  useEffect(() => {
    setCount(data?.totalCount);
    dispatch(setBadge({ ...badges, forReleasing: data?.totalCount }));
  }, [data]);

  return (
    <>
      <Box>
        <AddArchiveSearchMixin
          addTitle="Prospect"
          onAddOpen={handleAddOpen}
          setStatus={setStatus}
          setSearch={setSearch}
        />
        {isLoading ? (
          <CommonTableSkeleton />
        ) : (
          <CommonTable
            mapData={data?.requestedProspect}
            excludeKeys={excludeKeys}
            editable
            archivable
            onEdit={handleEditOpen}
            onArchive={handleArchiveOpen}
            onFreebie={onFreebieFormOpen}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            count={count}
            status={status}
          />
        )}
      </Box>

      <CommonDrawer
        drawerHeader={drawerMode == "add" ? "Add Prospect" : "Edit Prospect"}
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        width="1000px"
        disableSubmit={!isValid}
        onSubmit={
          // handleSubmit(onDrawerSubmit)
          onConfirmOpen
        }
      >
        <TextField
          label="Owner's Name"
          size="small"
          autoComplete="off"
          required
          {...register("ownersName")}
          helperText={errors?.ownersName?.message}
          error={errors?.ownersName}
        />
        <TextField
          label="Owner's Address"
          size="small"
          autoComplete="off"
          required
          {...register("ownersAddress")}
          helperText={errors?.ownersAddress?.message}
          error={errors?.ownersAddress}
        />
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            gap: "20px",
          }}
        >
          <TextField
            label="Phone Number"
            size="small"
            autoComplete="off"
            required
            {...register("phoneNumber")}
            helperText={errors?.phoneNumber?.message}
            error={errors?.phoneNumber}
            sx={{ flex: 1 }}
          />
          <TextField
            label="Business Name"
            size="small"
            autoComplete="off"
            required
            {...register("businessName")}
            helperText={errors?.businessName?.message}
            error={errors?.businessName}
            sx={{ flex: 1 }}
          />
        </Box>
        <ControlledAutocomplete
          name={"storeTypeId"}
          control={control}
          options={storeTypeData?.storeTypes}
          getOptionLabel={(option) => option.storeTypeName}
          disableClearable
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              label="Store Type"
              required
              helperText={errors?.storeTypeId?.message}
              error={errors?.storeTypeId}
            />
          )}
        />
      </CommonDrawer>

      {/* Freebie Form */}
      {/* <CommonDrawer
        drawerHeader={"Request Freebies"}
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        width="1000px"
        disableSubmit={!isValid}
        onSubmit={
          // handleSubmit(onDrawerSubmit)
          onConfirmOpen
        }
      >
        <TextField
          label="Owner's Name"
          size="small"
          autoComplete="off"
          required
          {...register("ownersName")}
          helperText={errors?.ownersName?.message}
          error={errors?.ownersName}
        />
        <TextField
          label="Owner's Address"
          size="small"
          autoComplete="off"
          required
          {...register("ownersAddress")}
          helperText={errors?.ownersAddress?.message}
          error={errors?.ownersAddress}
        />
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            gap: "20px",
          }}
        >
          <TextField
            label="Phone Number"
            size="small"
            autoComplete="off"
            required
            {...register("phoneNumber")}
            helperText={errors?.phoneNumber?.message}
            error={errors?.phoneNumber}
            sx={{ flex: 1 }}
          />
          <TextField
            label="Business Name"
            size="small"
            autoComplete="off"
            required
            {...register("businessName")}
            helperText={errors?.businessName?.message}
            error={errors?.businessName}
            sx={{ flex: 1 }}
          />
        </Box>
        <ControlledAutocomplete
          name={"storeTypeId"}
          control={control}
          options={storeTypeData?.storeTypes}
          getOptionLabel={(option) => option.storeTypeName}
          disableClearable
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              label="Store Type"
              required
              helperText={errors?.storeTypeId?.message}
              error={errors?.storeTypeId}
            />
          )}
        />
      </CommonDrawer> */}
      <FreebieForm
        isFreebieFormOpen={isFreebieFormOpen}
        onFreebieFormClose={onFreebieFormClose}
      />

      <CommonDialog
        open={isArchiveOpen}
        onClose={onArchiveClose}
        onYes={onArchiveSubmit}
      >
        Are you sure you want to set prospect {selectedRowData.ownersName} as{" "}
        {status ? "inactive" : "active"}?
      </CommonDialog>

      <CommonDialog
        open={isConfirmOpen}
        onClose={onConfirmClose}
        onYes={handleSubmit(onDrawerSubmit)}
      >
        Are you sure you want to {drawerMode == "add" ? "add" : "update"}{" "}
        prospect {watch("businessName")}?
      </CommonDialog>

      <CommonDialog
        open={isFreebieConfirmOpen}
        onClose={onFreebieConfirmClose}
        onYes={handleFreebieFormYes}
      >
        Continue to add freebie for {newProspectName || "new prospect"}?
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

export default ForReleasing;