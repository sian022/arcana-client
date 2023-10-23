import React, { useEffect, useState } from "react";
import AddArchiveSearchMixin from "../../../components/mixins/AddArchiveSearchMixin";
import useDisclosure from "../../../hooks/useDisclosure";
import { Box, TextField, Typography } from "@mui/material";
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
import CommonModal from "../../../components/CommonModal";
import ReleaseFreebieModal from "../../../components/modals/ReleaseFreebieModal";

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

  const {
    isOpen: isFreebieReleaseOpen,
    onOpen: onFreebieReleaseOpen,
    onClose: onFreebieReleaseClose,
  } = useDisclosure();

  //Constants
  // const excludeKeys = [
  //
  //   "freebies",
  // ];

  const excludeKeysDisplay = [
    "id",
    "createdAt",
    "isActive",
    "origin",
    "addedBy",
    "status",
    "freebies",
    "ownersAddress",
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
  const [postProspect, { isLoading: isAddLoading }] = usePostProspectMutation();
  const { data, isLoading } = useGetAllApprovedProspectsQuery({
    Search: search,
    Status: status,
    PageNumber: page + 1,
    PageSize: rowsPerPage,
    StoreType: selectedStoreType !== "Main" ? selectedStoreType : "",
    FreebieStatus: "For Releasing",
  });
  const [putProspect, { isLoading: isEditLoading }] = usePutProspectMutation();
  const [patchProspectStatus, { isLoading: isArchiveLoading }] =
    usePatchProspectStatusMutation();

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
          <CommonTableSkeleton compact />
        ) : (
          <CommonTable
            mapData={data?.requestedProspect}
            // excludeKeys={excludeKeys}
            excludeKeysDisplay={excludeKeysDisplay}
            editable
            archivable
            onEdit={handleEditOpen}
            onArchive={handleArchiveOpen}
            // onFreebie={onFreebieFormOpen}
            onReleaseFreebie={onFreebieReleaseOpen}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            count={count}
            status={status}
            compact
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
        <Box className="register">
          <Box className="register__secondRow">
            <Box className="register__secondRow">
              <Typography className="register__title">Name</Typography>
              <Box className="register__secondRow">
                <Box className="register__secondRow__content">
                  <TextField
                    sx={{ gridColumn: "span 3" }}
                    label="Owners Name"
                    size="small"
                    autoComplete="off"
                    required
                    {...register("ownersName")}
                    helperText={errors?.ownersName?.message}
                    error={errors?.ownersName}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
          <Box className="register__thirdRow">
            <Box className="register__thirdRow__column">
              <Typography className="register__title">
                Contact Number
              </Typography>
              <TextField
                label="Phone Number"
                size="small"
                autoComplete="off"
                required
                {...register("phoneNumber")}
                helperText={errors?.phoneNumber?.message}
                error={errors?.phoneNumber}
              />
            </Box>
            <Box className="register__thirdRow__column">
              <Typography className="register__title">Email Address</Typography>
              <TextField
                label="Email Address"
                size="small"
                autoComplete="off"
                required
                {...register("emailAddress")}
                helperText={errors?.emailAddress?.message}
                error={errors?.emailAddress}
              />
            </Box>
          </Box>
          <Box className="register__secondRow">
            <Typography className="register__title">Address</Typography>
            <Box className="register__secondRow__content">
              <TextField
                label="Unit No."
                size="small"
                autoComplete="off"
                required
                {...register("houseNumber")}
                helperText={errors?.houseNumber?.message}
                error={errors?.houseNumber}
              />
              <TextField
                label="Street"
                size="small"
                autoComplete="off"
                required
                {...register("streetName")}
                helperText={errors?.streetName?.message}
                error={errors?.streetName}
              />
              <TextField
                label="Barangay"
                size="small"
                autoComplete="off"
                required
                {...register("barangayName")}
                helperText={errors?.barangayName?.message}
                error={errors?.barangayName}
              />
            </Box>
            <Box className="register__secondRow__content">
              <TextField
                label="Municipality/City"
                size="small"
                autoComplete="off"
                required
                {...register("city")}
                helperText={errors?.city?.message}
                error={errors?.city}
              />
              <TextField
                label="Province"
                size="small"
                autoComplete="off"
                required
                {...register("province")}
                helperText={errors?.province?.message}
                error={errors?.province}
              />
            </Box>
          </Box>

          <Box className="register__secondRow">
            <Typography className="register__title">
              Business Details
            </Typography>
            <Box className="register__secondRow__content">
              <TextField
                label="Business Name"
                size="small"
                autoComplete="off"
                required
                {...register("businessName")}
                helperText={errors?.businessName?.message}
                error={errors?.businessName}
              />
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
            </Box>
          </Box>
        </Box>
      </CommonDrawer>

      <FreebieForm
        isFreebieFormOpen={isFreebieFormOpen}
        onFreebieFormClose={onFreebieFormClose}
        onClose={onFreebieFormClose}
      />

      <ReleaseFreebieModal
        open={isFreebieReleaseOpen}
        onClose={onFreebieReleaseClose}
      />

      <CommonDialog
        open={isArchiveOpen}
        onClose={onArchiveClose}
        onYes={onArchiveSubmit}
        isLoading={isArchiveLoading}
      >
        Are you sure you want to set prospect {selectedRowData.ownersName} as{" "}
        {status ? "inactive" : "active"}?
      </CommonDialog>

      <CommonDialog
        open={isConfirmOpen}
        onClose={onConfirmClose}
        onYes={handleSubmit(onDrawerSubmit)}
        isLoading={drawerMode === "add" ? isAddLoading : isEditLoading}
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
