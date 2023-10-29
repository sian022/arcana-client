import React, { useContext, useEffect, useState } from "react";
import CommonDrawer from "../../../components/CommonDrawer";
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import "../../../assets/styles/drawerForms.styles.scss";
import SecondaryButton from "../../../components/SecondaryButton";
import { Check, Close, PushPin } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { directRegisterPersonalSchema } from "../../../schema/schema";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useDisclosure from "../../../hooks/useDisclosure";
import CommonDialog from "../../../components/CommonDialog";
import {
  usePutAddAttachmentsMutation,
  usePutAddTermsAndCondtionsMutation,
  usePutRegisterClientMutation,
} from "../../../features/registration/api/registrationApi";
import useSnackbar from "../../../hooks/useSnackbar";
import PinLocationModal from "../../../components/modals/PinLocationModal";
import TermsAndConditions from "../prospecting/TermsAndConditions";
import Attachments from "../prospecting/Attachments";
import { AttachmentsContext } from "../../../context/AttachmentsContext";
import { resetTermsAndConditions } from "../../../features/registration/reducers/regularRegistrationSlice";
import {
  base64ToBlob,
  convertToTitleCase,
} from "../../../utils/CustomFunctions";
import { prospectApi } from "../../../features/prospect/api/prospectApi";
import ControlledAutocomplete from "../../../components/ControlledAutocomplete";
import { useGetAllStoreTypesQuery } from "../../../features/setup/api/storeTypeApi";
import DangerButton from "../../../components/DangerButton";
import ListingFeeModal from "../../../components/modals/ListingFeeModal";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";

function DirectRegisterForm({ open, onClose }) {
  const dispatch = useDispatch();
  const {
    setOwnersRequirements,
    setRepresentativeRequirements,
    setRequirementsMode,
    convertSignatureToBase64,
  } = useContext(AttachmentsContext);

  const { showSnackbar } = useSnackbar();

  const [latitude, setLatitude] = useState(15.0944152);
  const [longitude, setLongitude] = useState(120.6075827);
  const [activeTab, setActiveTab] = useState("Personal Info");
  const [sameAsOwnersAddress, setSameAsOwnersAddress] = useState(false);

  const { ownersRequirements, representativeRequirements, requirementsMode } =
    useContext(AttachmentsContext);

  const selectedRowData = useSelector((state) => state.selectedRow.value);
  const termsAndConditions = useSelector(
    (state) => state.regularRegistration.value.termsAndConditions
  );

  //Disclosures
  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onClose: onConfirmClose,
  } = useDisclosure();

  const {
    isOpen: isPinLocationOpen,
    onOpen: onPinLocationOpen,
    onClose: onPinLocationClose,
  } = useDisclosure();

  const {
    isOpen: isCancelConfirmOpen,
    onOpen: onCancelConfirmOpen,
    onClose: onCancelConfirmClose,
  } = useDisclosure();

  const {
    isOpen: isRedirectListingFeeOpen,
    onOpen: onRedirectListingFeeOpen,
    onClose: onRedirectListingFeeClose,
  } = useDisclosure();

  const {
    isOpen: isListingFeeOpen,
    onOpen: onListingFeeOpen,
    onClose: onListingFeeClose,
  } = useDisclosure();

  // React Hook Form
  const {
    handleSubmit,
    formState: { errors, isValid },
    register,
    setValue,
    reset,
    getValues,
    control,
    watch,
  } = useForm({
    resolver: yupResolver(directRegisterPersonalSchema.schema),
    mode: "onChange",
    defaultValues: directRegisterPersonalSchema.defaultValues,
  });

  console.log(getValues());
  //Constants
  const navigators = [
    {
      label: "Personal Info",
      isValid: isValid,
      disabled: false,
    },
    {
      label: "Terms and Conditions",
      isValid: Object.keys(termsAndConditions).every((key) => {
        if (
          key === "fixedDiscounts" &&
          (termsAndConditions[key].discountPercentage === null ||
            termsAndConditions[key].discountPercentage === "" ||
            termsAndConditions[key].discountPercentage === NaN ||
            termsAndConditions[key].discountPercentage === undefined) &&
          termsAndConditions["variableDiscount"] === false
        ) {
          return false;
        }

        if (termsAndConditions["terms"] === 1 && key === "termDaysId") {
          return true;
        } else if (termsAndConditions["terms"] !== 3 && key === "creditLimit") {
          return true;
        }

        const value = termsAndConditions[key];
        return value !== null && value !== "";
      }),
      disabled: false,
    },
    {
      label: "Attachments",
      isValid:
        requirementsMode === "owner"
          ? !Object.values(ownersRequirements).some((value) => value === null)
          : requirementsMode === "representative"
          ? !Object.values(representativeRequirements).some(
              (value) => value === null
            )
          : false,
      // disabled: !navigators[0].isValid || !navigators[1].isValid,
      disabled: false,
    },
  ];
  navigators[1].disabled = !navigators[0].isValid;
  navigators[2].disabled = !navigators[0].isValid || !navigators[1].isValid;

  //RTK Query
  const [putRegisterClient, { isLoading: isRegisterLoading }] =
    usePutRegisterClientMutation();
  const [putAddAttachments, { isLoading: isAttachmentsLoading }] =
    usePutAddAttachmentsMutation();
  const [putAddTermsAndConditions, { isLoading: isTermsLoading }] =
    usePutAddTermsAndCondtionsMutation();

  const { data: storeTypeData, isLoading: isStoreTypeLoading } =
    useGetAllStoreTypesQuery({ Status: true });

  //Drawer Functions
  const onSubmit = async (data) => {
    try {
      await putRegisterClient(data).unwrap();
      await addTermsAndConditions();
      await addAttachmentsSubmit();

      dispatch(prospectApi.util.invalidateTags(["Prospecting"]));

      showSnackbar("Client registered successfully", "success");
      onConfirmClose();
      onClose();
      handleResetForms();
      debounce(onRedirectListingFeeOpen(), 2000);
    } catch (error) {
      // showSnackbar(error.data.messages[0], "error");
      console.log(error);
    }
  };

  const addTermsAndConditions = async () => {
    let updatedTermsAndConditions = { ...termsAndConditions };

    // if (termsAndConditions["fixedDiscounts"].discountPercentage === "") {
    //   updatedTermsAndConditions = {
    //     ...termsAndConditions,
    //     fixedDiscounts: {
    //       ...termsAndConditions["fixedDiscounts"],
    //       discountPercentage: null,
    //     },
    //   };
    // }

    // dispatch(setTermsAndConditions(updatedTermsAndConditions));

    if (updatedTermsAndConditions.termDaysId) {
      updatedTermsAndConditions.termDaysId =
        updatedTermsAndConditions.termDaysId.id;
    }

    await putAddTermsAndConditions({
      id: selectedRowData?.id,
      termsAndConditions: updatedTermsAndConditions,
    }).unwrap();
  };

  const addAttachmentsSubmit = async () => {
    const formData = new FormData();
    let attachmentsObject = null;

    if (requirementsMode === "owner" && ownersRequirements["signature"]) {
      const convertedSignature = new File(
        [base64ToBlob(ownersRequirements["signature"])],
        `signature_${Date.now()}.jpg`,
        { type: "image/jpeg" }
      );
      setOwnersRequirements((prevOwnersRequirements) => ({
        ...prevOwnersRequirements,
        signature: convertedSignature,
      }));
      attachmentsObject = {
        ...ownersRequirements,
        signature: convertedSignature,
      };
    } else if (
      requirementsMode === "representative" &&
      representativeRequirements["signature"]
    ) {
      const convertedSignature = new File(
        [base64ToBlob(representativeRequirements["signature"])],
        `signature_${Date.now()}.jpg`,
        { type: "image/jpeg" }
      );
      setRepresentativeRequirements((prevRepresentativeRequirements) => ({
        ...prevRepresentativeRequirements,
        signature: convertedSignature,
      }));
      attachmentsObject = {
        ...representativeRequirements,
        signature: convertedSignature,
      };
    }

    if (attachmentsObject) {
      Object.keys(attachmentsObject).forEach((key, index) => {
        const attachment = attachmentsObject[key];

        formData.append(`Attachments[${index}].Attachment`, attachment);
        formData.append(
          `Attachments[${index}].DocumentType`,
          convertToTitleCase(key)
        );
      });
    }

    await putAddAttachments({
      id: selectedRowData?.id,
      formData,
    }).unwrap();
  };

  const handleDrawerClose = () => {
    onClose();
    onCancelConfirmClose();
    handleResetForms();
  };

  const handleResetForms = () => {
    reset();
    setSameAsOwnersAddress(false);
    setOwnersRequirements({
      signature: null,
      storePhoto: null,
      businessPermit: null,
      photoIdOwner: null,
    });
    setRepresentativeRequirements({
      signature: null,
      storePhoto: null,
      businessPermit: null,
      photoIdOwner: null,
      photoIdRepresentative: null,
      authorizationLetter: null,
    });
    setRequirementsMode(null);
    dispatch(resetTermsAndConditions());
    setActiveTab("Personal Info");
  };

  const customRibbonContent = (
    <Box sx={{ display: "flex", flex: 1, gap: "10px" }}>
      <Box className="register__headers">
        {navigators.map((item, i) => (
          <Button
            key={i}
            disabled={item.disabled}
            className={
              "register__headers__item" +
              (activeTab === item.label ? " active" : "")
            }
            onClick={() => {
              setActiveTab(item.label);
            }}
            // sx={{ bgcolor: item.disabled && "#a9a7c1" }}
          >
            {item.isValid && (
              <Check
                sx={{
                  color: "white !important",
                  stroke: "white",
                  strokeWidth: 1,
                }}
              />
            )}
            <Typography>{item.label}</Typography>
          </Button>
        ))}
      </Box>
      <IconButton
        sx={{ color: "white !important" }}
        onClick={onCancelConfirmOpen}
      >
        <Close />
      </IconButton>
    </Box>
  );

  //Misc Functions
  const handleNext = () => {
    if (activeTab === "Personal Info") {
      setActiveTab("Terms and Conditions");
    } else if (activeTab === "Terms and Conditions") {
      setActiveTab("Attachments");
    }
  };

  const handleBack = () => {
    if (activeTab === "Terms and Conditions") {
      setActiveTab("Personal Info");
    } else if (activeTab === "Attachments") {
      setActiveTab("Terms and Conditions");
    }
  };

  const handleDisableNext = () => {
    if (activeTab === "Personal Info" && navigators[0].isValid === false) {
      return true;
    } else if (
      activeTab === "Terms and Conditions" &&
      navigators[1].isValid === false
    ) {
      return true;
    }
  };

  const handleRedirectListingFeeYes = () => {
    onRedirectListingFeeClose();
    onListingFeeOpen();
  };

  useEffect(() => {
    if (sameAsOwnersAddress) {
      setValue(
        "businessAddress.houseNumber",
        watch("ownersAddress.houseNumber")
      );
      setValue("businessAddress.streetName", watch("ownersAddress.streetName"));
      setValue(
        "businessAddress.barangayName",
        watch("ownersAddress.barangayName")
      );
      setValue("businessAddress.city", watch("ownersAddress.city"));
      setValue("businessAddress.province", watch("ownersAddress.province"));
    } else {
      setValue("businessAddress.houseNumber", "");
      setValue("businessAddress.streetName", "");
      setValue("businessAddress.barangayName", "");
      setValue("businessAddress.city", "");
      setValue("businessAddress.province", "");
    }
  }, [sameAsOwnersAddress]);

  console.log(getValues());

  return (
    <>
      <CommonDrawer
        drawerHeader="Direct Registration"
        open={
          open
          // true
        }
        onClose={onCancelConfirmOpen}
        width="1000px"
        paddingSmall
        // noRibbon
        customRibbonContent={customRibbonContent}
        removeButtons
        submitLabel={"Register"}
        disableSubmit={navigators.some((obj) => obj.isValid === false)}
        onSubmit={onConfirmOpen}
      >
        {activeTab === "Personal Info" && (
          <Box className="register">
            <Box className="register__firstRow">
              <Box className="register__firstRow__customerInformation">
                <Typography className="register__title">
                  Customer's Information
                </Typography>
                <Box className="register__firstRow__customerInformation__row">
                  <TextField
                    label="Owner's Name"
                    size="small"
                    autoComplete="off"
                    required
                    className="register__textField"
                    {...register("ownersName")}
                    helperText={errors?.ownersName?.message}
                    error={errors?.ownersName}
                  />
                  <TextField
                    label="Email"
                    size="small"
                    autoComplete="off"
                    required
                    className="register__textField"
                    {...register("emailAddress")}
                    helperText={errors?.emailAddress?.message}
                    error={errors?.emailAddress}
                  />
                </Box>
                <Box className="register__firstRow__customerInformation__row">
                  {/* <TextField
                    label="Date of Birth"
                    size="small"
                    autoComplete="off"
                    required
                    type="date"
                    className="register__textField"
                    {...register("dateOfBirth")}
                    helperText={errors?.birthDate?.message}
                    error={errors?.birthDate}
                    InputLabelProps={{
                      shrink: true, // This will make the label always appear on top.
                    }}
                  /> */}

                  <Controller
                    name="dateOfBirth"
                    control={control}
                    render={({ field }) => (
                      <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                          {...field}
                          className="register__textField"
                          label="Date of Birth"
                          slotProps={{ textField: { size: "small" } }}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              helperText={errors?.birthDate?.message}
                              error={errors?.birthDate}
                            />
                          )}
                          minDate={moment().subtract(117, "years")}
                          maxDate={moment().subtract(18, "years")}
                        />
                      </LocalizationProvider>
                    )}
                  />

                  <TextField
                    label="Phone Number"
                    size="small"
                    autoComplete="off"
                    required
                    className="register__textField"
                    {...register("phoneNumber")}
                    helperText={errors?.phoneNumber?.message}
                    error={errors?.phoneNumber}
                  />
                </Box>
              </Box>
              <Box className="register__firstRow__tinNumber">
                <Typography className="register__title">TIN Number</Typography>
                <TextField
                  label="TIN Number"
                  size="small"
                  autoComplete="off"
                  required
                  className="register__textField"
                  {...register("tinNumber")}
                  helperText={errors?.tinNumber?.message}
                  error={errors?.tinNumber}
                />
              </Box>
            </Box>
            <Box className="register__secondRow">
              <Box className="register__secondRow">
                <Typography className="register__title">
                  Owner's Address
                </Typography>
                <Box className="register__secondRow">
                  <Box className="register__secondRow__content">
                    <TextField
                      label="Unit No."
                      size="small"
                      autoComplete="off"
                      required
                      className="register__textField"
                      {...register("ownersAddress.houseNumber")}
                      helperText={errors?.ownersAddress?.houseNumber?.message}
                      error={errors?.ownersAddress?.houseNumber}
                    />
                    <TextField
                      label="Street Name"
                      size="small"
                      autoComplete="off"
                      required
                      className="register__textField"
                      {...register("ownersAddress.streetName")}
                      helperText={errors?.ownersAddress?.streetName?.message}
                      error={errors?.ownersAddress?.streetName}
                    />
                    <TextField
                      label="Barangay"
                      size="small"
                      autoComplete="off"
                      required
                      className="register__textField"
                      {...register("ownersAddress.barangayName")}
                      helperText={errors?.ownersAddress?.barangayName?.message}
                      error={errors?.ownersAddress?.barangayName}
                    />
                  </Box>
                  <Box className="register__secondRow__content">
                    <TextField
                      label="Municipality/City"
                      size="small"
                      autoComplete="off"
                      required
                      className="register__textField"
                      {...register("ownersAddress.city")}
                      helperText={errors?.ownersAddress?.city?.message}
                      error={errors?.ownersAddress?.city}
                    />
                    <TextField
                      label="Province"
                      size="small"
                      autoComplete="off"
                      required
                      className="register__textField"
                      {...register("ownersAddress.province")}
                      helperText={errors?.ownersAddress?.province?.message}
                      error={errors?.ownersAddress?.province}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box className="register__thirdRow">
              <Box className="register__thirdRow__column">
                <Typography className="register__title">
                  Business Name
                </Typography>
                <TextField
                  label="Business Name"
                  size="small"
                  autoComplete="off"
                  required
                  className="register__textField"
                  {...register("businessName")}
                  helperText={errors?.businessName?.message}
                />
              </Box>
              <Box className="register__thirdRow__column">
                <Typography className="register__title">Cluster</Typography>
                <TextField
                  label="Cluster Type"
                  size="small"
                  autoComplete="off"
                  type="number"
                  required
                  className="register__textField"
                  {...register("cluster")}
                  helperText={errors?.cluster?.message}
                  error={errors?.cluster}
                />
              </Box>

              <Box className="register__thirdRow__column">
                <Typography className="register__title">
                  Business Type
                </Typography>
                <ControlledAutocomplete
                  name={"storeTypeId"}
                  control={control}
                  options={storeTypeData?.storeTypes}
                  getOptionLabel={(option) => option.storeTypeName}
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
              </Box>
            </Box>
            <Box className="register__secondRow">
              <Box className="register__titleBox">
                <Typography className="register__title">
                  Business Address
                </Typography>
                <Checkbox
                  sx={{ ml: "10px" }}
                  checked={sameAsOwnersAddress}
                  onChange={() => {
                    setSameAsOwnersAddress((prev) => !prev);
                  }}
                  disabled={Object.values(watch("ownersAddress")).some(
                    (value) => !value
                  )}
                  title={
                    !Object.values(watch("ownersAddress")).some(
                      (value) => !value
                    )
                      ? "Fill up owner's address first"
                      : ""
                  }
                />
                <Typography variant="subtitle2">
                  Same as owner's address
                </Typography>
              </Box>

              <Box className="register__secondRow__content">
                <Controller
                  control={control}
                  name="businessAddress.houseNumber"
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <TextField
                      disabled={sameAsOwnersAddress}
                      label="Unit No."
                      size="small"
                      autoComplete="off"
                      required
                      className="register__textField"
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      inputRef={ref}
                      helperText={errors?.businessAddress?.houseNumber?.message}
                      error={errors?.businessAddress?.houseNumber}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="businessAddress.streetName"
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <TextField
                      disabled={sameAsOwnersAddress}
                      label="Street Name"
                      size="small"
                      autoComplete="off"
                      required
                      className="register__textField"
                      helperText={errors?.businessAddress?.streetName?.message}
                      error={errors?.businessAddress?.streetName}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      inputRef={ref}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="businessAddress.barangayName"
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <TextField
                      disabled={sameAsOwnersAddress}
                      label="Barangay"
                      size="small"
                      autoComplete="off"
                      required
                      className="register__textField"
                      helperText={
                        errors?.businessAddress?.barangayName?.message
                      }
                      error={errors?.businessAddress?.barangayName}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      inputRef={ref}
                    />
                  )}
                />
              </Box>

              <Box className="register__secondRow__content">
                <Controller
                  control={control}
                  name="businessAddress.city"
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <TextField
                      disabled={sameAsOwnersAddress}
                      label="Municipality/City"
                      size="small"
                      autoComplete="off"
                      required
                      className="register__textField"
                      helperText={errors?.businessAddress?.city?.message}
                      error={errors?.businessAddress?.city}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      inputRef={ref}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="businessAddress.province"
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <TextField
                      disabled={sameAsOwnersAddress}
                      label="Province"
                      size="small"
                      autoComplete="off"
                      required
                      className="register__textField"
                      helperText={errors?.businessAddress?.province?.message}
                      error={errors?.businessAddress?.province}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      inputRef={ref}
                    />
                  )}
                />

                <SecondaryButton onClick={onPinLocationOpen}>
                  Pin Location &nbsp; <PushPin />
                </SecondaryButton>
              </Box>
            </Box>
            <Box className="register__secondRow">
              <Typography className="register__title">
                Authorized Representative Details
              </Typography>
              <Box className="register__secondRow">
                <Box className="register__secondRow__content">
                  <TextField
                    label="Full Name"
                    size="small"
                    autoComplete="off"
                    required
                    className="register__textField"
                    {...register("authorizedRepresentative")}
                    helperText={errors?.authorizedRepresentative?.message}
                    error={errors?.authorizedRepresentative}
                  />
                  <TextField
                    label="Position"
                    size="small"
                    autoComplete="off"
                    required
                    className="register__textField"
                    {...register("authorizedRepresentativePosition")}
                    helperText={
                      errors?.authorizedRepresentativePosition?.message
                    }
                    error={errors?.authorizedRepresentativePosition}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        )}

        {activeTab === "Terms and Conditions" && <TermsAndConditions direct />}

        {activeTab === "Attachments" && <Attachments />}

        <Box
          className={
            activeTab === "Personal Info"
              ? "commonDrawer__actionsNoMarginBottom"
              : "commonDrawer__actionsSpread"
          }
        >
          {activeTab !== "Personal Info" && (
            <DangerButton onClick={handleBack}>Back</DangerButton>
          )}
          {activeTab !== "Attachments" && (
            <SecondaryButton
              onClick={handleNext}
              disabled={handleDisableNext()}
            >
              Next
            </SecondaryButton>
          )}
          {activeTab === "Attachments" && (
            <SecondaryButton
              onClick={onConfirmOpen}
              disabled={navigators.some((obj) => obj.isValid === false)}
            >
              Register
            </SecondaryButton>
          )}
        </Box>
      </CommonDrawer>

      <PinLocationModal
        latitude={latitude}
        setLatitude={setLatitude}
        longitude={longitude}
        setLongitude={setLongitude}
        open={isPinLocationOpen}
        onClose={onPinLocationClose}
      />

      <CommonDialog
        open={isConfirmOpen}
        onYes={handleSubmit(onSubmit)}
        onClose={onConfirmClose}
        isLoading={isRegisterLoading || isAttachmentsLoading || isTermsLoading}
      >
        Confirm registration of{" "}
        <span style={{ textTransform: "uppercase", fontWeight: "bold" }}>
          {selectedRowData.businessName
            ? selectedRowData.businessName
            : "client"}
        </span>{" "}
        as a regular customer?
      </CommonDialog>

      <CommonDialog
        open={isCancelConfirmOpen}
        onYes={handleDrawerClose}
        onClose={onCancelConfirmClose}
      >
        Confirm cancel of{" "}
        <span style={{ textTransform: "uppercase", fontWeight: "bold" }}>
          {selectedRowData.businessName
            ? selectedRowData.businessName
            : "client"}
        </span>{" "}
        as a regular customer? <br />
        <span style={{ textTransform: "uppercase", fontWeight: "bold" }}>
          (Fields will be reset)
        </span>
      </CommonDialog>

      <CommonDialog
        open={isRedirectListingFeeOpen}
        onClose={onRedirectListingFeeClose}
        onYes={handleRedirectListingFeeYes}
        noIcon
      >
        Continue to listing fee for{" "}
        <span style={{ textTransform: "uppercase", fontWeight: "bold" }}>
          {selectedRowData.businessName
            ? selectedRowData.businessName
            : "client"}
        </span>
        ?
      </CommonDialog>

      <ListingFeeModal open={isListingFeeOpen} onClose={onListingFeeClose} />
    </>
  );
}

export default DirectRegisterForm;
