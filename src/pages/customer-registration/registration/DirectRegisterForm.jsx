import React, { useContext, useEffect, useState } from "react";
import CommonDrawer from "../../../components/CommonDrawer";
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
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
import {
  directRegisterPersonalSchema,
  regularRegisterSchema,
} from "../../../schema/schema";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useDisclosure from "../../../hooks/useDisclosure";
import CommonDialog from "../../../components/CommonDialog";
import {
  usePostDirectRegistrationMutation,
  usePutAddAttachmentsForDirectMutation,
  usePutAddAttachmentsMutation,
  usePutAddTermsAndCondtionsMutation,
  usePutRegisterClientMutation,
  usePutUpdateClientInformationMutation,
} from "../../../features/registration/api/registrationApi";
import useSnackbar from "../../../hooks/useSnackbar";
import PinLocationModal from "../../../components/modals/PinLocationModal";
import TermsAndConditions from "../prospecting/TermsAndConditions";
import Attachments from "../prospecting/Attachments";
import { AttachmentsContext } from "../../../context/AttachmentsContext";
import {
  resetFreebies,
  resetTermsAndConditions,
  setWholeTermsAndConditions,
} from "../../../features/registration/reducers/regularRegistrationSlice";
import {
  base64ToBlob,
  convertToTitleCase,
  shallowEqual,
} from "../../../utils/CustomFunctions";
import { prospectApi } from "../../../features/prospect/api/prospectApi";
import ControlledAutocomplete from "../../../components/ControlledAutocomplete";
import { useGetAllStoreTypesQuery } from "../../../features/setup/api/storeTypeApi";
import DangerButton from "../../../components/DangerButton";
import ListingFeeModal from "../../../components/modals/ListingFeeModal";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { coverageMapping } from "../../../utils/Constants";
import { setSelectedRow } from "../../../features/misc/reducers/selectedRowSlice";
import { useGetAllTermDaysQuery } from "../../../features/setup/api/termDaysApi";
import SuccessButton from "../../../components/SuccessButton";

function DirectRegisterForm({ open, onClose, editMode, setEditMode }) {
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
  const [includeAuthorizedRepresentative, setIncludeAuthorizedRepresentative] =
    useState(false);
  const [isAllApiLoading, setIsAllApiLoading] = useState(false);

  const [isInitialized, setIsInitialzied] = useState(false);
  const [isPhoneNumberShrinked, setIsPhoneNumberShrinked] = useState(false);

  const { ownersRequirements, representativeRequirements, requirementsMode } =
    useContext(AttachmentsContext);

  const selectedRowData = useSelector((state) => state.selectedRow.value);
  const termsAndConditions = useSelector(
    (state) => state.regularRegistration.value.termsAndConditions
  );
  const freebiesDirect = useSelector(
    (state) => state.regularRegistration.value.freebies
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
    formState: { errors, isValid, isDirty },
    register,
    setValue,
    reset,
    getValues,
    control,
    watch,
    trigger,
  } = useForm({
    resolver: yupResolver(directRegisterPersonalSchema.schema),
    // resolver: yupResolver(regularRegisterSchema.schema),
    mode: "onChange",
    defaultValues: directRegisterPersonalSchema.defaultValues,
    // defaultValues: regularRegisterSchema.defaultValues,
  });

  //Constants
  const navigators = [
    {
      label: "Personal Info",
      // isValid: isValid,
      isValid: includeAuthorizedRepresentative
        ? watch("authorizedRepresentative") &&
          watch("authorizedRepresentativePosition") &&
          isValid
        : isValid,
      icon: <Person />,
      disabled: false,
    },
    {
      label: "Terms and Conditions",
      isValid: Object.keys(termsAndConditions).every((key) => {
        if (
          key === "" &&
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

        if (key === "modeOfPayments") {
          if (termsAndConditions[key]?.length === 0) {
            return false;
          }
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
      // disabled: !navigators[0].isValid || !navigators[1].isValid,
      disabled: false,
    },
  ];
  navigators[1].disabled = !navigators[0].isValid;
  navigators[2].disabled = !navigators[0].isValid || !navigators[1].isValid;

  //RTK Query

  const [postDirectRegistration, { isLoading: isRegisterLoading }] =
    usePostDirectRegistrationMutation();
  const [putAddAttachmentsForDirect, { isLoading: isAttachmentsLoading }] =
    usePutAddAttachmentsForDirectMutation();

  const [putUpdateClientInformation, { isLoading: isUpdateClientLoading }] =
    usePutUpdateClientInformationMutation();

  const { data: storeTypeData, isLoading: isStoreTypeLoading } =
    useGetAllStoreTypesQuery({ Status: true });
  const { data: termDaysData, isLoading: isTermDaysLoading } =
    useGetAllTermDaysQuery({ Status: true });

  //Drawer Functions
  const onSubmit = async (data) => {
    try {
      setIsAllApiLoading(true);

      const { terms, ...noTerms } = termsAndConditions;

      const transformedData = {
        ...data,
        dateOfBirth: moment(data?.dateOfBirth).format("YYYY-MM-DD"),
        storeTypeId: data?.storeTypeId?.id,
      };

      const transformedTermsAndConditions = {
        ...noTerms,

        termDaysId: termsAndConditions?.termDaysId?.id,
        termsId: termsAndConditions?.terms,
      };

      let response;

      if (editMode) {
        response = await putUpdateClientInformation({
          clientId: selectedRowData?.id,
          ...transformedData,
          ...transformedTermsAndConditions,
          ...(freebiesDirect?.length > 0
            ? {
                freebies: freebiesDirect.map((freebie) => ({
                  itemId: freebie.itemId.id,
                })),
              }
            : {}),
        }).unwrap();

        await addAttachmentsSubmit(response?.value?.id);
      } else {
        response = await postDirectRegistration({
          ...transformedData,
          ...transformedTermsAndConditions,
          ...(freebiesDirect?.length > 0
            ? {
                freebies: freebiesDirect.map((freebie) => ({
                  itemId: freebie.itemId.id,
                })),
              }
            : {}),
        }).unwrap();

        await addAttachmentsSubmit(response?.value?.id);
      }

      setIsAllApiLoading(false);

      dispatch(prospectApi.util.invalidateTags(["Prospecting"]));

      showSnackbar(
        `Client ${editMode ? "updated" : "registered"}  successfully`,
        "success"
      );
      onConfirmClose();
      onClose();
      handleResetForms();
      debounce(onRedirectListingFeeOpen(), 2000);
    } catch (error) {
      // showSnackbar(error.data.messages[0], "error");
      setIsAllApiLoading(false);
      if (error?.data?.error?.message) {
        showSnackbar(error?.data?.error?.message, "error");
      } else {
        showSnackbar(
          `Error ${editMode ? "updating" : "registering"} client`,
          "error"
        );
      }
    }
  };

  const addAttachmentsSubmit = async (clientId) => {
    const formData = new FormData();
    let attachmentsObject = null;

    if (
      requirementsMode === "owner" &&
      ownersRequirements["signature"] &&
      !(ownersRequirements["signature"] instanceof Blob)
    ) {
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

    await putAddAttachmentsForDirect({
      // id: selectedRowData?.id,
      id: clientId,
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
    setIncludeAuthorizedRepresentative(false);

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
    dispatch(resetFreebies());
    setEditMode(false);
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
            <Typography className="register__headers__item__label">
              {item.label}
            </Typography>
            <span className="register__headers__item__icon">{item.icon}</span>
          </Button>
        ))}
      </Box>
      <IconButton
        sx={{ color: "white !important" }}
        onClick={isDirty ? onCancelConfirmOpen : handleDrawerClose}
      >
        <Close />
      </IconButton>
    </Box>
  );

  //Misc Functions
  const handleNext = () => {
    if (activeTab === "Personal Info") {
      setActiveTab("Terms and Conditions");
      // dispatch(setSelectedRow(getValues()));
      dispatch(
        setSelectedRow({
          ...getValues(),
          dateOfBirth: getValues().dateOfBirth.format("YYYY-MM-DD"),
        })
      );
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
    if (activeTab === "Personal Info") {
      if (navigators[0].isValid === false) {
        return true;
      } else if (
        includeAuthorizedRepresentative &&
        (!watch("authorizedRepresentative") ||
          !watch("authorizedRepresentativePosition"))
      ) {
        return true;
      }
    } else if (
      activeTab === "Terms and Conditions" &&
      navigators[1].isValid === false
    ) {
      return true;
    }

    // Default case when none of the conditions for disabling the next button are met
    return false;
  };

  const handleRedirectListingFeeYes = () => {
    onRedirectListingFeeClose();
    onListingFeeOpen();
  };

  const handlePhoneNumberInput = (e) => {
    const maxLength = 10;
    const inputValue = e.target.value.toString().slice(0, maxLength);
    e.target.value = inputValue;
  };

  const handleSameAsOwnersAddress = () => {
    setSameAsOwnersAddress((prev) => !prev);
    if (!sameAsOwnersAddress) {
      setValue(
        "businessAddress.houseNumber",
        watch("ownersAddress.houseNumber"),
        { shouldValidate: true }
      );
      setValue(
        "businessAddress.streetName",
        watch("ownersAddress.streetName"),
        { shouldValidate: true }
      ),
        setValue(
          "businessAddress.barangayName",
          watch("ownersAddress.barangayName"),
          { shouldValidate: true }
        );
      setValue("businessAddress.city", watch("ownersAddress.city"), {
        shouldValidate: true,
      }),
        setValue("businessAddress.province", watch("ownersAddress.province"), {
          shouldValidate: true,
        });
    } else {
      setValue("businessAddress.houseNumber", "", { shouldValidate: true });
      setValue("businessAddress.streetName", "", { shouldValidate: true });
      setValue("businessAddress.barangayName", "", { shouldValidate: true });
      setValue("businessAddress.city", "", { shouldValidate: true });
      setValue("businessAddress.province", "", { shouldValidate: true });
    }
  };

  //UseEffects
  // useEffect(() => {
  //   if (sameAsOwnersAddress) {
  //     setValue(
  //       "businessAddress.houseNumber",
  //       watch("ownersAddress.houseNumber"),
  //       { shouldValidate: true }
  //     );
  //     setValue(
  //       "businessAddress.streetName",
  //       watch("ownersAddress.streetName"),
  //       { shouldValidate: true }
  //     ),
  //       setValue(
  //         "businessAddress.barangayName",
  //         watch("ownersAddress.barangayName"),
  //         { shouldValidate: true }
  //       );
  //     setValue("businessAddress.city", watch("ownersAddress.city"), {
  //       shouldValidate: true,
  //     }),
  //       setValue("businessAddress.province", watch("ownersAddress.province"), {
  //         shouldValidate: true,
  //       });
  //   } else {
  //     setValue("businessAddress.houseNumber", "", { shouldValidate: true });
  //     setValue("businessAddress.streetName", "", { shouldValidate: true });
  //     setValue("businessAddress.barangayName", "", { shouldValidate: true });
  //     setValue("businessAddress.city", "", { shouldValidate: true });
  //     setValue("businessAddress.province", "", { shouldValidate: true });
  //   }
  // }, [sameAsOwnersAddress]);

  useEffect(() => {
    if (editMode) {
      //Personal Info
      setValue("ownersName", selectedRowData?.ownersName);
      setValue("emailAddress", selectedRowData?.emailAddress);
      setValue("tinNumber", selectedRowData?.tinNumber);
      setValue("dateOfBirth", moment(selectedRowData?.dateOfBirth));
      setValue("phoneNumber", selectedRowData?.phoneNumber);
      setValue("ownersAddress", selectedRowData?.ownersAddress);
      setValue("businessName", selectedRowData?.businessName);
      setValue("cluster", selectedRowData?.cluster);
      setValue(
        "storeTypeId",
        storeTypeData?.storeTypes?.find(
          (item) => item.storeTypeName === selectedRowData?.storeType
        )
      );
      setValue("businessAddress", selectedRowData?.businessAddress);
      setValue(
        "authorizedRepresentative",
        selectedRowData?.authorizedRepresentative
      );
      setValue(
        "authorizedRepresentativePosition",
        selectedRowData?.authorizedRepresentativePosition
      );
      if (
        shallowEqual(
          selectedRowData?.ownersAddress,
          selectedRowData?.businessAddress
        )
      ) {
        setSameAsOwnersAddress(true);
      }

      // Terms and Conditions
      dispatch(
        setWholeTermsAndConditions({
          freezer: selectedRowData?.freezer,
          typeOfCustomer: selectedRowData?.typeOfCustomer,
          directDelivery: selectedRowData?.directDelivery,
          bookingCoverageId: parseInt(
            selectedRowData?.bookingCoverage.substring(1),
            10
          ),
          terms: selectedRowData?.terms?.termId,
          termDaysId: termDaysData?.termDays?.find(
            (day) => day.id === selectedRowData?.terms?.termDaysId
          ),
          // modeOfPayment:
          //   selectedRowData?.modeOfPayment?.toLowerCase() === "cash"
          //     ? 1
          //     : selectedRowData?.modeOfPayment?.toLowerCase() === "check/online"
          //     ? 2
          //     : null,
          // modeOfPayments: selectedRowData?.modeOfPayments,
          // modeOfPayments: selectedRowData?.modeOfPayments?.map(
          //   (item) => item.id
          // ),
          modeOfPayments: selectedRowData?.modeOfPayments?.map((payment) => ({
            modeOfPaymentId: payment.id,
          })),
          creditLimit: selectedRowData?.terms?.creditLimit,
          variableDiscount: !selectedRowData?.variableDiscount
            ? false
            : selectedRowData?.variableDiscount,
          fixedDiscount:
            selectedRowData?.fixedDiscount === null
              ? {
                  discountPercentage: null,
                }
              : {
                  discountPercentage:
                    selectedRowData?.fixedDiscount?.discountPercentage * 100,
                },
        })
      );

      // Attachments
      if (selectedRowData?.attachments?.length > 4) {
        setRequirementsMode("representative");
        setRepresentativeRequirements({
          signature: selectedRowData?.attachments?.find(
            (item) => item.documentType === "Signature"
          )?.documentLink,
          storePhoto: selectedRowData?.attachments?.find(
            (item) => item.documentType === "Store Photo"
          )?.documentLink,
          businessPermit: selectedRowData?.attachments?.find(
            (item) => item.documentType === "Business Permit"
          )?.documentLink,
          photoIdOwner: selectedRowData?.attachments?.find(
            (item) => item.documentType === "Photo ID Owner"
          )?.documentLink,
          photoIdRepresentative: selectedRowData?.attachments?.find(
            (item) => item.documentType === "Photo ID Representative"
          )?.documentLink,
          authorizationLetter: selectedRowData?.attachments?.find(
            (item) => item.documentType === "Authorization Letter"
          )?.documentLink,
        });
        setRepresentativeRequirementsIsLink({
          signature: true,
          storePhoto: true,
          businessPermit: true,
          photoIdOwner: true,
          photoIdRepresentative: true,
          authorizationLetter: true,
        });
      } else {
        setRequirementsMode("owner");
        setOwnersRequirements({
          signature: selectedRowData?.attachments?.find(
            (item) => item.documentType === "Signature"
          )?.documentLink,
          storePhoto: selectedRowData?.attachments?.find(
            (item) => item.documentType === "Store Photo"
          )?.documentLink,
          businessPermit: selectedRowData?.attachments?.find(
            (item) => item.documentType === "Business Permit"
          )?.documentLink,
          photoIdOwner: selectedRowData?.attachments?.find(
            (item) => item.documentType === "Photo ID Owner"
          )?.documentLink,
        });
        setOwnersRequirementsIsLink({
          signature: true,
          storePhoto: true,
          businessPermit: true,
          photoIdOwner: true,
        });
      }
    }
  }, [open, termDaysData]);

  useEffect(() => {
    if (!includeAuthorizedRepresentative) {
      setValue("authorizedRepresentative", "");
      setValue("authorizedRepresentativePosition", "");
    }
  }, [includeAuthorizedRepresentative]);

  return (
    <>
      <CommonDrawer
        drawerHeader="Direct Registration"
        open={
          open
          // true
        }
        // onClose={onCancelConfirmOpen}
        onClose={isDirty ? onCancelConfirmOpen : handleDrawerClose}
        width="1000px"
        responsiveBreakpoint="999px"
        paddingSmall
        // noRibbon
        customRibbonContent={customRibbonContent}
        removeButtons
        submitLabel={"Register"}
        disableSubmit={navigators.some((obj) => obj.isValid === false)}
        onSubmit={onConfirmOpen}
        zIndex={editMode && "1300"}
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
                          slotProps={{
                            textField: { size: "small", required: true },
                          }}
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
                    type="number"
                    size="small"
                    autoComplete="off"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">+63</InputAdornment>
                      ),
                      onInput: handlePhoneNumberInput,
                    }}
                    className="register__textField"
                    {...register("phoneNumber")}
                    helperText={errors?.phoneNumber?.message}
                    error={errors?.phoneNumber}
                    // onFocus={() => setIsPhoneNumberShrinked(true)}
                    // onBlur={(e) => setIsPhoneNumberShrinked(!!e.target.value)}
                    // InputLabelProps={{
                    //   shrink: isPhoneNumberShrinked,
                    // }}
                  />
                </Box>
              </Box>
              <Box className="register__firstRow__tinNumber">
                <Typography className="register__title">TIN Number</Typography>
                <TextField
                  label="TIN Number"
                  type="number"
                  size="small"
                  autoComplete="off"
                  required
                  className="register__textField"
                  {...register("tinNumber")}
                  helperText={errors?.tinNumber?.message}
                  error={errors?.tinNumber}
                  InputProps={{ inputProps: { step: "any" } }}
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
                    <Controller
                      name="ownersAddress.houseNumber"
                      control={control}
                      defaultValue="" // Set your default value here if needed
                      render={({ field }) => (
                        <TextField
                          label="Unit No."
                          size="small"
                          autoComplete="off"
                          className="register__textField"
                          {...field}
                          helperText={
                            errors?.ownersAddress?.houseNumber?.message
                          }
                          error={errors?.ownersAddress?.houseNumber}
                        />
                      )}
                    />
                    {/* <TextField
                      label="Unit No."
                      size="small"
                      autoComplete="off"
                      // required
                      className="register__textField"
                      {...register("ownersAddress.houseNumber")}
                      helperText={errors?.ownersAddress?.houseNumber?.message}
                      error={errors?.ownersAddress?.houseNumber}
                    /> */}

                    <Controller
                      name="ownersAddress.streetName"
                      control={control}
                      defaultValue="" // Set your default value here if needed
                      render={({ field }) => (
                        <TextField
                          label="Street Name"
                          size="small"
                          autoComplete="off"
                          className="register__textField"
                          {...field}
                          helperText={
                            errors?.ownersAddress?.streetName?.message
                          }
                          error={errors?.ownersAddress?.streetName}
                        />
                      )}
                    />
                    {/* <TextField
                      label="Street Name"
                      size="small"
                      autoComplete="off"
                      // required
                      className="register__textField"
                      {...register("ownersAddress.streetName")}
                      helperText={errors?.ownersAddress?.streetName?.message}
                      error={errors?.ownersAddress?.streetName}
                    /> */}

                    <Controller
                      name="ownersAddress.barangayName"
                      control={control}
                      defaultValue="" // Set your default value here if needed
                      rules={{ required: "Barangay is required" }} // Add your validation rules here
                      render={({ field }) => (
                        <TextField
                          label="Barangay"
                          size="small"
                          autoComplete="off"
                          required
                          className="register__textField"
                          {...field}
                          helperText={
                            errors?.ownersAddress?.barangayName?.message
                          }
                          error={errors?.ownersAddress?.barangayName}
                        />
                      )}
                    />
                    {/* <TextField
                      label="Barangay"
                      size="small"
                      autoComplete="off"
                      required
                      className="register__textField"
                      {...register("ownersAddress.barangayName")}
                      helperText={errors?.ownersAddress?.barangayName?.message}
                      error={errors?.ownersAddress?.barangayName}
                    /> */}
                  </Box>
                  <Box className="register__secondRow__content">
                    <Controller
                      name="ownersAddress.city"
                      control={control}
                      defaultValue="" // Set your default value here if needed
                      rules={{ required: "Municipality/City is required" }} // Add your validation rules here
                      render={({ field }) => (
                        <TextField
                          label="Municipality/City"
                          size="small"
                          autoComplete="off"
                          required
                          className="register__textField"
                          {...field}
                          helperText={errors?.ownersAddress?.city?.message}
                          error={errors?.ownersAddress?.city}
                        />
                      )}
                    />
                    {/* <TextField
                      label="Municipality/City"
                      size="small"
                      autoComplete="off"
                      required
                      className="register__textField"
                      {...register("ownersAddress.city")}
                      helperText={errors?.ownersAddress?.city?.message}
                      error={errors?.ownersAddress?.city}
                    /> */}

                    <Controller
                      name="ownersAddress.province"
                      control={control}
                      defaultValue="" // Set your default value here if needed
                      rules={{ required: "Province is required" }} // Add your validation rules here
                      render={({ field }) => (
                        <TextField
                          label="Province"
                          size="small"
                          autoComplete="off"
                          required
                          className="register__textField"
                          {...field}
                          helperText={errors?.ownersAddress?.province?.message}
                          error={errors?.ownersAddress?.province}
                        />
                      )}
                    />
                    {/* <TextField
                      label="Province"
                      size="small"
                      autoComplete="off"
                      required
                      className="register__textField"
                      // {...register("ownersAddress.province")}
                      helperText={errors?.ownersAddress?.province?.message}
                      error={errors?.ownersAddress?.province}
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
                  {...register("businessName")}
                  helperText={errors?.businessName?.message}
                  error={errors?.businessName}
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
                  options={storeTypeData?.storeTypes || []}
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
                    // setSameAsOwnersAddress((prev) => !prev);
                    handleSameAsOwnersAddress();
                  }}
                  // disabled={Object.values(watch("ownersAddress")).some(
                  //   (value) => !value
                  // )}
                  disabled={Object.entries(watch("ownersAddress")).some(
                    ([key, value]) =>
                      key !== "houseNumber" && key !== "streetName" && !value
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
                      // required
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
                      // required
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

                <SecondaryButton
                  sx={{ maxHeight: "40px" }}
                  onClick={onPinLocationOpen}
                >
                  Pin Location &nbsp; <PushPin />
                </SecondaryButton>
              </Box>
            </Box>
            <Box className="register__secondRow">
              <Box className="register__titleBox">
                <Typography className="register__title">
                  Authorized Representative Details
                </Typography>
                <Checkbox
                  sx={{ ml: "10px" }}
                  checked={includeAuthorizedRepresentative}
                  onChange={(e) => {
                    setIncludeAuthorizedRepresentative((prev) => !prev);
                  }}
                />
                <Typography variant="subtitle2">
                  Include authorized representative
                </Typography>
              </Box>
              <Box className="register__secondRow">
                <Box className="register__secondRow__content">
                  <TextField
                    label="Full Name"
                    size="small"
                    autoComplete="off"
                    // required
                    disabled={!includeAuthorizedRepresentative}
                    className="register__textField"
                    {...register("authorizedRepresentative")}
                    helperText={errors?.authorizedRepresentative?.message}
                    error={errors?.authorizedRepresentative}
                  />
                  <TextField
                    label="Position"
                    size="small"
                    autoComplete="off"
                    // required
                    disabled={!includeAuthorizedRepresentative}
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

        {activeTab === "Terms and Conditions" && (
          <TermsAndConditions
            direct
            editMode={editMode}
            storeType={watch("storeTypeId")?.storeTypeName}
          />
        )}

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
            <SuccessButton onClick={handleNext} disabled={handleDisableNext()}>
              Next
            </SuccessButton>
          )}
          {activeTab === "Attachments" && (
            <SuccessButton
              onClick={onConfirmOpen}
              disabled={navigators.some((obj) => obj.isValid === false)}
            >
              Register
            </SuccessButton>
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
        Confirm {editMode ? "update" : "registration"} of{" "}
        <span style={{ textTransform: "uppercase", fontWeight: "bold" }}>
          {watch("businessName") ? watch("businessName") : "client"}
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
          {watch("businessName") ? watch("businessName") : "client"}
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

      <ListingFeeModal open={isListingFeeOpen} onClose={onListingFeeClose} />
    </>
  );
}

export default DirectRegisterForm;
