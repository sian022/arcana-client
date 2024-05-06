import { useContext, useEffect, useState } from "react";
import CommonDrawer from "../../../components/CommonDrawer";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import "../../../assets/styles/drawerForms.styles.scss";
import {
  Attachment,
  Check,
  Close,
  Gavel,
  Payment,
  Person,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { regularRegisterSchema } from "../../../schema/schema";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useDisclosure from "../../../hooks/useDisclosure";
import CommonDialog from "../../../components/CommonDialog";
import {
  usePostValidateClientMutation,
  usePutAddAttachmentsMutation,
  usePutAddTermsAndCondtionsMutation,
  usePutRegisterClientMutation,
} from "../../../features/registration/api/registrationApi";
import useSnackbar from "../../../hooks/useSnackbar";
import TermsAndConditions from "./TermsAndConditions";
import Attachments from "./Attachments";
import { AttachmentsContext } from "../../../context/AttachmentsContext";
import {
  resetExpensesForRegistration,
  resetListingFeeForRegistration,
  resetTermsAndConditions,
  toggleFeesToStore,
} from "../../../features/registration/reducers/regularRegistrationSlice";
import {
  base64ToBlob,
  convertToTitleCase,
  handleCatchErrorMessage,
} from "../../../utils/CustomFunctions";
import DangerButton from "../../../components/DangerButton";
import { useGetAllStoreTypesQuery } from "../../../features/setup/api/storeTypeApi";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import ControlledAutocomplete from "../../../components/ControlledAutocomplete";
import { PatternFormat } from "react-number-format";
import { useGetAllClustersQuery } from "../../../features/setup/api/clusterApi";
import { useGetAllPriceModeForClientsQuery } from "../../../features/setup/api/priceModeSetupApi";
import { useSendMessageMutation } from "../../../features/misc/api/rdfSmsApi";
import ListingFeeClient from "./ListingFeeClient";
import SecondaryButton from "../../../components/SecondaryButton";
import OtherExpensesClient from "./OtherExpensesClient";
import AgreeTermsModal from "../../../components/modals/registration/AgreeTermsModal";
import { usePostListingFeeMutation } from "../../../features/listing-fee/api/listingFeeApi";
import { usePostExpensesMutation } from "../../../features/otherExpenses/api/otherExpensesRegApi";

function RegisterRegularForm({ open, onClose }) {
  const dispatch = useDispatch();
  const {
    setOwnersRequirements,
    setOwnersRequirementsIsLink,
    setRepresentativeRequirements,
    setRepresentativeRequirementsIsLink,
    setRequirementsMode,
  } = useContext(AttachmentsContext);

  const snackbar = useSnackbar();

  // const [latitude, setLatitude] = useState(15.0944152);
  // const [longitude, setLongitude] = useState(120.6075827);
  const [activeTab, setActiveTab] = useState("Personal Info");
  const [sameAsOwnersAddress, setSameAsOwnersAddress] = useState(false);
  const [includeAuthorizedRepresentative, setIncludeAuthorizedRepresentative] =
    useState(false);
  const [isAllApiLoading, setIsAllApiLoading] = useState(false);

  const { ownersRequirements, representativeRequirements, requirementsMode } =
    useContext(AttachmentsContext);

  const selectedRowData = useSelector((state) => state.selectedRow.value);
  const termsAndConditions = useSelector(
    (state) => state.regularRegistration.value.termsAndConditions
  );
  const listingFees = useSelector(
    (state) =>
      state.regularRegistration.value.listingFeeForRegistration.listingItems
  );
  const expenses = useSelector(
    (state) => state.regularRegistration.value.expensesForRegistration.expenses
  );

  const isListingFeeValid = useSelector(
    (state) => state.regularRegistration.value.listingFeeForRegistration.isValid
  );
  const isExpensesValid = useSelector(
    (state) => state.regularRegistration.value.expensesForRegistration.isValid
  );

  const signatureToCheck =
    requirementsMode === "owner"
      ? ownersRequirements["signature"]
      : representativeRequirements["signature"];

  //Disclosures
  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onClose: onConfirmClose,
  } = useDisclosure();

  // const {
  //   isOpen: isPinLocationOpen,
  //   onOpen: onPinLocationOpen,
  //   onClose: onPinLocationClose,
  // } = useDisclosure();

  const {
    isOpen: isCancelConfirmOpen,
    onOpen: onCancelConfirmOpen,
    onClose: onCancelConfirmClose,
  } = useDisclosure();

  // React Hook Form
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
    resolver: yupResolver(regularRegisterSchema.schema),
    mode: "onChange",
    defaultValues: regularRegisterSchema.defaultValues,
  });

  //Constants
  const navigators = [
    {
      label: "Personal Info",
      isValid: includeAuthorizedRepresentative
        ? watch("authorizedRepresentative") &&
          watch("authorizedRepresentativePosition") &&
          isValid
        : isValid,
      icon: <Person />,
      disabled: false,
    },

    {
      label: "Terms & Conditions",
      isValid:
        Object.keys(termsAndConditions).every((key) => {
          if (
            key === "fixedDiscount" &&
            (termsAndConditions[key].discountPercentage === null ||
              termsAndConditions[key].discountPercentage === "" ||
              termsAndConditions[key].discountPercentage === undefined) &&
            termsAndConditions["variableDiscount"] === false
          ) {
            return false;
          }

          if (!termsAndConditions["freezer"] && key === "freezerAssetTag") {
            return true;
          }

          if (termsAndConditions["terms"] === 1 && key === "termDaysId") {
            return true;
          } else if (
            termsAndConditions["terms"] !== 3 &&
            key === "creditLimit"
          ) {
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
        }) && !!signatureToCheck,
      icon: <Gavel />,
      disabled: false,
    },

    termsAndConditions["terms"] !== 1 && {
      label: "Attachments",
      isValid:
        requirementsMode === "owner"
          ? !Object.values(ownersRequirements).some(
              (value) => value === null || value === undefined
            )
          : requirementsMode === "representative"
          ? !Object.values(representativeRequirements).some(
              (value) => value === null || value === undefined
            )
          : false,
      icon: <Attachment />,
      disabled: false,
    },

    {
      label: "Costs and Fees",
      isValid: isListingFeeValid && isExpensesValid,
      icon: <Payment />,
      disabled: false,
    },
  ].filter(Boolean);

  navigators[1].disabled = !navigators[0].isValid;
  navigators[2].disabled = !navigators[0].isValid || !navigators[1].isValid;
  if (navigators?.length > 3) {
    navigators[3].disabled =
      !navigators[0].isValid ||
      !navigators[1].isValid ||
      !navigators[2].isValid;
  }

  //RTK Query
  const [putRegisterClient] = usePutRegisterClientMutation();
  const [putAddAttachments] = usePutAddAttachmentsMutation();
  const [putAddTermsAndConditions] = usePutAddTermsAndCondtionsMutation();
  const [postListingFee] = usePostListingFeeMutation();
  const [postExpenses] = usePostExpensesMutation();

  const { data: storeTypeData } = useGetAllStoreTypesQuery({
    Status: true,
    Page: 1,
    PageSize: 1000,
  });
  const { data: clusterData } = useGetAllClustersQuery({
    Status: true,
    ModuleName: "Registration",
    Page: 1,
    PageSize: 1000,
  });

  const [postValidateClient, { isLoading: isValidateClientLoading }] =
    usePostValidateClientMutation();
  const { data: priceModeData, isLoading: isPriceModeLoading } =
    useGetAllPriceModeForClientsQuery();
  const [sendMessage, { isLoading: isSendMessageLoading }] =
    useSendMessageMutation();

  //Drawer Functions
  const onSubmit = async (data) => {
    const transformedData = {
      ...data,
      storeTypeId: data?.storeTypeId?.id,
      clusterId: data?.clusterId.id,
      priceModeId: data?.priceModeId?.id,
    };

    try {
      setIsAllApiLoading(true);
      const registerResponse = await putRegisterClient(
        transformedData
      ).unwrap();

      await addTermsAndConditions();
      listingFees && listingFees?.length > 0 && (await addListingFee());
      expenses && expenses?.length > 0 && (await addExpenses());

      // termsAndConditions["terms"] !== 1 && (await addAttachmentsSubmit());
      await addAttachmentsSubmit();

      setIsAllApiLoading(false);

      await sendMessage({
        message: `Fresh morning ${
          registerResponse?.currentApprover || "approver"
        }! You have a new customer approval.`,
        mobile_number: `+63${registerResponse?.currentApproverPhoneNumber}`,
      }).unwrap();

      onClose();
      handleResetForms();

      snackbar({
        message: "Client registered successfully",
        variant: "success",
      });
    } catch (error) {
      setIsAllApiLoading(false);

      if (error.function !== "sendMessage") {
        snackbar({
          message: handleCatchErrorMessage(error),
          variant: "error",
        });
      }

      snackbar({
        message:
          "Client registered successfully but failed to send message to approver.",
        variant: "warning",
      });
      onClose();
      handleResetForms();
    }

    onConfirmClose();
  };

  const addTermsAndConditions = async () => {
    const { freezer, freezerAssetTag, ...otherTerms } = termsAndConditions;

    let updatedTermsAndConditions = {
      ...otherTerms,
      freezer: freezer ? freezerAssetTag : null,
    };

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
      if (termsAndConditions["terms"] !== 1) {
        Object.keys(attachmentsObject).forEach((key, index) => {
          const attachment = attachmentsObject[key];

          formData.append(`Attachments[${index}].Attachment`, attachment);
          formData.append(
            `Attachments[${index}].DocumentType`,
            convertToTitleCase(key)
          );
        });
      } else {
        formData.append(
          "Attachments[0].Attachment",
          attachmentsObject["signature"]
        );
        formData.append("Attachments[0].DocumentType", "Signature");
      }
    }

    await putAddAttachments({
      id: selectedRowData?.id,
      formData,
    }).unwrap();
  };

  const addListingFee = async () => {
    const totalAmount = listingFees.reduce(
      (acc, listingItem) => acc + listingItem.unitCost,
      0
    );

    await postListingFee({
      clientId: selectedRowData?.id,
      total: totalAmount,
      listingItems: listingFees.map((listingItem) => ({
        itemId: listingItem.itemId.id,
        sku: listingItem.sku,
        unitCost: listingItem.unitCost,
      })),
    }).unwrap();
  };

  const addExpenses = async () => {
    await postExpenses({
      clientId: selectedRowData?.id,
      expenses: expenses.map((expense) => ({
        otherExpenseId: expense.otherExpenseId.id,
        remarks: expense.remarks,
        amount: expense.amount,
      })),
    }).unwrap();
  };

  const handleDrawerClose = () => {
    onClose();
    onCancelConfirmClose();
    handleResetForms();
  };

  const handleResetForms = () => {
    reset();
    clearErrors();
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
    dispatch(resetListingFeeForRegistration());
    dispatch(resetExpensesForRegistration());
    setActiveTab("Personal Info");
  };

  //Misc Functions
  const handleNext = async () => {
    if (activeTab === "Personal Info") {
      try {
        await postValidateClient({
          clientId: selectedRowData?.id,
          businessName: watch("businessName"),
          fullName: watch("ownersName"),
          businessTypeId: watch("storeTypeId")?.id,
        }).unwrap();
        setActiveTab("Terms & Conditions");
      } catch (error) {
        if (error?.data?.error?.message) {
          snackbar({ message: error?.data?.error?.message, variant: "error" });
        } else {
          snackbar({ message: "Client already exists", variant: "error" });
        }
        return;
      }
    } else if (
      activeTab === "Terms & Conditions" &&
      termsAndConditions["terms"] === 1
    ) {
      setActiveTab("Costs and Fees");
    } else if (
      activeTab === "Terms & Conditions" &&
      termsAndConditions["terms"] !== 1
    ) {
      setActiveTab("Attachments");
    } else if (activeTab === "Attachments") {
      setActiveTab("Costs and Fees");
    }
  };

  const handleBack = () => {
    if (activeTab === "Terms & Conditions") {
      setActiveTab("Personal Info");
    } else if (activeTab === "Attachments") {
      setActiveTab("Terms & Conditions");
    } else if (
      activeTab === "Costs and Fees" &&
      termsAndConditions["terms"] === 1
    ) {
      setActiveTab("Terms & Conditions");
    } else if (
      activeTab === "Costs and Fees" &&
      termsAndConditions["terms"] !== 1
    ) {
      setActiveTab("Attachments");
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
      activeTab === "Terms & Conditions" &&
      navigators[1].isValid === false
    ) {
      return true;
    } else if (activeTab === "Attachments" && navigators[2].isValid === false) {
      return true;
    }
  };

  //Constant JSX
  const customRibbonContent = (
    <Box sx={{ display: "flex", flex: 1, gap: "10px" }}>
      <Box
        className={
          termsAndConditions["terms"] === 1
            ? "register__headersThreeTabs"
            : "register__headers"
        }
      >
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
        onClick={isDirty ? onCancelConfirmOpen : handleDrawerClose}
      >
        <Close />
      </IconButton>
    </Box>
  );

  //UseEffects
  useEffect(() => {
    if (open) {
      setValue("clientId", selectedRowData?.id);
      setValue(
        "storeTypeId",
        storeTypeData?.storeTypes?.find(
          (store) => store.storeTypeName === selectedRowData?.storeType
        )
      );
      setValue("emailAddress", selectedRowData?.emailAddress);
    }
  }, [open, selectedRowData, storeTypeData, setValue]);

  const handleSameAsOwnersAddress = () => {
    setSameAsOwnersAddress((prev) => !prev);
    if (!sameAsOwnersAddress) {
      setValue("houseNumber", selectedRowData?.ownersAddress?.houseNumber, {
        shouldValidate: true,
      });
      setValue("streetName", selectedRowData?.ownersAddress?.streetName, {
        shouldValidate: true,
      });
      setValue("barangayName", selectedRowData?.ownersAddress?.barangayName, {
        shouldValidate: true,
      });
      setValue("city", selectedRowData?.ownersAddress?.city, {
        shouldValidate: true,
      });
      setValue("province", selectedRowData?.ownersAddress?.province, {
        shouldValidate: true,
      });
    } else {
      setValue("houseNumber", "", { shouldValidate: true });
      setValue("streetName", "", { shouldValidate: true });
      setValue("barangayName", "", { shouldValidate: true });
      setValue("city", "", { shouldValidate: true });
      setValue("province", "", { shouldValidate: true });
    }
  };

  useEffect(() => {
    if (includeAuthorizedRepresentative) {
      setRequirementsMode("representative");
    }

    if (!includeAuthorizedRepresentative) {
      setValue("authorizedRepresentative", "");
      setValue("authorizedRepresentativePosition", "");
      setRequirementsMode("owner");
    }
  }, [includeAuthorizedRepresentative, setValue, setRequirementsMode, open]);

  useEffect(() => {
    if (clusterData && open) {
      setValue("clusterId", clusterData?.cluster?.[0]);
    }
  }, [open, clusterData, setValue]);

  useEffect(() => {
    if (priceModeData && open) {
      setValue(
        "priceModeId",
        priceModeData?.find(
          (item) => item.priceModeDescription?.toLowerCase() === "regular"
        )
      );
    }
  }, [open, priceModeData, setValue]);

  return (
    <>
      <CommonDrawer
        drawerHeader="Register as Regular"
        open={open}
        paddingSmall
        onClose={isDirty ? onCancelConfirmOpen : handleDrawerClose}
        width="1000px"
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
                  Customer&apos;s Information
                </Typography>
                <Box className="register__firstRow__customerInformation__row">
                  <TextField
                    label="Owner's Name"
                    size="small"
                    autoComplete="off"
                    className="register__textField"
                    disabled
                    value={selectedRowData?.ownersName ?? ""}
                  />

                  <TextField
                    label="Email Address"
                    size="small"
                    autoComplete="off"
                    className="register__textField"
                    {...register("emailAddress")}
                  />
                </Box>
              </Box>

              <Box className="register__firstRow__tinNumber">
                <Typography className="register__title">TIN Number</Typography>

                <Controller
                  control={control}
                  name={"tinNumber"}
                  render={({ field: { onChange, onBlur, value, ref } }) => {
                    const formattedValue = value.replace(/-/g, "");
                    let format = "###-###-###";

                    if (formattedValue.length <= 3) {
                      format = "####";
                    } else if (formattedValue.length <= 6) {
                      format = "###-####";
                    }

                    return (
                      <PatternFormat
                        format={format}
                        label="TIN Number"
                        type="text"
                        size="small"
                        customInput={TextField}
                        autoComplete="off"
                        valueIsNumericString
                        onValueChange={(e) => {
                          onChange(e.value);
                        }}
                        inputRef={ref}
                        onBlur={onBlur}
                        value={value || ""}
                        helperText={errors?.tinNumber?.message}
                        error={!!errors?.tinNumber}
                      />
                    );
                  }}
                />
              </Box>

              <Box className="register__firstRow__customerInformation">
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
                          slotProps={{
                            textField: { size: "small", required: true },
                          }}
                          helperText={errors?.birthDate?.message}
                          error={!!errors?.birthDate}
                          minDate={moment().subtract(117, "years")}
                          maxDate={moment().subtract(18, "years")}
                        />
                      </LocalizationProvider>
                    )}
                  />

                  <Controller
                    control={control}
                    name={"phoneNumber"}
                    render={({ field: { onChange, onBlur } }) => {
                      const formattedValue =
                        selectedRowData?.phoneNumber?.replace(/-/g, "");
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
                          valueIsNumericString
                          onValueChange={(e) => {
                            onChange(e.value);
                          }}
                          onBlur={onBlur}
                          value={selectedRowData?.phoneNumber ?? ""}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                +63
                              </InputAdornment>
                            ),
                          }}
                          className="register__textField"
                          helperText={errors?.phoneNumber?.message}
                          error={!!errors?.phoneNumber}
                          disabled
                        />
                      );
                    }}
                  />
                </Box>
              </Box>
            </Box>
            <Box className="register__secondRow">
              <Box className="register__secondRow">
                <Typography className="register__title">
                  Owner&apos;s Address
                </Typography>
                <Box className="register__secondRow">
                  <Box className="register__secondRow__content">
                    <TextField
                      label="Unit No."
                      size="small"
                      autoComplete="off"
                      className="register__textField"
                      disabled
                      value={selectedRowData?.ownersAddress?.houseNumber ?? ""}
                    />
                    <TextField
                      label="Street Name"
                      size="small"
                      autoComplete="off"
                      className="register__textField"
                      disabled
                      value={selectedRowData?.ownersAddress?.streetName ?? ""}
                    />
                    <TextField
                      label="Barangay"
                      size="small"
                      autoComplete="off"
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
                      className="register__textField"
                      disabled
                      value={selectedRowData?.ownersAddress?.city ?? ""}
                    />
                    <TextField
                      label="Province"
                      size="small"
                      autoComplete="off"
                      className="register__textField"
                      disabled
                      value={selectedRowData?.ownersAddress?.province ?? ""}
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
                  className="register__textField"
                  disabled
                  value={selectedRowData?.businessName ?? ""}
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
                  getOptionLabel={(option) =>
                    option.storeTypeName?.toUpperCase()
                  }
                  disableClearable
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
                      error={!!errors?.storeTypeId}
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
                />
                <Typography variant="subtitle2">
                  Same as owner&apos;s address
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
                      className="register__textField"
                      onChange={(e) => onChange(e.target.value.toUpperCase())}
                      onBlur={onBlur}
                      value={value}
                      inputRef={ref}
                      helperText={errors?.houseNumber?.message}
                      error={!!errors?.houseNumber}
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
                      className="register__textField"
                      helperText={errors?.streetName?.message}
                      error={!!errors?.streetName}
                      onChange={(e) => onChange(e.target.value.toUpperCase())}
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
                      error={!!errors?.barangayName}
                      onChange={(e) => onChange(e.target.value.toUpperCase())}
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
                      error={!!errors?.city}
                      onChange={(e) => onChange(e.target.value.toUpperCase())}
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
                      error={!!errors?.province}
                      onChange={(e) => onChange(e.target.value.toUpperCase())}
                      onBlur={onBlur}
                      value={value}
                      inputRef={ref}
                    />
                  )}
                />

                {/* <SecondaryButton
                  sx={{ maxHeight: "40px" }}
                  onClick={onPinLocationOpen}
                >
                  Pin Location &nbsp; <PushPin />
                </SecondaryButton> */}
              </Box>
            </Box>

            <Box className="register__thirdRow">
              <Box className="register__thirdRow__column">
                <Typography className="register__title">Cluster</Typography>

                <ControlledAutocomplete
                  name={"clusterId"}
                  control={control}
                  options={clusterData?.cluster || []}
                  getOptionLabel={(option) => option.cluster.toUpperCase()}
                  disableClearable
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      label="Cluster"
                      required
                      helperText={errors?.clusterId?.message}
                      error={!!errors?.clusterId}
                    />
                  )}
                />
              </Box>

              <Box className="register__thirdRow__column">
                <Typography className="register__title">Price Mode</Typography>

                <ControlledAutocomplete
                  name="priceModeId"
                  control={control}
                  options={priceModeData || []}
                  getOptionLabel={(option) =>
                    `${option.priceModeCode?.toUpperCase()} -  ${option.priceModeDescription?.toUpperCase()}`
                  }
                  disableClearable
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  loading={isPriceModeLoading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      label="Price Mode"
                      required
                      helperText={errors?.priceModeId?.message}
                      error={!!errors?.priceModeId}
                    />
                  )}
                />
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
                  onChange={() => {
                    setIncludeAuthorizedRepresentative((prev) => !prev);
                  }}
                />
                <Typography variant="subtitle2">
                  Include authorized representative
                </Typography>
              </Box>
              <Box className="register__secondRow">
                <Box className="register__secondRow__content">
                  {/* <TextField
                    label="Full Name"
                    size="small"
                    autoComplete="off"
                    required={includeAuthorizedRepresentative}
                    disabled={!includeAuthorizedRepresentative}
                    className="register__textField"
                    {...register("authorizedRepresentative")}
                    helperText={errors?.authorizedRepresentative?.message}
                    error={!!errors?.authorizedRepresentative}
                  /> */}

                  <Controller
                    control={control}
                    name="authorizedRepresentative"
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                      <TextField
                        label="Full Name"
                        size="small"
                        autoComplete="off"
                        required={includeAuthorizedRepresentative}
                        disabled={!includeAuthorizedRepresentative}
                        className="register__textField"
                        onChange={(e) => onChange(e.target.value.toUpperCase())}
                        onBlur={onBlur}
                        value={value}
                        inputRef={ref}
                        helperText={errors?.authorizedRepresentative?.message}
                        error={!!errors?.authorizedRepresentative}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="authorizedRepresentativePosition"
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                      <TextField
                        label="Position"
                        size="small"
                        autoComplete="off"
                        required={includeAuthorizedRepresentative}
                        disabled={!includeAuthorizedRepresentative}
                        className="register__textField"
                        onChange={(e) => onChange(e.target.value.toUpperCase())}
                        onBlur={onBlur}
                        value={value}
                        inputRef={ref}
                        helperText={
                          errors?.authorizedRepresentativePosition?.message
                        }
                        error={!!errors?.authorizedRepresentativePosition}
                      />
                    )}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        )}

        {activeTab === "Terms & Conditions" && (
          <TermsAndConditions storeType={watch("storeTypeId")?.storeTypeName} />
        )}

        {activeTab === "Attachments" && <Attachments />}

        {activeTab === "Costs and Fees" && (
          <Box className="feesClient">
            <ListingFeeClient />
            <Divider variant="inset" />
            <OtherExpensesClient />
          </Box>
        )}

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

          {
            // (activeTab === "Personal Info" ||
            //   (activeTab === "Terms & Conditions" &&
            //     termsAndConditions["terms"] !== 1))
            activeTab !== "Costs and Fees" && (
              <SecondaryButton
                onClick={handleNext}
                disabled={handleDisableNext()}
              >
                {isValidateClientLoading ? (
                  <>
                    <CircularProgress size="20px" color="white" />
                  </>
                ) : (
                  "Next"
                )}
              </SecondaryButton>
            )
          }

          {
            // ((termsAndConditions["terms"] === 1 &&
            //   activeTab === "Terms & Conditions") ||
            //   activeTab === "Attachments") &&
            activeTab === "Costs and Fees" && (
              <SecondaryButton
                onClick={() => {
                  onConfirmOpen();
                  dispatch(toggleFeesToStore());
                }}
                disabled={
                  termsAndConditions["terms"] === 1
                    ? navigators.some(
                        (obj) => obj.isValid === false && obj.label !== ""
                      )
                    : navigators.some((obj) => obj.isValid === false)
                }
              >
                Register
              </SecondaryButton>
            )
          }
        </Box>
      </CommonDrawer>

      {/* <PinLocationModal
        latitude={latitude}
        setLatitude={setLatitude}
        longitude={longitude}
        setLongitude={setLongitude}
        open={isPinLocationOpen}
        onClose={onPinLocationClose}
      /> */}

      <AgreeTermsModal
        open={isConfirmOpen}
        onClose={onConfirmClose}
        onRegister={handleSubmit(onSubmit)}
        isLoading={isAllApiLoading || isSendMessageLoading}
      />

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
        registration as a regular customer? <br />
        <span style={{ textTransform: "uppercase", fontWeight: "bold" }}>
          (Fields will be reset)
        </span>
      </CommonDialog>

      {/* <CommonDialog
        open={isRedirectListingFeeOpen}
        onClose={onRedirectListingFeeClose}
        onYes={handleRedirectListingFeeYes}
        question
      >
        Continue to listing fee for{" "}
        <span style={{ textTransform: "uppercase", fontWeight: "bold" }}>
          {selectedRowData?.businessName
            ? selectedRowData?.businessName
            : "client"}
        </span>
        ?
      </CommonDialog> */}

      {/* <ListingFeeDrawer
        isListingFeeOpen={isListingFeeOpen}
        onListingFeeClose={onListingFeeClose}
        redirect
      /> */}
    </>
  );
}

export default RegisterRegularForm;
