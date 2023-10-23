import React, { useContext, useEffect, useState } from "react";
import CommonDrawer from "../../../components/CommonDrawer";
import { Box, Button, Checkbox, TextField, Typography } from "@mui/material";
import "../../../assets/styles/drawerForms.styles.scss";
import SecondaryButton from "../../../components/SecondaryButton";
import { Check, PushPin } from "@mui/icons-material";
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
import { setTermsAndConditions } from "../../../features/registration/reducers/regularRegistrationSlice";
import { base64ToBlob } from "../../../utils/CustomFunctions";
import { prospectApi } from "../../../features/prospect/api/prospectApi";

function RegisterRegularForm({ open, onClose }) {
  const dispatch = useDispatch();
  const {
    setOwnersRequirements,
    setRepresentativeRequirements,
    setRequirementsMode,
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
    },
    {
      label: "Terms and Conditions",
      isValid: Object.keys(termsAndConditions).every((key) => {
        //Check if Term Day are needed
        if (termsAndConditions["terms"] === 1) {
          if (key === "termDays") {
            return true;
          }
        } else if (termsAndConditions["terms"] !== "3") {
          if (key === "creditLimit") {
            return true;
          }
        }

        const value = termsAndConditions[key];
        return value !== null && value !== "";
      }),
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
    },
  ];

  //RTK Query
  const [putRegisterClient, { isLoading: isRegisterLoading }] =
    usePutRegisterClientMutation();
  const [putAddAttachments, { isLoading: isAttachmentsLoading }] =
    usePutAddAttachmentsMutation();
  const [putAddTermsAndConditions, { isLoading: isTermsLoading }] =
    usePutAddTermsAndCondtionsMutation();

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
      reset();
    } catch (error) {
      // showSnackbar(error.data.messages[0], "error");
      console.log(error);
    }
  };

  const addTermsAndConditions = async () => {
    if (termsAndConditions["fixedDiscounts"].discountPercentage === "") {
      dispatch(
        setTermsAndConditions({
          property: "fixedDiscounts",
          value: null,
        })
      );
    }
    await putAddTermsAndConditions({
      id: selectedRowData?.id,
      termsAndConditions,
    }).unwrap();
  };

  const addAttachmentsSubmit = async () => {
    const formData = new FormData();
    let attachmentsArray = [];
    if (requirementsMode === "owner") {
      // setOwnersRequirements((prev) => ({
      //   ...prev,
      //   signature: new File(
      //     [base64ToBlob(prev["signature"])],
      //     `signature_${
      //       selectedRowData.businessName
      //         ? selectedRowData.businessname
      //         : "owner"
      //     }_${Date.now()}.jpg`,
      //     { type: "image/jpeg" }
      //   ),
      // }));
      attachmentsArray = Object.keys(ownersRequirements).map((key) => ({
        documentType: key,
        attachment: ownersRequirements[key],
      }));
    } else if (requirementsMode === "representative") {
      // setRepresentativeRequirements((prev) => ({
      //   ...prev,
      //   signature: new File(
      //     [base64ToBlob(prev["signature"])],
      //     `signature_${
      //       selectedRowData.businessName
      //         ? selectedRowData.businessname
      //         : "representative"
      //     }_${Date.now()}.jpg`,
      //     { type: "image/jpeg" }
      //   ),
      // }));
      attachmentsArray = Object.keys(representativeRequirements).map((key) => ({
        documentType: key,
        attachment: representativeRequirements[key],
      }));
    }

    console.log(attachmentsArray);
    formData.append("Attachments", attachmentsArray);

    await putAddAttachments({
      id: selectedRowData?.id,
      formData,
    }).unwrap();
  };

  console.log(ownersRequirements);

  const handleDrawerClose = () => {
    onClose();
    onCancelConfirmClose();
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
    dispatch(
      setTermsAndConditions({
        freezer: null,
        typeOfCustomer: null,
        directDelivery: null,
        bookingCoverage: null,
        terms: null,
        modeOfPayment: null,
        discount: null,
        termDays: 10,
        creditLimit: "",
      })
    );
  };

  const customRibbonContent = (
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
  );

  useEffect(() => {
    setValue("clientId", selectedRowData?.id);
  }, [selectedRowData]);

  useEffect(() => {
    if (sameAsOwnersAddress) {
      setValue("houseNumber", selectedRowData?.ownersAddress?.houseNumber);
      setValue("streetName", selectedRowData?.ownersAddress?.streetName);
      setValue("barangayName", selectedRowData?.ownersAddress?.barangayName);
      setValue("city", selectedRowData?.ownersAddress?.city);
      setValue("province", selectedRowData?.ownersAddress?.province);
    }
    // else {
    //   setValue("houseNumber", "");
    //   setValue("streetName", "");
    //   setValue("barangayName", "");
    //   setValue("city", "");
    //   setValue("province", "");
    // }
  }, [sameAsOwnersAddress]);

  return (
    <>
      <CommonDrawer
        drawerHeader="Register as Regular"
        open={
          open
          // true
        }
        onClose={onCancelConfirmOpen}
        width="1000px"
        // noRibbon
        customRibbonContent={customRibbonContent}
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
                  <TextField
                    label="Date of Birth"
                    size="small"
                    autoComplete="off"
                    required
                    type="date"
                    className="register__textField"
                    {...register("birthDate")}
                    helperText={errors?.birthDate?.message}
                    error={errors?.birthDate}
                  />
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
                  required
                  className="register__textField"
                  {...register("cluster")}
                  helperText={errors?.cluster?.message}
                  error={errors?.cluster}
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
    </>
  );
}

export default RegisterRegularForm;
