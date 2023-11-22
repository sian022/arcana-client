import React, { useContext, useEffect, useState } from "react";
import CommonDrawer from "../../../components/CommonDrawer";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  IconButton,
  TextField,
  Typography,
  debounce,
} from "@mui/material";
import "../../../assets/styles/drawerForms.styles.scss";
import SecondaryButton from "../../../components/SecondaryButton";
import {
  Attachment,
  Check,
  Close,
  Gavel,
  Person,
  PushPin,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { regularRegisterSchema } from "../../../schema/schema";
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
import TermsAndConditions from "./TermsAndConditions";
import Attachments from "./Attachments";
import { AttachmentsContext } from "../../../context/AttachmentsContext";
import { resetTermsAndConditions } from "../../../features/registration/reducers/regularRegistrationSlice";
import {
  base64ToBlob,
  convertToTitleCase,
} from "../../../utils/CustomFunctions";
import { prospectApi } from "../../../features/prospect/api/prospectApi";
import DangerButton from "../../../components/DangerButton";
import { useGetAllStoreTypesQuery } from "../../../features/setup/api/storeTypeApi";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import ListingFeeDrawer from "../../../components/drawers/ListingFeeDrawer";

function RegisterRegularForm({ open, onClose }) {
  const dispatch = useDispatch();
  const {
    setOwnersRequirements,
    setOwnersRequirementsIsLink,
    setRepresentativeRequirements,
    setRepresentativeRequirementsIsLink,
    setRequirementsMode,
    convertSignatureToBase64,
  } = useContext(AttachmentsContext);

  const { showSnackbar } = useSnackbar();

  const [latitude, setLatitude] = useState(15.0944152);
  const [longitude, setLongitude] = useState(120.6075827);
  const [activeTab, setActiveTab] = useState("Personal Info");
  const [sameAsOwnersAddress, setSameAsOwnersAddress] = useState(false);
  const [isAllApiLoading, setIsAllApiLoading] = useState(false);

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
  } = useForm({
    resolver: yupResolver(regularRegisterSchema.schema),
    mode: "onChange",
    defaultValues: regularRegisterSchema.defaultValues,
  });

  //Constants
  const navigators = [
    {
      label: "Personal Info",
      isValid: isValid,
      icon: <Person />,
      disabled: false,
    },
    {
      label: "Terms and Conditions",
      isValid: Object.keys(termsAndConditions).every((key) => {
        if (
          key === "fixedDiscount" &&
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
      icon: <Gavel />,
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
      icon: <Attachment />,
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

  const { data: storeTypeData } = useGetAllStoreTypesQuery({ Status: true });

  //Drawer Functions
  const onSubmit = async (data) => {
    try {
      setIsAllApiLoading(true);
      await putRegisterClient(data).unwrap();
      await addTermsAndConditions();
      await addAttachmentsSubmit();
      setIsAllApiLoading(false);

      dispatch(prospectApi.util.invalidateTags(["Prospecting"]));

      showSnackbar("Client registered successfully", "success");
      onConfirmClose();
      onClose();
      handleResetForms();
      debounce(onRedirectListingFeeOpen(), 2000);
    } catch (error) {
      setIsAllApiLoading(false);
      showSnackbar(error.data.messages[0] || "Something went wrong", "error");
      console.log(error);
    }
  };

  const addTermsAndConditions = async () => {
    let updatedTermsAndConditions = { ...termsAndConditions };

    // if (termsAndConditions["fixedDiscount"].discountPercentage === "") {
    //   updatedTermsAndConditions = {
    //     ...termsAndConditions,
    //     fixedDiscount: {
    //       ...termsAndConditions["fixedDiscount"],
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
    setOwnersRequirementsIsLink({
      signature: false,
      storePhoto: false,
      businessPermit: false,
      photoIdOwner: false,
    });
    setRepresentativeRequirements({
      signature: null,
      storePhoto: null,
      businessPermit: null,
      photoIdOwner: null,
      photoIdRepresentative: null,
      authorizationLetter: null,
    });
    setRepresentativeRequirementsIsLink({
      signature: false,
      storePhoto: false,
      businessPermit: false,
      photoIdOwner: false,
      photoIdRepresentative: false,
      authorizationLetter: false,
    });

    setRequirementsMode(null);
    dispatch(resetTermsAndConditions());
    setActiveTab("Personal Info");
  };

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

  //Constant JSX
  const customRibbonContent = (
    <Box sx={{ display: "flex", flex: 1, gap: "10px" }}>
      <Box className="register__headers">
        {navigators.map((item, i) => (
          <Button
            key={i}
            className={
              "register__headers__item" +
              (activeTab === item.label ? " active" : "")
            }
            onClick={() => {
              setActiveTab(item.label);
            }}
            // sx={{
            //   bgcolor: item.disabled ? "primary.main" : "accent.main",
            // }}
            disabled={item.disabled}
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
            <span className="register__headers__item__icon">{item.icon}</span>
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

  useEffect(() => {
    setValue("clientId", selectedRowData?.id);
  }, [open]);

  useEffect(() => {
    if (sameAsOwnersAddress) {
      setValue("houseNumber", selectedRowData?.ownersAddress?.houseNumber);
      setValue("streetName", selectedRowData?.ownersAddress?.streetName);
      setValue("barangayName", selectedRowData?.ownersAddress?.barangayName);
      setValue("city", selectedRowData?.ownersAddress?.city);
      setValue("province", selectedRowData?.ownersAddress?.province);
    } else {
      setValue("houseNumber", "");
      setValue("streetName", "");
      setValue("barangayName", "");
      setValue("city", "");
      setValue("province", "");
    }
  }, [sameAsOwnersAddress]);

  return (
    <>
      <CommonDrawer
        drawerHeader="Register as Regular"
        open={
          open
          // true
        }
        paddingSmall
        onClose={onCancelConfirmOpen}
        width="1000px"
        // noRibbon
        removeButtons
        customRibbonContent={customRibbonContent}
        submitLabel={"Register"}
        disableSubmit={navigators.some((obj) => obj.isValid === false)}
        onSubmit={onConfirmOpen}
        responsiveBreakpoint="999px"
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
                    disabled
                    value={selectedRowData?.ownersName ?? ""}
                  />
                  <TextField
                    label="Email"
                    size="small"
                    autoComplete="off"
                    required
                    disabled
                    className="register__textField"
                    value={selectedRowData?.emailAddress ?? ""}
                  />
                </Box>
                <Box className="register__firstRow__customerInformation__row">
                  <Controller
                    name="birthDate"
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

                  {/* <TextField
                    label="Date of Birth"
                    size="small"
                    autoComplete="off"
                    required
                    type="date"
                    className="register__textField"
                    {...register("birthDate")}
                    helperText={errors?.birthDate?.message}
                    error={errors?.birthDate}
                    InputLabelProps={{
                      shrink: true, // This will make the label always appear on top.
                    }}
                  /> */}
                  <TextField
                    label="Phone Number"
                    size="small"
                    autoComplete="off"
                    required
                    className="register__textField"
                    disabled
                    value={selectedRowData?.phoneNumber ?? ""}
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
                      disabled
                      value={selectedRowData?.ownersAddress?.houseNumber ?? ""}
                    />
                    <TextField
                      label="Street Name"
                      size="small"
                      autoComplete="off"
                      required
                      className="register__textField"
                      disabled
                      value={selectedRowData?.ownersAddress?.streetName ?? ""}
                    />
                    <TextField
                      label="Barangay"
                      size="small"
                      autoComplete="off"
                      required
                      className="register__textField"
                      disabled
                      value={selectedRowData?.ownersAddress?.barangayName ?? ""}
                    />
                  </Box>
                  <Box className="register__secondRow__content">
                    <TextField
                      label="Municipality/City"
                      size="small"
                      autoComplete="off"
                      required
                      className="register__textField"
                      disabled
                      value={selectedRowData?.ownersAddress?.city ?? ""}
                    />
                    <TextField
                      label="Province"
                      size="small"
                      autoComplete="off"
                      required
                      className="register__textField"
                      disabled
                      value={selectedRowData?.ownersAddress?.province ?? ""}
                    />
                    {/* <TextField
                label="Zip Code"
                size="small"
                autoComplete="off"
                required
                className="register__textField"
                
              /> */}
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
                  disabled
                  value={selectedRowData?.businessName ?? ""}
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
                <Autocomplete
                  options={storeTypeData?.storeTypes}
                  getOptionLabel={(option) => option.storeTypeName}
                  disableClearable
                  value={storeTypeData?.storeTypes?.find(
                    (store) =>
                      store.storeTypeName === selectedRowData?.storeType
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
                  onChange={(e) => {
                    setSameAsOwnersAddress((prev) => !prev);
                  }}
                />
                <Typography variant="subtitle2">
                  Same as owner's address
                </Typography>
              </Box>

              <Box className="register__secondRow__content">
                <Controller
                  control={control}
                  name="houseNumber"
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
                      helperText={errors?.houseNumber?.message}
                      error={errors?.houseNumber}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="streetName"
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <TextField
                      disabled={sameAsOwnersAddress}
                      label="Street Name"
                      size="small"
                      autoComplete="off"
                      required
                      className="register__textField"
                      helperText={errors?.streetName?.message}
                      error={errors?.streetName}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      inputRef={ref}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="barangayName"
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <TextField
                      disabled={sameAsOwnersAddress}
                      label="Barangay"
                      size="small"
                      autoComplete="off"
                      required
                      className="register__textField"
                      helperText={errors?.barangayName?.message}
                      error={errors?.barangayName}
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
                  name="city"
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <TextField
                      disabled={sameAsOwnersAddress}
                      label="Municipality/City"
                      size="small"
                      autoComplete="off"
                      required
                      className="register__textField"
                      helperText={errors?.city?.message}
                      error={errors?.city}
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value}
                      inputRef={ref}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="province"
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <TextField
                      disabled={sameAsOwnersAddress}
                      label="Province"
                      size="small"
                      autoComplete="off"
                      required
                      className="register__textField"
                      helperText={errors?.province?.message}
                      error={errors?.province}
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

        {activeTab === "Terms and Conditions" && <TermsAndConditions />}

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
        // isLoading={isRegisterLoading || isAttachmentsLoading || isTermsLoading}
        isLoading={isAllApiLoading}
        noIcon
      >
        Confirm registration of{" "}
        <span style={{ textTransform: "uppercase", fontWeight: "bold" }}>
          {selectedRowData?.businessName
            ? selectedRowData?.businessName
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
          {selectedRowData?.businessName
            ? selectedRowData?.businessName
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
          {selectedRowData?.businessName
            ? selectedRowData?.businessName
            : "client"}
        </span>
        ?
      </CommonDialog>

      {/* <ListingFeeModal open={isListingFeeOpen} onClose={onListingFeeClose} /> */}
      <ListingFeeDrawer
        isListingFeeOpen={isListingFeeOpen}
        onListingFeeClose={onListingFeeClose}
        redirect
      />
    </>
  );
}

export default RegisterRegularForm;
