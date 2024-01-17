import React, { useEffect, useState } from "react";
import AddArchiveSearchMixin from "../../../components/mixins/AddArchiveSearchMixin";
import useDisclosure from "../../../hooks/useDisclosure";
import {
  Autocomplete,
  Box,
  InputAdornment,
  TextField,
  Typography,
  createFilterOptions,
} from "@mui/material";
import CommonTable from "../../../components/CommonTable";
import CommonDrawer from "../../../components/CommonDrawer";
import {
  prospectSchema,
  prospectWithLocationsSchema,
} from "../../../schema/schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
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
import CommonDialog from "../../../components/CommonDialog";
import SuccessSnackbar from "../../../components/SuccessSnackbar";
import ErrorSnackbar from "../../../components/ErrorSnackbar";
import {
  debounce,
  handlePhoneNumberInput,
} from "../../../utils/CustomFunctions";
import FreebieForm from "./FreebieForm";
import { setSelectedRow } from "../../../features/misc/reducers/selectedRowSlice";
import SecondaryButton from "../../../components/SecondaryButton";
import AccentButton from "../../../components/AccentButton";
import SuccessButton from "../../../components/SuccessButton";
import { notificationApi } from "../../../features/notification/api/notificationApi";
import { PatternFormat } from "react-number-format";

function ForFreebies() {
  const [drawerMode, setDrawerMode] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);
  const [newProspectName, setNewProspectName] = useState("");
  const [editMode, setEditMode] = useState(false);

  const dispatch = useDispatch();
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
    isOpen: isCancelConfirmOpen,
    onOpen: onCancelConfirmOpen,
    onClose: onCancelConfirmClose,
  } = useDisclosure();

  const {
    isOpen: isFreebieConfirmOpen,
    onOpen: onFreebieConfirmOpen,
    onClose: onFreebieConfirmClose,
  } = useDisclosure();

  // Constants;
  // const excludeKeys = [];

  const excludeKeysDisplay = [
    "id",
    "createdAt",
    "isActive",
    "origin",
    "addedBy",
    "status",
    "freebies",
    "ownersAddress",
    "registrationStatus",
  ];

  const tableHeads = [
    "Owner's Name",
    "Mobile Number",
    "Email Address",
    "Business Name",
    "Business Type",
  ];

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
    resolver: yupResolver(prospectSchema.schema),
    // resolver: yupResolver(prospectWithLocationsSchema.schema),
    mode: "onSubmit",
    defaultValues: prospectSchema.defaultValues,
    // defaultValues: prospectWithLocationsSchema.defaultValues,
  });

  //RTK Query
  const [postProspect, { isLoading: isAddLoading }] = usePostProspectMutation();
  const { data, isLoading, isFetching } = useGetAllApprovedProspectsQuery({
    Search: search,
    Status: status,
    PageNumber: page + 1,
    PageSize: rowsPerPage,
    StoreType: selectedStoreType !== "Main" ? selectedStoreType : "",
  });
  const [putProspect, { isLoading: isEditLoading }] = usePutProspectMutation();
  const [patchProspectStatus, { isLoading: isArchiveLoading }] =
    usePatchProspectStatusMutation();

  const { data: storeTypeData } = useGetAllStoreTypesQuery({ Status: true });

  // const { data: provinceData, isFetching: isProvinceFetching } =
  //   useGetAllProvincesQuery();
  // const { data: cityData, isFetching: isCityFetching } = useGetAllCitiesQuery();
  // const { data: barangayData, isFetching: isBarangayFetching } =
  //   useGetAllBarangaysQuery();

  //Drawer Handlers
  const onDrawerSubmit = async (data) => {
    try {
      const {
        storeTypeId: { id },
        ...restData
      } = data;

      let response;

      if (drawerMode === "add") {
        response = await postProspect({
          ...restData,
          storeTypeId: id,
        }).unwrap();
        setSnackbarMessage("Prospect added successfully");
      } else if (drawerMode === "edit") {
        response = await putProspect({
          ...restData,
          storeTypeId: id,
        }).unwrap();
        setSnackbarMessage("Prospect updated successfully");
      }

      dispatch(setSelectedRow(response?.value));
      onConfirmClose();
      handleDrawerClose();

      if (drawerMode === "add") {
        setNewProspectName(watch("businessName"));
        debounce(onFreebieConfirmOpen(), 2000);
      }

      reset();
      onSuccessOpen();
      dispatch(notificationApi.util.invalidateTags(["Notification"]));
    } catch (error) {
      if (error?.data?.error?.message) {
        setSnackbarMessage(error?.data?.error?.message);
      } else {
        setSnackbarMessage(
          `Error ${drawerMode === "add" ? "adding" : "updating"} prospect`
        );
      }

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
      dispatch(notificationApi.util.invalidateTags(["Notification"]));
    } catch (error) {
      if (error?.data?.error?.message) {
        setSnackbarMessage(error?.data?.error?.message);
      } else {
        setSnackbarMessage("Error archiving prospect");
      }

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
    setValue("emailAddress", editData.emailAddress);
    setValue("houseNumber", editData.ownersAddress.houseNumber);
    setValue("streetName", editData.ownersAddress.streetName);
    setValue("barangayName", editData.ownersAddress.barangayName);
    setValue("city", editData.ownersAddress.city);
    setValue("province", editData.ownersAddress.province);
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
    onCancelConfirmClose();
  };

  const handleFreebieFormYes = () => {
    onFreebieFormOpen();
    onFreebieConfirmClose();
  };

  // const cityFilterOptions = createFilterOptions({
  //   matchFrom: "any",
  //   limit: 50,
  // });

  //useEffects
  useEffect(() => {
    setCount(data?.totalCount);
    // dispatch(setBadge({ ...badges, forFreebies: data?.totalCount }));
  }, [data]);

  useEffect(() => {
    if (isDrawerOpen && selectedStoreType !== "Main") {
      setValue(
        "storeTypeId",
        storeTypeData?.storeTypes?.find(
          (store) => store.storeTypeName === selectedStoreType
        )
      );
    }
  }, [isDrawerOpen]);

  return (
    <>
      <Box>
        <AddArchiveSearchMixin
          addTitle="Prospect"
          onAddOpen={handleAddOpen}
          setStatus={setStatus}
          setSearch={setSearch}
        />
        {isFetching ? (
          <CommonTableSkeleton compact />
        ) : (
          <CommonTable
            mapData={data?.requestedProspect}
            // excludeKeys={excludeKeys}
            excludeKeysDisplay={excludeKeysDisplay}
            tableHeads={tableHeads}
            // editable
            archivable
            // onEdit={handleEditOpen}
            onView={handleEditOpen}
            onArchive={handleArchiveOpen}
            onFreebie={onFreebieFormOpen}
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
        drawerHeader={drawerMode == "add" ? "Add Prospect" : "View Prospect"}
        open={isDrawerOpen}
        onClose={isDirty ? onCancelConfirmOpen : handleDrawerClose}
        width="1000px"
        disableSubmit={!isValid}
        onSubmit={
          // handleSubmit(onDrawerSubmit)
          onConfirmOpen
        }
        removeButtons
        responsiveBreakpoint="999px"
      >
        <Box className="register">
          <Box className="register__secondRow">
            <Box className="register__secondRow">
              <Typography className="register__title">Name</Typography>
              <Box className="register__secondRow">
                <Box className="register__secondRow__content">
                  <Controller
                    name="ownersName"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
                        disabled={!editMode && drawerMode === "edit"}
                        sx={{ gridColumn: "span 3" }}
                        label="Owner's Name"
                        size="small"
                        autoComplete="off"
                        required
                        helperText={errors?.ownersName?.message}
                        error={errors?.ownersName}
                      />
                    )}
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

              <Controller
                control={control}
                name={"phoneNumber"}
                render={({ field: { onChange, onBlur, value, ref } }) => {
                  const formattedValue = value.replace(/-/g, "");
                  let format = "###-###-####";

                  if (formattedValue.length <= 3) {
                    format = "####";
                  } else if (formattedValue.length <= 6) {
                    format = "###-####";
                  } else if (formattedValue.length <= 10) {
                    format = "###-###-####";
                  }

                  return (
                    <PatternFormat
                      format={format}
                      label="Phone Number"
                      type="text"
                      size="small"
                      customInput={TextField}
                      autoComplete="off"
                      allowNegative={false}
                      decimalScale={0}
                      onValueChange={(e) => {
                        onChange(e.value);
                      }}
                      onBlur={onBlur}
                      value={value || ""}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">+63</InputAdornment>
                        ),
                      }}
                      inputRef={ref}
                      className="register__textField"
                      helperText={errors?.phoneNumber?.message}
                      error={!!errors?.phoneNumber}
                      disabled={!editMode && drawerMode === "edit"}
                    />
                  );
                }}
              />
            </Box>
            <Box className="register__thirdRow__column">
              <Typography className="register__title">Email Address</Typography>
              <TextField
                disabled={!editMode && drawerMode === "edit"}
                label="Email Address"
                size="small"
                type="email"
                autoComplete="off"
                // required
                {...register("emailAddress")}
                helperText={errors?.emailAddress?.message}
                error={errors?.emailAddress}
              />
            </Box>
          </Box>
          <Box className="register__secondRow">
            <Typography className="register__title">Address</Typography>
            <Box className="register__secondRow__content">
              <Controller
                name="houseNumber"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.value.toUpperCase())
                    }
                    disabled={!editMode && drawerMode === "edit"}
                    label="Unit No."
                    size="small"
                    autoComplete="off"
                    // required
                    helperText={errors?.houseNumber?.message}
                    error={errors?.houseNumber}
                  />
                )}
              />

              <Controller
                name="streetName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.value.toUpperCase())
                    }
                    disabled={!editMode && drawerMode === "edit"}
                    label="Street"
                    size="small"
                    autoComplete="off"
                    // required
                    helperText={errors?.streetName?.message}
                    error={errors?.streetName}
                  />
                )}
              />

              {/* <ControlledAutocomplete
                disabled={
                  (!editMode && drawerMode === "edit") || !watch("city")
                }
                name={"barangayName"}
                control={control}
                options={
                  barangayData?.filter(
                    (barangay) =>
                      barangay?.city_code === watch("barangayName")?.id
                  ) || []
                }
                getOptionLabel={(option) => option.name}
                disableClearable
                isOptionEqualToValue={(option, value) => option.id === value.id}
                loading={isBarangayFetching}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    label="Barangay"
                    required
                    helperText={errors?.city?.message}
                    error={errors?.city}
                  />
                )}
              /> */}
              <Controller
                name="barangayName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.value.toUpperCase())
                    }
                    disabled={!editMode && drawerMode === "edit"}
                    label="Barangay"
                    size="small"
                    autoComplete="off"
                    required
                    helperText={errors?.barangayName?.message}
                    error={errors?.barangayName}
                  />
                )}
              />
            </Box>
            <Box className="register__secondRow__content">
              {/* <ControlledAutocomplete
                disabled={
                  (!editMode && drawerMode === "edit") || !watch("province")
                }
                name={"city"}
                control={control}
                options={
                  cityData?.filter(
                    (city) => city?.province_code === watch("province")?.id
                  ) || []
                }
                getOptionLabel={(option) => option.name}
                disableClearable
                isOptionEqualToValue={(option, value) => option.id === value.id}
                loading={isCityFetching}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    label="Municipality/City"
                    required
                    helperText={errors?.city?.message}
                    error={errors?.city}
                  />
                )}
              /> */}

              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.value.toUpperCase())
                    }
                    disabled={!editMode && drawerMode === "edit"}
                    label="Municipality/City"
                    size="small"
                    autoComplete="off"
                    required
                    helperText={errors?.city?.message}
                    error={errors?.city}
                  />
                )}
              />

              {/* <ControlledAutocomplete
                disabled={!editMode && drawerMode === "edit"}
                name={"province"}
                control={control}
                options={provinceData || []}
                getOptionLabel={(option) => option.name}
                disableClearable
                // value={storeTypeData?.storeTypes?.find(
                //   (store) => store.storeTypeName === selectedStoreType
                // )}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                loading={isProvinceFetching}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    label="Province"
                    required
                    helperText={errors?.province?.message}
                    error={errors?.province}
                  />
                )}
              /> */}

              <Controller
                name="province"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.value.toUpperCase())
                    }
                    disabled={!editMode && drawerMode === "edit"}
                    label="Province"
                    size="small"
                    autoComplete="off"
                    required
                    helperText={errors?.province?.message}
                    error={errors?.province}
                  />
                )}
              />
            </Box>
          </Box>

          <Box className="register__secondRow">
            <Typography className="register__title">
              Business Details
            </Typography>
            <Box className="register__secondRow__content">
              <Controller
                name="businessName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.value.toUpperCase())
                    }
                    disabled={!editMode && drawerMode === "edit"}
                    label="Business Name"
                    size="small"
                    autoComplete="off"
                    required
                    helperText={errors?.businessName?.message}
                    error={errors?.businessName}
                  />
                )}
              />

              {selectedStoreType === "Main" ? (
                <ControlledAutocomplete
                  disabled={!editMode && drawerMode === "edit"}
                  name={"storeTypeId"}
                  control={control}
                  options={storeTypeData?.storeTypes || []}
                  getOptionLabel={(option) =>
                    option.storeTypeName.toUpperCase()
                  }
                  disableClearable
                  // value={storeTypeData?.storeTypes?.find(
                  //   (store) => store.storeTypeName === selectedStoreType
                  // )}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      label="Business Type"
                      required
                      helperText={errors?.storeTypeId?.message}
                      error={errors?.storeTypeId}
                    />
                  )}
                />
              ) : (
                <Autocomplete
                  options={storeTypeData?.storeTypes}
                  getOptionLabel={(option) => option.storeTypeName}
                  disableClearable
                  value={storeTypeData?.storeTypes?.find(
                    (store) => store.storeTypeName === selectedStoreType
                  )}
                  disabled
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      label="Business Type"
                      required
                      helperText={errors?.storeTypeId?.message}
                      error={errors?.storeTypeId}
                    />
                  )}
                />
              )}
            </Box>
          </Box>
        </Box>
        <Box className="commonDrawer__actions">
          {drawerMode !== "edit" || editMode ? (
            <SuccessButton onClick={onConfirmOpen} disabled={!isValid}>
              Submit
            </SuccessButton>
          ) : null}
          {drawerMode === "edit" && (
            <AccentButton
              sx={{ color: "white !important" }}
              onClick={() => {
                setEditMode(!editMode);
              }}
            >
              Edit
            </AccentButton>
          )}
        </Box>
      </CommonDrawer>

      <FreebieForm
        isFreebieFormOpen={isFreebieFormOpen}
        onFreebieFormClose={onFreebieFormClose}
      />

      <CommonDialog
        open={isArchiveOpen}
        onClose={onArchiveClose}
        onYes={onArchiveSubmit}
        isLoading={isArchiveLoading}
      >
        Are you sure you want to set prospect{" "}
        <span style={{ fontWeight: "bold" }}>
          {selectedRowData?.businessName}
        </span>{" "}
        as {status ? "inactive" : "active"}?
      </CommonDialog>

      <CommonDialog
        open={isConfirmOpen}
        onClose={onConfirmClose}
        onYes={handleSubmit(onDrawerSubmit)}
        isLoading={drawerMode === "add" ? isAddLoading : isEditLoading}
        noIcon
      >
        Are you sure you want to {drawerMode == "add" ? "add" : "update"}{" "}
        prospect{" "}
        <span style={{ fontWeight: "bold" }}>{watch("businessName")}</span>?
      </CommonDialog>

      <CommonDialog
        open={isCancelConfirmOpen}
        onClose={onCancelConfirmClose}
        onYes={handleDrawerClose}
      >
        Are you sure you want to cancel{" "}
        {drawerMode === "add" ? "adding" : "viewing"} prospect
        {watch("businessName") ? (
          <>
            {" "}
            <span style={{ fontWeight: "bold" }}>{watch("businessName")}</span>
          </>
        ) : (
          ""
        )}
        ?
      </CommonDialog>

      <CommonDialog
        open={isFreebieConfirmOpen}
        onClose={onFreebieConfirmClose}
        onYes={handleFreebieFormYes}
        noIcon
      >
        Continue to add freebie for{" "}
        <span style={{ fontWeight: "bold", textTransform: "uppercase" }}>
          {selectedRowData?.businessName || "new prospect"}
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

export default ForFreebies;
