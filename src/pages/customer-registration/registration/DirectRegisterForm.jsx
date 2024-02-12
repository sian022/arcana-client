import React, { useContext, useEffect, useState } from "react";
import CommonDrawer from "../../../components/CommonDrawer";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  IconButton,
  InputAdornment,
  Skeleton,
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
  useGetAttachmentsByClientIdQuery,
  useGetTermsByClientIdQuery,
  useLazyGetAttachmentsByClientIdQuery,
  useLazyGetTermsByClientIdQuery,
  usePostDirectRegistrationMutation,
  usePostValidateClientMutation,
  usePutAddAttachmentsForDirectMutation,
  usePutAddAttachmentsMutation,
  usePutAddTermsAndCondtionsMutation,
  usePutRegisterClientMutation,
  usePutReleaseFreebiesMutation,
  usePutUpdateClientAttachmentsMutation,
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
  dashFormat,
  debounce,
  shallowEqual,
} from "../../../utils/CustomFunctions";
import { prospectApi } from "../../../features/prospect/api/prospectApi";
import ControlledAutocomplete from "../../../components/ControlledAutocomplete";
import { useGetAllStoreTypesQuery } from "../../../features/setup/api/storeTypeApi";
import DangerButton from "../../../components/DangerButton";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { coverageMapping } from "../../../utils/Constants";
import { setSelectedRow } from "../../../features/misc/reducers/selectedRowSlice";
import { useGetAllTermDaysQuery } from "../../../features/setup/api/termDaysApi";
import SuccessButton from "../../../components/SuccessButton";
import { notificationApi } from "../../../features/notification/api/notificationApi";
import { DirectReleaseContext } from "../../../context/DirectReleaseContext";
import { NumericFormat, PatternFormat } from "react-number-format";
import { useGetAllClustersQuery } from "../../../features/setup/api/clusterApi";
import RegisterClientFormSkeleton from "../../../components/skeletons/RegisterClientFormSkeleton";
import { useGetAllPriceModeForClientsQuery } from "../../../features/setup/api/priceModeSetupApi";

function DirectRegisterForm({ open, onClose, editMode, setEditMode }) {
  const dispatch = useDispatch();
  const {
    setOwnersRequirements,
    setOwnersRequirementsIsLink,
    setRepresentativeRequirements,
    setRepresentativeRequirementsIsLink,
    setRequirementsMode,
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

  const {
    signatureDirect,
    photoProofDirect,
    setSignatureDirect,
    setPhotoProofDirect,
  } = useContext(DirectReleaseContext);

  const selectedRowData = useSelector((state) => state.selectedRow.value);
  const termsAndConditions = useSelector(
    (state) => state.regularRegistration.value.termsAndConditions
  );
  const freebiesDirect = useSelector(
    (state) => state.regularRegistration.value.directFreebie.freebies
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
    formState: { errors, isValid, isDirty },
    register,
    setValue,
    reset,
    getValues,
    control,
    watch,
    clearErrors,
  } = useForm({
    resolver: yupResolver(directRegisterPersonalSchema.schema),
    // resolver: yupResolver(regularRegisterSchema.schema),
    mode: "onSubmit",
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
          key === "fixedDiscount" &&
          (termsAndConditions[key].discountPercentage === null ||
            termsAndConditions[key].discountPercentage === "" ||
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
  // navigators[1].disabled = !navigators[0].isValid;
  navigators[1].disabled = !editMode && activeTab === "Personal Info";
  navigators[2].disabled = !navigators[0].isValid || !navigators[1].isValid;

  //RTK Query

  const [postDirectRegistration, { isLoading: isRegisterLoading }] =
    usePostDirectRegistrationMutation();
  const [putAddAttachmentsForDirect, { isLoading: isAttachmentsLoading }] =
    usePutAddAttachmentsForDirectMutation();

  const [putUpdateClientInformation, { isLoading: isUpdateClientLoading }] =
    usePutUpdateClientInformationMutation();
  const [
    putUpdateClientAttachments,
    { isLoading, isUpdateAttachmentsLoading },
  ] = usePutUpdateClientAttachmentsMutation();

  const [putReleaseFreebies, { isLoading: isReleaseFreebiesLoading }] =
    usePutReleaseFreebiesMutation();

  const { data: storeTypeData, isLoading: isStoreTypeLoading } =
    useGetAllStoreTypesQuery({ Status: true, Page: 1, PageSize: 1000 });
  const { data: termDaysData, isLoading: isTermDaysLoading } =
    useGetAllTermDaysQuery({ Status: true, Page: 1, PageSize: 1000 });
  const { data: clusterData } = useGetAllClustersQuery({
    Status: true,
    ModuleName: "Registration",
    Page: 1,
    PageSize: 1000,
  });

  const [postValidateClient, { isLoading: isValidateClientLoading }] =
    usePostValidateClientMutation();

  //Fetch Terms and Attachments
  const [triggerTerms, { data: termsData, isLoading: isTermsDataLoading }] =
    useLazyGetTermsByClientIdQuery();

  const [
    triggerAttachments,
    { data: attachmentsData, isLoading: isAttachmentsDataLoading },
  ] = useLazyGetAttachmentsByClientIdQuery();

  const { data: priceModeData, isLoading: isPriceModeLoading } =
    useGetAllPriceModeForClientsQuery();

  //Drawer Functions
  const onSubmit = async (data) => {
    try {
      setIsAllApiLoading(true);

      const { terms, ...noTerms } = termsAndConditions;

      const transformedData = {
        ...data,
        dateOfBirth: moment(data?.dateOfBirth).format("YYYY-MM-DD"),
        storeTypeId: data?.storeTypeId?.id,
        clusterId: data?.clusterId?.id,
        priceModeId: data?.priceModeId?.id,
        clientId: selectedRowData?.id,
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

        if (freebiesDirect && signatureDirect && photoProofDirect) {
          const signatureFile = new File(
            [base64ToBlob(signatureDirect)],
            `signature_${Date.now()}.jpg`,
            { type: "image/jpeg" }
          );

          const formData = new FormData();
          formData.append("PhotoProof", photoProofDirect);
          formData.append("ESignature", signatureFile);

          await putReleaseFreebies({
            id: response?.value?.id,
            body: formData,
          }).unwrap();

          setPhotoProofDirect(null);
          setSignatureDirect(null);
          dispatch(resetFreebies());
        }

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

      dispatch(notificationApi.util.invalidateTags(["Notification"]));
    } catch (error) {
      // showSnackbar(error.data.messages[0], "error");
      setIsAllApiLoading(false);

      //Reset Direct Freebies
      setPhotoProofDirect(null);
      setSignatureDirect(null);
      dispatch(resetFreebies());

      if (error?.data?.error?.message) {
        showSnackbar(error?.data?.error?.message, "error");
      } else {
        showSnackbar(
          `Error ${editMode ? "updating" : "registering"} client`,
          "error"
        );
      }
      console.log(error);
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
      let convertedSignature;
      if (ownersRequirements["signature"]?.includes("data:")) {
        convertedSignature = new File(
          [base64ToBlob(ownersRequirements["signature"])],
          `signature_${Date.now()}.jpg`,
          { type: "image/jpeg" }
        );
      } else {
        convertedSignature = ownersRequirements["signature"];
      }

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
      representativeRequirements["signature"] &&
      !(representativeRequirements["signature"] instanceof Blob)
    ) {
      let convertedSignature;
      if (representativeRequirements["signature"]?.includes("data:")) {
        convertedSignature = new File(
          [base64ToBlob(representativeRequirements["signature"])],
          `signature_${Date.now()}.jpg`,
          { type: "image/jpeg" }
        );
      } else {
        convertedSignature = representativeRequirements["signature"];
      }

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

    if (editMode) {
      await putUpdateClientAttachments({
        id: selectedRowData?.id,
        // id: clientId,
        formData,
      }).unwrap();
    } else {
      await putAddAttachmentsForDirect({
        // id: selectedRowData?.id,
        id: clientId,
        formData,
      }).unwrap();
    }
  };

  const handleDrawerClose = () => {
    onClose();
    onCancelConfirmClose();
    handleResetForms();
  };

  const handleResetForms = () => {
    reset();
    clearErrors();
    // setValue("phoneNumber", "");

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
        {navigators.map((item, i) => {
          return isTermsDataLoading || isAttachmentsDataLoading ? (
            <Skeleton sx={{ transform: "none" }} />
          ) : (
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
          );
        })}
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
  const handleNext = async () => {
    if (activeTab === "Personal Info") {
      //Temporary only to disable it on editMode
      if (!editMode) {
        try {
          await postValidateClient({
            clientId: editMode ? selectedRowData?.id : 0,
            businessName: watch("businessName"),
            fullName: watch("ownersName"),
            businessTypeId: watch("storeTypeId")?.id,
          }).unwrap();
        } catch (error) {
          if (error?.data?.error?.message) {
            showSnackbar(error?.data?.error?.message, "error");
          } else {
            showSnackbar("Client already exists", "error");
          }
          return;
        }
      }

      setActiveTab("Terms and Conditions");
      // dispatch(setSelectedRow(getValues()));
      dispatch(
        setSelectedRow({
          id: selectedRowData?.id,
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

    return false;
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
      setValue(
        "storeTypeId",
        storeTypeData?.storeTypes?.find(
          (item) => item.storeTypeName === selectedRowData?.storeType
        )
      );
      setValue("businessAddress", selectedRowData?.businessAddress);
      setValue(
        "clusterId",
        clusterData?.cluster?.find(
          (item) => selectedRowData?.clusterId === item.id
        )
      );
      setValue(
        "priceModeId",
        priceModeData.find((item) => selectedRowData?.priceModeId === item.id)
      );
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
      if (
        selectedRowData?.authorizedRepresentative &&
        selectedRowData?.authorizedRepresentativePosition
      ) {
        setIncludeAuthorizedRepresentative(true);
      }

      // Terms and Conditions
      dispatch(
        setWholeTermsAndConditions({
          freezer: termsData?.freezer,
          typeOfCustomer: termsData?.typeOfCustomer,
          directDelivery: termsData?.directDelivery,
          bookingCoverageId: parseInt(
            termsData?.bookingCoverage.substring(1),
            10
          ),
          // terms: termsData?.terms?.termId,
          terms: termsData?.termId,
          termDaysId: termDaysData?.termDays?.find(
            (day) => day.id === termsData?.terms?.termDaysId
          ),
          modeOfPayments: termsData?.modeofPayments?.map((payment) => ({
            modeOfPaymentId: payment.id,
          })),
          creditLimit: termsData?.terms?.creditLimit,
          variableDiscount: !termsData?.variableDiscount
            ? false
            : termsData?.variableDiscount,
          fixedDiscount:
            termsData?.fixedDiscount === null
              ? {
                  discountPercentage: null,
                }
              : {
                  discountPercentage:
                    termsData?.fixedDiscount?.discountPercentage * 100,
                },
        })
      );

      // Attachments
      // API Version
      if (attachmentsData?.attachments?.length > 4) {
        setRequirementsMode("representative");
        setRepresentativeRequirements({
          signature: attachmentsData?.attachments?.find(
            (item) => item.documentType === "Signature"
          )?.documentLink,
          storePhoto: attachmentsData?.attachments?.find(
            (item) => item.documentType === "Store Photo"
          )?.documentLink,
          businessPermit: attachmentsData?.attachments?.find(
            (item) => item.documentType === "Business Permit"
          )?.documentLink,
          photoIdOwner: attachmentsData?.attachments?.find(
            (item) => item.documentType === "Photo ID Owner"
          )?.documentLink,
          photoIdRepresentative: attachmentsData?.attachments?.find(
            (item) => item.documentType === "Photo ID Representative"
          )?.documentLink,
          authorizationLetter: attachmentsData?.attachments?.find(
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
      } else if (attachmentsData?.attachments?.length <= 4) {
        setRequirementsMode("owner");
        setOwnersRequirements({
          signature: attachmentsData?.attachments?.find(
            (item) => item.documentType === "Signature"
          )?.documentLink,
          storePhoto: attachmentsData?.attachments?.find(
            (item) => item.documentType === "Store Photo"
          )?.documentLink,
          businessPermit: attachmentsData?.attachments?.find(
            (item) => item.documentType === "Business Permit"
          )?.documentLink,
          photoIdOwner: attachmentsData?.attachments?.find(
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
  }, [open, termDaysData, termsData, attachmentsData]);

  useEffect(() => {
    if (!!includeAuthorizedRepresentative) {
      setRequirementsMode("representative");
    } else if (!includeAuthorizedRepresentative) {
      setValue("authorizedRepresentative", "");
      setValue("authorizedRepresentativePosition", "");
      setRequirementsMode("owner");
    }
  }, [includeAuthorizedRepresentative]);

  useEffect(() => {
    if (!editMode && clusterData && open) {
      setValue("clusterId", clusterData?.cluster?.[0]);
    }
  }, [open, clusterData]);

  useEffect(() => {
    if (!editMode && priceModeData && open) {
      setValue(
        "priceModeId",
        priceModeData?.find(
          (item) => item.priceModeDescription?.toLowerCase() === "regular"
        )
      );
    }
  }, [open, priceModeData]);

  useEffect(() => {
    if (editMode) {
      //Triggers
      triggerTerms({ id: selectedRowData?.id }, { preferCacheValue: true });
      triggerAttachments(
        { id: selectedRowData?.id },
        { preferCacheValue: true }
      );
    }
  }, [open]);

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
        {isTermsDataLoading || isAttachmentsDataLoading ? (
          <RegisterClientFormSkeleton />
        ) : (
          <>
            {activeTab === "Personal Info" && (
              <Box className="register">
                <Box className="register__firstRow">
                  <Box className="register__firstRow__customerInformation">
                    <Typography className="register__title">
                      Customer's Information
                    </Typography>
                    <Box className="register__firstRow__customerInformation__row">
                      <Controller
                        control={control}
                        name="ownersName"
                        render={({
                          field: { onChange, onBlur, value, ref },
                        }) => (
                          <TextField
                            label="Owner's Name"
                            size="small"
                            autoComplete="off"
                            required
                            className="register__textField"
                            onChange={(e) =>
                              onChange(e.target.value.toUpperCase())
                            }
                            onBlur={onBlur}
                            value={value}
                            inputRef={ref}
                            helperText={errors?.ownersName?.message}
                            error={errors?.ownersName}
                          />
                        )}
                      />

                      <TextField
                        label="Email Address"
                        size="small"
                        autoComplete="off"
                        // required
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

                      <Controller
                        control={control}
                        name={"phoneNumber"}
                        render={({
                          field: { onChange, onBlur, value, ref },
                        }) => {
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
                                  <InputAdornment position="start">
                                    +63
                                  </InputAdornment>
                                ),
                              }}
                              className="register__textField"
                              helperText={errors?.phoneNumber?.message}
                              error={!!errors?.phoneNumber}
                            />
                          );
                        }}
                      />
                      {/* <TextField
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
                  /> */}
                    </Box>
                  </Box>
                  <Box className="register__firstRow__tinNumber">
                    <Typography className="register__title">
                      TIN Number
                    </Typography>

                    <Controller
                      control={control}
                      name={"tinNumber"}
                      render={({ field: { onChange, onBlur, value, ref } }) => {
                        const formattedValue = value.replace(/-/g, ""); // Remove existing dashes
                        // let format = "###-###-###-###";
                        let format = "###-###-###";

                        if (formattedValue.length <= 3) {
                          format = "####";
                        } else if (formattedValue.length <= 6) {
                          format = "###-####";
                        }
                        //  else if (formattedValue.length <= 9) {
                        //   format = "###-###-####";
                        // }

                        return (
                          <PatternFormat
                            format={format}
                            label="TIN Number"
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
                            // required
                            helperText={errors?.tinNumber?.message}
                            error={!!errors?.tinNumber}
                          />
                        );
                      }}
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
                          defaultValue=""
                          render={({ field }) => (
                            <TextField
                              label="Unit No."
                              size="small"
                              autoComplete="off"
                              className="register__textField"
                              {...field}
                              onChange={(e) =>
                                field.onChange(e.target.value.toUpperCase())
                              }
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
                              onChange={(e) =>
                                field.onChange(e.target.value.toUpperCase())
                              }
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
                              onChange={(e) =>
                                field.onChange(e.target.value.toUpperCase())
                              }
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
                              onChange={(e) =>
                                field.onChange(e.target.value.toUpperCase())
                              }
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
                              onChange={(e) =>
                                field.onChange(e.target.value.toUpperCase())
                              }
                              helperText={
                                errors?.ownersAddress?.province?.message
                              }
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

                    <Controller
                      control={control}
                      name="businessName"
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <TextField
                          label="Business Name"
                          size="small"
                          autoComplete="off"
                          required
                          className="register__textField"
                          onChange={(e) =>
                            onChange(e.target.value.toUpperCase())
                          }
                          onBlur={onBlur}
                          value={value}
                          inputRef={ref}
                          helperText={errors?.businessName?.message}
                          error={errors?.businessName}
                        />
                      )}
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
                          key !== "houseNumber" &&
                          key !== "streetName" &&
                          !value
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
                          onChange={(e) =>
                            onChange(e.target.value.toUpperCase())
                          }
                          onBlur={onBlur}
                          value={value}
                          inputRef={ref}
                          helperText={
                            errors?.businessAddress?.houseNumber?.message
                          }
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
                          helperText={
                            errors?.businessAddress?.streetName?.message
                          }
                          error={errors?.businessAddress?.streetName}
                          onChange={(e) =>
                            onChange(e.target.value.toUpperCase())
                          }
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
                          onChange={(e) =>
                            onChange(e.target.value.toUpperCase())
                          }
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
                          onChange={(e) =>
                            onChange(e.target.value.toUpperCase())
                          }
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
                          helperText={
                            errors?.businessAddress?.province?.message
                          }
                          error={errors?.businessAddress?.province}
                          onChange={(e) =>
                            onChange(e.target.value.toUpperCase())
                          }
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
                      getOptionLabel={(option) => option.cluster?.toUpperCase()}
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
                          error={errors?.clusterId}
                        />
                      )}
                    />
                    {/* <TextField
                  label="Cluster Type"
                  size="small"
                  autoComplete="off"
                  type="number"
                  required
                  className="register__textField"
                  {...register("cluster")}
                  helperText={errors?.cluster?.message}
                  error={errors?.cluster}
                /> */}
                  </Box>

                  <Box className="register__thirdRow__column">
                    <Typography className="register__title">
                      Price Mode
                    </Typography>

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
                          error={errors?.priceModeId}
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
                      <Controller
                        control={control}
                        name="authorizedRepresentative"
                        render={({
                          field: { onChange, onBlur, value, ref },
                        }) => (
                          <TextField
                            label="Full Name"
                            size="small"
                            autoComplete="off"
                            required={includeAuthorizedRepresentative}
                            disabled={!includeAuthorizedRepresentative}
                            className="register__textField"
                            onChange={(e) =>
                              onChange(e.target.value.toUpperCase())
                            }
                            onBlur={onBlur}
                            value={value}
                            inputRef={ref}
                            helperText={
                              errors?.authorizedRepresentative?.message
                            }
                            error={errors?.authorizedRepresentative}
                          />
                        )}
                      />

                      <Controller
                        control={control}
                        name="authorizedRepresentativePosition"
                        render={({
                          field: { onChange, onBlur, value, ref },
                        }) => (
                          <TextField
                            label="Position"
                            size="small"
                            autoComplete="off"
                            required={includeAuthorizedRepresentative}
                            disabled={!includeAuthorizedRepresentative}
                            className="register__textField"
                            onChange={(e) =>
                              onChange(e.target.value.toUpperCase())
                            }
                            onBlur={onBlur}
                            value={value}
                            inputRef={ref}
                            helperText={
                              errors?.authorizedRepresentativePosition?.message
                            }
                            error={errors?.authorizedRepresentativePosition}
                          />
                        )}
                      />

                      {/* <TextField
                    label="Full Name"
                    size="small"
                    autoComplete="off"
                    required={includeAuthorizedRepresentative}
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
                    required={includeAuthorizedRepresentative}
                    disabled={!includeAuthorizedRepresentative}
                    className="register__textField"
                    {...register("authorizedRepresentativePosition")}
                    helperText={
                      errors?.authorizedRepresentativePosition?.message
                    }
                    error={errors?.authorizedRepresentativePosition}
                  /> */}
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
                <SuccessButton
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
                </SuccessButton>
              )}
              {activeTab === "Attachments" && (
                <SuccessButton
                  onClick={onConfirmOpen}
                  disabled={navigators.some((obj) => obj.isValid === false)}
                >
                  {editMode ? "Update" : "Register"}
                </SuccessButton>
              )}
            </Box>
          </>
        )}
      </CommonDrawer>

      {/* <PinLocationModal
        latitude={latitude}
        setLatitude={setLatitude}
        longitude={longitude}
        setLongitude={setLongitude}
        open={isPinLocationOpen}
        onClose={onPinLocationClose}
      /> */}

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
    </>
  );
}

export default DirectRegisterForm;
