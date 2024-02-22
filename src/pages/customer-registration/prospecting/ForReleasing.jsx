import { useEffect, useState } from "react";
import useDisclosure from "../../../hooks/useDisclosure";
import {
  Autocomplete,
  Box,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import CommonTable from "../../../components/CommonTable";
import CommonDrawer from "../../../components/CommonDrawer";
import { prospectSchema } from "../../../schema/schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import ControlledAutocomplete from "../../../components/ControlledAutocomplete";
import { useGetAllStoreTypesQuery } from "../../../features/setup/api/storeTypeApi";
import {
  useGetAllApprovedProspectsQuery,
  usePostProspectMutation,
  usePutProspectMutation,
} from "../../../features/prospect/api/prospectApi";
import CommonTableSkeleton from "../../../components/CommonTableSkeleton";
import { useDispatch, useSelector } from "react-redux";
import CommonDialog from "../../../components/CommonDialog";
import SuccessSnackbar from "../../../components/SuccessSnackbar";
import ErrorSnackbar from "../../../components/ErrorSnackbar";
import { debounce } from "../../../utils/CustomFunctions";
import FreebieForm from "./FreebieForm";
import ReleaseFreebieModal from "../../../components/modals/ReleaseFreebieModal";
import AddSearchMixin from "../../../components/mixins/AddSearchMixin";
import CancelFreebiesModal from "../../../components/modals/CancelFreebiesModal";
import TertiaryButton from "../../../components/TertiaryButton";
import SuccessButton from "../../../components/SuccessButton";
import { notificationApi } from "../../../features/notification/api/notificationApi";
import { PatternFormat } from "react-number-format";
import { setSelectedRow } from "../../../features/misc/reducers/selectedRowSlice";
import DangerButton from "../../../components/DangerButton";

function ForReleasing() {
  const [drawerMode, setDrawerMode] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);
  const [newProspectName, setNewProspectName] = useState("");
  const [editMode, setEditMode] = useState(false);

  const dispatch = useDispatch();
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

  const {
    isOpen: isFreebieReleaseOpen,
    onOpen: onFreebieReleaseOpen,
    onClose: onFreebieReleaseClose,
  } = useDisclosure();

  const {
    isOpen: isFreebieCancelOpen,
    onOpen: onFreebieCancelOpen,
    onClose: onFreebieCancelClose,
  } = useDisclosure();

  //Constants

  const tableHeads = [
    "Business Name",
    "Owner's Name",
    "Business Type",
    "Contact Number",
  ];

  const customOrderKeys = [
    "businessName",
    "ownersName",
    "storeType",
    "phoneNumber",
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
    clearErrors,
  } = useForm({
    resolver: yupResolver(prospectSchema.schema),
    mode: "onSubmit",
    defaultValues: prospectSchema.defaultValues,
  });

  //RTK Query
  const [postProspect, { isLoading: isAddLoading }] = usePostProspectMutation();
  const { data, isFetching } = useGetAllApprovedProspectsQuery({
    Search: search,
    PageNumber: page + 1,
    PageSize: rowsPerPage,
    StoreType: selectedStoreType !== "Main" ? selectedStoreType : "",
    FreebieStatus: "For Releasing",
  });
  const [putProspect, { isLoading: isEditLoading }] = usePutProspectMutation();

  const { data: storeTypeData } = useGetAllStoreTypesQuery();

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

    onConfirmClose();
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

  const handleDrawerClose = () => {
    reset();
    clearErrors();
    onDrawerClose();
    onCancelConfirmClose();
  };

  const handleFreebieFormYes = () => {
    onFreebieFormOpen();
    onFreebieConfirmClose();
  };

  //useEffects
  useEffect(() => {
    setCount(data?.totalCount);
  }, [data]);

  return (
    <>
      <Box>
        <AddSearchMixin
          addTitle="Prospect"
          onAddOpen={handleAddOpen}
          setSearch={setSearch}
        />
        {/* <AddArchiveSearchMixin
          addTitle="Prospect"
          onAddOpen={handleAddOpen}
          setStatus={setStatus}
          setSearch={setSearch}
        /> */}
        {isFetching ? (
          <CommonTableSkeleton compact />
        ) : (
          <CommonTable
            mapData={data?.requestedProspect}
            tableHeads={tableHeads}
            customOrderKeys={customOrderKeys}
            onView={handleEditOpen}
            onCancelFreebies={onFreebieCancelOpen}
            onUpdateFreebies={onFreebieFormOpen}
            onReleaseFreebie={onFreebieReleaseOpen}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            count={count}
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
                        sx={{ gridColumn: "span 2" }}
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
                      onValueChange={(e) => {
                        onChange(e.value);
                      }}
                      onBlur={onBlur}
                      value={value || ""}
                      inputRef={ref}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">+63</InputAdornment>
                        ),
                      }}
                      className="register__textField"
                      helperText={errors?.phoneNumber?.message}
                      error={!!errors?.phoneNumber}
                      disabled={!editMode && drawerMode === "edit"}
                    />
                  );
                }}
              />
              {/* <TextField
                disabled={!editMode && drawerMode === "edit"}
                label="Phone Number"
                size="small"
                autoComplete="off"
                required
                type="number"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">+63</InputAdornment>
                  ),
                  onInput: handlePhoneNumberInput,
                }}
                {...register("phoneNumber")}
                helperText={errors?.phoneNumber?.message}
                error={errors?.phoneNumber}
              /> */}
            </Box>
            <Box className="register__thirdRow__column">
              <Typography className="register__title">Email Address</Typography>
              <TextField
                disabled={!editMode && drawerMode === "edit"}
                label="Email Address"
                size="small"
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
          <DangerButton
            onClick={isDirty ? onCancelConfirmOpen : handleDrawerClose}
          >
            Close
          </DangerButton>

          {drawerMode === "edit" && (
            <TertiaryButton
              sx={{ color: "white !important" }}
              onClick={() => {
                setEditMode(!editMode);
              }}
            >
              Edit
            </TertiaryButton>
          )}

          <SuccessButton
            onClick={onConfirmOpen}
            disabled={!isValid || (drawerMode === "edit" && !editMode)}
          >
            Submit
          </SuccessButton>
        </Box>
      </CommonDrawer>

      <FreebieForm
        updateFreebies
        isFreebieFormOpen={isFreebieFormOpen}
        onFreebieFormClose={onFreebieFormClose}
        onClose={onFreebieFormClose}
      />

      <ReleaseFreebieModal
        open={isFreebieReleaseOpen}
        // open={true}
        onClose={onFreebieReleaseClose}
      />

      <CancelFreebiesModal
        open={isFreebieCancelOpen}
        onClose={onFreebieCancelClose}
      />

      <CommonDialog
        open={isConfirmOpen}
        onClose={onConfirmClose}
        onYes={handleSubmit(onDrawerSubmit)}
        isLoading={drawerMode === "add" ? isAddLoading : isEditLoading}
        question
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
        question
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
