import React, { useContext, useEffect, useState } from "react";
import CommonDrawer from "../../../components/CommonDrawer";
import { Box, Button, Checkbox, TextField, Typography } from "@mui/material";
import "../../../assets/styles/drawerForms.styles.scss";
import SecondaryButton from "../../../components/SecondaryButton";
import { Check, PushPin } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { regularRegisterSchema } from "../../../schema/schema";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useDisclosure from "../../../hooks/useDisclosure";
import CommonDialog from "../../../components/CommonDialog";
import { usePutRegisterClientMutation } from "../../../features/registration/api/registrationApi";
import useSnackbar from "../../../hooks/useSnackbar";
import PinLocationModal from "../../../components/modals/PinLocationModal";
import TermsAndConditions from "./TermsAndConditions";
import Attachments from "./Attachments";
import { AttachmentsContext } from "../../../context/AttachmentsContext";
import { setTermsAndConditions } from "../../../features/registration/reducers/regularRegistrationSlice";

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
  } = useForm({
    resolver: yupResolver(regularRegisterSchema.schema),
    mode: "onChange",
    defaultValues: regularRegisterSchema.defaultValues,
  });

  //Constants
  const navigators = [
    { label: "Personal Info", isValid: isValid },
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
  const [putRegisterClient] = usePutRegisterClientMutation();

  //Drawer Functions
  const onSubmit = async (data) => {
    try {
      await putRegisterClient(data).unwrap();
      showSnackbar("Client registered successfully", "success");
      onConfirmClose();
      onClose();
      reset();
    } catch (error) {
      showSnackbar(error.data.messages[0], "error");
    }
  };

  const handleDrawerClose = () => {
    onClose();
    onCancelConfirmClose();
    reset();
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
                    // {...register("ownersName")}
                    // helperText={errors?.ownersName?.message}
                    // error={errors?.ownersName}
                    defaultValue={new Date().toISOString().substr(0, 10)}
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
                    />
                    <TextField
                      label="Street Name"
                      size="small"
                      autoComplete="off"
                      required
                      className="register__textField"
                    />
                    <TextField
                      label="Barangay"
                      size="small"
                      autoComplete="off"
                      required
                      className="register__textField"
                    />
                  </Box>
                  <Box className="register__secondRow__content">
                    <TextField
                      label="Municipality/City"
                      size="small"
                      autoComplete="off"
                      required
                      className="register__textField"
                    />
                    <TextField
                      label="Province"
                      size="small"
                      autoComplete="off"
                      required
                      className="register__textField"
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
                <Checkbox sx={{ ml: "10px" }} />
                <Typography variant="subtitle2">
                  Same as owner's address
                </Typography>
              </Box>

              <Box className="register__secondRow__content">
                <TextField
                  label="Unit No."
                  size="small"
                  autoComplete="off"
                  required
                  className="register__textField"
                  // {...register("ownersName")}
                  // helperText={errors?.ownersName?.message}
                  // error={errors?.ownersName}
                />
                <TextField
                  label="Street Name"
                  size="small"
                  autoComplete="off"
                  required
                  className="register__textField"
                  // {...register("ownersName")}
                  // helperText={errors?.ownersName?.message}
                  // error={errors?.ownersName}
                />
                <TextField
                  label="Barangay"
                  size="small"
                  autoComplete="off"
                  required
                  className="register__textField"
                  // {...register("ownersName")}
                  // helperText={errors?.ownersName?.message}
                  // error={errors?.ownersName}
                />
              </Box>
              <Box className="register__secondRow__content">
                <TextField
                  label="Municipality/City"
                  size="small"
                  autoComplete="off"
                  required
                  className="register__textField"
                  // {...register("ownersName")}
                  // helperText={errors?.ownersName?.message}
                  // error={errors?.ownersName}
                />
                <TextField
                  label="Province"
                  size="small"
                  autoComplete="off"
                  required
                  className="register__textField"
                  // {...register("ownersName")}
                  // helperText={errors?.ownersName?.message}
                  // error={errors?.ownersName}
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
                  {/* <TextField
              label="Email"
              size="small"
              autoComplete="off"
              required
              className="register__textField"
              // {...register("ownersName")}
              // helperText={errors?.ownersName?.message}
              // error={errors?.ownersName}
            /> */}
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
          (Forms will be reset)
        </span>
      </CommonDialog>
    </>
  );
}

export default RegisterRegularForm;
