import {
  Autocomplete,
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetFreebies,
  setTermsAndConditions,
} from "../../../features/registration/reducers/regularRegistrationSlice";
import { useGetAllTermDaysQuery } from "../../../features/setup/api/termDaysApi";
import useSnackbar from "../../../hooks/useSnackbar";
import SecondaryButton from "../../../components/SecondaryButton";
import useDisclosure from "../../../hooks/useDisclosure";
import FreebieForm from "./FreebieForm";
import { Cancel, Edit } from "@mui/icons-material";
import { DirectReleaseContext } from "../../../context/DirectReleaseContext";
import { NumericFormat } from "react-number-format";
import FreezerAssetTagModal from "../../../components/modals/registration/FreezerAssetTagModal";
import SignatureCanvasModal from "../../../components/modals/SignatureCanvasModal";
import { AttachmentsContext } from "../../../context/AttachmentsContext";
import { base64ToBlob } from "../../../utils/CustomFunctions";

function TermsAndConditions({ direct, editMode, storeType }) {
  const dispatch = useDispatch();
  const snackbar = useSnackbar();

  const termsAndConditions = useSelector(
    (state) => state.regularRegistration.value.termsAndConditions
  );

  const freebiesDirect = useSelector(
    (state) => state.regularRegistration.value.directFreebie.freebies
  );

  const { setPhotoProofDirect, setSignatureDirect } =
    useContext(DirectReleaseContext);

  const {
    requirementsMode,
    ownersRequirements,
    representativeRequirements,
    setOwnersRequirements,
    setRepresentativeRequirements,
    // representativeRequirementsIsLink,
    // ownersRequirementsIsLink,
  } = useContext(AttachmentsContext);

  const requirementsModeToSelect =
    requirementsMode === "owner"
      ? ownersRequirements
      : representativeRequirements;

  //Disclosures
  const {
    isOpen: isFreebieFormOpen,
    onOpen: onFreebieFormOpen,
    onClose: onFreebieFormClose,
  } = useDisclosure();

  const {
    isOpen: isAssetTagOpen,
    onOpen: onAssetTagOpen,
    onClose: onAssetTagClose,
  } = useDisclosure();

  const {
    isOpen: isCanvasOpen,
    onOpen: onCanvasOpen,
    onClose: onCanvasClose,
  } = useDisclosure();

  //RTK Query
  const { data: termDaysData, isLoading: isTermDaysLoading } =
    useGetAllTermDaysQuery({ Status: true });

  const handleFixedDiscountChange = (e) => {
    let parsedValue =
      e.target.value !== "" ? parseFloat(e.target.value) : e.target.value;

    if (
      (parsedValue < 1 || parsedValue > 10) &&
      parsedValue !== "" &&
      parsedValue !== null
    ) {
      snackbar({
        message: "Value must be between 1% and 10%",
        variant: "error",
      });
      return;
    }

    dispatch(
      setTermsAndConditions({
        property: "fixedDiscount",
        value: { discountPercentage: parsedValue === "" ? null : parsedValue },
      })
    );
  };

  const handleCreditLimitChange = (e) => {
    const parsedValue =
      // e.target.value !== "" ? parseInt(e.target.value) : e.target.value;
      e.value !== "" ? parseInt(e.value) : e.value;
    dispatch(
      setTermsAndConditions({
        property: "creditLimit",
        value: parsedValue === "" ? null : parsedValue,
      })
    );
  };

  const handleSetSignature = (signature) => {
    if (requirementsMode === "owner") {
      setOwnersRequirements((prev) => ({
        ...prev,
        signature: signature,
      }));
    } else if (requirementsMode === "representative") {
      setRepresentativeRequirements((prev) => ({
        ...prev,
        signature: signature,
      }));
    }
  };

  useEffect(() => {
    if (termsAndConditions["terms"] !== 3) {
      dispatch(setTermsAndConditions({ property: "creditLimit", value: null }));
    }

    if (
      termsAndConditions["terms"] !== 2 &&
      termsAndConditions["terms"] !== 3
    ) {
      dispatch(setTermsAndConditions({ property: "termDaysId", value: null }));
    }

    if (termsAndConditions["variableDiscount"] === true) {
      dispatch(
        setTermsAndConditions({
          property: "fixedDiscount",
          value: { discountPercentage: null },
        })
      );
    }
  }, [
    termsAndConditions["terms"],
    termsAndConditions["variableDiscount"],
    dispatch,
  ]);

  useEffect(() => {
    if (storeType) {
      dispatch(
        setTermsAndConditions({
          property: "typeOfCustomer",
          value: storeType === "Dealer" ? "Dealer" : "Retailer",
        })
      );
    }
  }, [dispatch, storeType]);

  const handleCheckboxChange = (modeOfPaymentId) => {
    // Check if the modeOfPaymentId is already in the array
    const isSelected = termsAndConditions?.modeOfPayments?.some(
      (item) => item.modeOfPaymentId === modeOfPaymentId
    );

    // Dispatch the action to update the Redux state
    dispatch(
      setTermsAndConditions({
        property: "modeOfPayments",
        value: isSelected
          ? termsAndConditions.modeOfPayments.filter(
              (item) => item.modeOfPaymentId !== modeOfPaymentId
            )
          : [...termsAndConditions.modeOfPayments, { modeOfPaymentId }],
      })
    );
  };

  useEffect(() => {
    if (termsAndConditions["terms"] === 1) {
      dispatch(
        setTermsAndConditions({
          property: "modeOfPayments",
          value: termsAndConditions.modeOfPayments.filter(
            (item) => item.modeOfPaymentId !== 2
          ),
        })
      );
    }
  }, [termsAndConditions["terms"]]);

  useEffect(() => {
    if (!termsAndConditions["freezer"]) {
      dispatch(
        setTermsAndConditions({ property: "freezerAssetTag", value: "" })
      );
    }
  }, [termsAndConditions["freezer"], dispatch]);

  // useEffect(() => {
  //   if (termsAndConditions["freezer"]) {
  //     onAssetTagOpen();
  //   }
  // }, [termsAndConditions["freezer"]]);

  // const handleViewSignature = (type) => {
  //   let convertedSignature;

  //   if (type === "owner") {
  //     if (!ownersRequirementsIsLink["signature"]) {
  //       convertedSignature = base64ToBlob(ownersRequirements["signature"]);
  //     } else {
  //       convertedSignature = ownersRequirementsIsLink["signature"];
  //     }
  //   } else if (type === "representative") {
  //     if (!representativeRequirementsIsLink["signature"]) {
  //       convertedSignature = base64ToBlob(
  //         representativeRequirements["signature"]
  //       );
  //     } else {
  //       convertedSignature = representativeRequirementsIsLink["signature"];
  //     }
  //   }

  //   return convertedSignature;
  // };

  const handleViewSignature = (type) => {
    let signature;

    if (type === "owner") {
      signature = ownersRequirements["signature"];
    } else if (type === "representative") {
      signature = representativeRequirements["signature"];
    }

    return signature.startsWith("data:")
      ? URL.createObjectURL(base64ToBlob(signature))
      : signature;
  };

  console.log(ownersRequirements, "ownersRequirements");

  return (
    <Box className="terms">
      <Box className="terms__column">
        <Box className="terms__column__item">
          <Box className="terms__column__item__title">
            <Typography>Freezer</Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            <RadioGroup
              row
              className="terms__column__item__choices"
              value={termsAndConditions["freezer"]}
              onChange={(e) => {
                dispatch(
                  setTermsAndConditions({
                    property: "freezer",
                    value: e.target.value === "true" ? true : false,
                  })
                );
              }}
            >
              <FormControlLabel
                value={true}
                control={
                  <Radio
                    onClick={() => {
                      // if (termsAndConditions["freezer"]) {
                      onAssetTagOpen();
                      // }
                    }}
                  />
                }
                label="Yes"
              />
              <FormControlLabel value={false} control={<Radio />} label="No" />
            </RadioGroup>
          </Box>

          {/* {termsAndConditions["freezer"] && (
            <TextField
              label="Asset Tag"
              type="number"
              onChange={(e) =>
                dispatch(
                  setTermsAndConditions({
                    property: "freezerAssetTag",
                    value: e.target.value,
                  })
                )
              }
              value={termsAndConditions["freezerAssetTag"]}
              required
              sx={{
                right: "6px",
                margin: "auto",
                width: "200px",
                "& .MuiInputBase-root": {
                  height: "30px",
                },
                "& .MuiInputLabel-outlined ": {
                  padding: ".3rem !important",
                  transform: "translate(6px, -1px)  !important",
                },
                "& .MuiInputLabel-shrink ": {
                  padding: ".3rem !important",
                  transform: "translate(9px, -14px) scale(0.8) !important",
                },
              }}
            />
          )} */}
        </Box>
        <Box className="terms__column__item">
          <Box className="terms__column__item__title">
            <Typography>Type of Customer</Typography>
          </Box>
          <RadioGroup
            row
            className="terms__column__item__choices"
            value={termsAndConditions["typeOfCustomer"]}
            onChange={(e) => {
              dispatch(
                setTermsAndConditions({
                  property: "typeOfCustomer",
                  value: e.target.value,
                })
              );
            }}
          >
            <FormControlLabel
              value="Dealer"
              disabled
              control={<Radio />}
              label="Dealer"
            />
            <FormControlLabel
              value="Retailer"
              disabled
              control={<Radio />}
              label="Retailer"
            />
          </RadioGroup>
        </Box>

        <Box className="terms__column__item">
          <Box className="terms__column__item__title">
            <Typography>Direct Delivery</Typography>
          </Box>
          <RadioGroup
            row
            className="terms__column__item__choices"
            value={termsAndConditions["directDelivery"]}
            onChange={(e) => {
              dispatch(
                setTermsAndConditions({
                  property: "directDelivery",
                  value: e.target.value === "true" ? true : false,
                })
              );
            }}
          >
            <FormControlLabel value={true} control={<Radio />} label="Yes" />
            <FormControlLabel value={false} control={<Radio />} label="No" />
          </RadioGroup>
        </Box>

        <Box className="terms__column__item">
          <Box className="terms__column__item__title">
            <Typography>Booking Coverage</Typography>
          </Box>
          <RadioGroup
            row
            className="terms__column__item__choices"
            value={termsAndConditions["bookingCoverageId"]}
            onChange={(e) => {
              dispatch(
                setTermsAndConditions({
                  property: "bookingCoverageId",
                  value: parseInt(e.target.value),
                })
              );
            }}
          >
            <FormControlLabel value={1} control={<Radio />} label="F1" />
            <FormControlLabel value={2} control={<Radio />} label="F2" />
            <FormControlLabel value={3} control={<Radio />} label="F3" />
            <FormControlLabel value={4} control={<Radio />} label="F4" />
          </RadioGroup>
        </Box>
      </Box>

      <Box className="terms__column">
        <Box className="terms__column__item">
          <Box className="terms__column__item__title">
            <Typography>Terms</Typography>
          </Box>
          <RadioGroup
            value={termsAndConditions["terms"]}
            onChange={(e) => {
              dispatch(
                setTermsAndConditions({
                  property: "terms",
                  value: parseInt(e.target.value),
                })
              );
            }}
          >
            <Box className="terms__column__item__choices">
              <FormControlLabel value={1} control={<Radio />} label="COD" />
              <FormControlLabel
                value={2}
                control={<Radio />}
                label="1 up 1 down"
              />
              {termsAndConditions["terms"] === 2 && (
                // && termDaysData
                <Autocomplete
                  selectOnFocus
                  clearOnBlur
                  handleHomeEndKeys
                  options={termDaysData?.termDays ?? []}
                  loading={isTermDaysLoading}
                  getOptionLabel={(option) => option.days?.toString() ?? ""}
                  isOptionEqualToValue={() => true}
                  disableClearable
                  value={termsAndConditions["termDaysId"] ?? ""}
                  defaultValue={termsAndConditions["termDaysId"] ?? ""}
                  className="termsAndConditionsFirstSelect"
                  sx={{
                    width: "100px",
                    // position: "absolute",
                    // right: "-65px",
                    // top: "10px",
                    "& .MuiInputBase-root": {
                      height: "30px",
                    },
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      className="terms__select"
                      label="Term Days"
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        "& input": {
                          height: 0,
                        },
                      }}
                    />
                  )}
                  onChange={(_, value) => {
                    dispatch(
                      setTermsAndConditions({
                        property: "termDaysId",
                        value,
                      })
                    );
                  }}
                />
              )}
            </Box>

            <Box className="terms__column__item__choicesNoSpace">
              <FormControlLabel
                className="terms__column__item__choicesNoSpace__creditLimit"
                // sx={{ ml: "28px" }}
                value={3}
                control={<Radio />}
                label="Credit Limit"
              />

              {termsAndConditions["terms"] === 3 && (
                <>
                  <NumericFormat
                    className="termsAndConditionsCreditLimit"
                    customInput={TextField}
                    sx={{
                      width: "120px",
                      "& .MuiInputBase-root": {
                        height: "30px",
                      },
                    }}
                    type="text"
                    value={
                      termsAndConditions["creditLimit"] != null
                        ? termsAndConditions["creditLimit"].toString()
                        : ""
                    }
                    onValueChange={(e) => {
                      handleCreditLimitChange(e);
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment
                          position="start"
                          style={{ marginLeft: -3 }}
                        >
                          ₱
                        </InputAdornment>
                      ),
                    }}
                    thousandSeparator=","
                  />

                  <Autocomplete
                    selectOnFocus
                    clearOnBlur
                    handleHomeEndKeys
                    options={termDaysData?.termDays ?? []}
                    isOptionEqualToValue={() => true}
                    loading={isTermDaysLoading}
                    getOptionLabel={(option) => option.days?.toString() ?? ""}
                    disableClearable
                    value={termsAndConditions["termDaysId"] ?? ""}
                    defaultValue={termsAndConditions["termDaysId"] ?? ""}
                    className="termsAndConditionsSecondSelect"
                    sx={{
                      width: "100px",
                      position: "absolute",
                      right: "-80px",
                      top: "6px",
                      "& .MuiInputBase-root": {
                        height: "30px",
                      },
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        className="terms__select"
                        label="Term Days"
                        InputLabelProps={{ shrink: true }}
                        sx={{
                          "& input": {
                            height: 0,
                          },
                        }}
                      />
                    )}
                    onChange={(_, value) => {
                      dispatch(
                        setTermsAndConditions({
                          property: "termDaysId",
                          value,
                        })
                      );
                    }}
                  />
                </>
              )}
            </Box>
          </RadioGroup>
        </Box>

        <Box className="terms__column__item">
          <Box className="terms__column__item__title">
            <Typography>Mode of Payment</Typography>
          </Box>

          <FormGroup
            row
            className="terms__column__item__choices"
            sx={{ marginY: "10px" }}
          >
            <FormControlLabel
              control={<Checkbox sx={{ marginRight: "10px" }} />}
              value={1}
              label="Cash"
              checked={termsAndConditions["modeOfPayments"]?.some(
                (item) => item.modeOfPaymentId === 1
              )}
              onChange={() => {
                handleCheckboxChange(1);
              }}
            />

            <FormControlLabel
              value={2}
              control={<Checkbox sx={{ marginRight: "10px" }} />}
              label="Cheque"
              checked={termsAndConditions["modeOfPayments"]?.some(
                (item) => item.modeOfPaymentId === 2
              )}
              onChange={() => {
                handleCheckboxChange(2);
              }}
              disabled={termsAndConditions["terms"] === 1}
            />

            <FormControlLabel
              control={<Checkbox sx={{ marginRight: "10px" }} />}
              value={3}
              label="Online"
              checked={termsAndConditions["modeOfPayments"]?.some(
                (item) => item.modeOfPaymentId === 3
              )}
              onChange={() => {
                handleCheckboxChange(3);
              }}
            />
          </FormGroup>
        </Box>

        <Box className="terms__column__item">
          <Box className="terms__column__item__title">
            <Typography>Discount</Typography>
          </Box>
          <RadioGroup
            row
            className="terms__column__item__choices"
            value={termsAndConditions["variableDiscount"]}
            onChange={(e) => {
              dispatch(
                setTermsAndConditions({
                  property: "variableDiscount",
                  value: e.target.value === "true" ? true : false,
                })
              );
            }}
          >
            <FormControlLabel
              value={true}
              control={<Radio />}
              label="Variable"
            />
            <FormControlLabel value={false} control={<Radio />} label="Fixed" />

            {termsAndConditions["variableDiscount"] === false && (
              <Box className="termsAndConditionsFixedDiscount">
                <TextField
                  sx={{
                    width: "70px",
                    // position: "absolute",
                    // right: "-25px",
                    "& .MuiInputBase-root": {
                      height: "30px",
                    },
                  }}
                  type="number"
                  value={
                    termsAndConditions["fixedDiscount"].discountPercentage !=
                    null
                      ? termsAndConditions[
                          "fixedDiscount"
                        ].discountPercentage.toString()
                      : ""
                  }
                  onChange={(e) => {
                    handleFixedDiscountChange(e);
                  }}
                  InputProps={{
                    inputProps: { min: 0, max: 10 },
                  }}
                />
                {"%"}
              </Box>
            )}
          </RadioGroup>
        </Box>

        {direct && !editMode && (
          <>
            <SecondaryButton
              medium
              onClick={onFreebieFormOpen}
              variant="outlined"
            >
              Request Freebie
            </SecondaryButton>{" "}
            {freebiesDirect?.length > 0 && (
              <IconButton
                className="termsAndConditionsCancelFreebies"
                onClick={() => {
                  dispatch(resetFreebies());
                  setSignatureDirect(null);
                  setPhotoProofDirect(null);
                }}
              >
                <Cancel sx={{ fontSize: "30px" }} />
              </IconButton>
            )}
          </>
        )}

        {direct && (
          <FreebieForm
            isFreebieFormOpen={isFreebieFormOpen}
            onFreebieFormClose={onFreebieFormClose}
            direct
          />
        )}

        <Box onClick={onCanvasOpen}>
          <Box
            sx={{
              display: "flex",
              mt: direct ? "40px" : "60px",
              cursor: "pointer",
            }}
          >
            {requirementsModeToSelect["signature"] ? (
              <Box className="attachments__viewModal__signature">
                <img
                  src={
                    requirementsMode === "owner"
                      ? handleViewSignature("owner")
                      : handleViewSignature("representative")
                  }
                  // src={
                  //   requirementsMode === "owner"
                  //     ? ownersRequirementsIsLink["signature"]
                  //       ? handleViewSignature("owner")
                  //       : URL.createObjectURL(handleViewSignature("owner"))
                  //     : representativeRequirementsIsLink["signature"]
                  //     ? handleViewSignature("representative")
                  //     : URL.createObjectURL(
                  //         handleViewSignature("representative")
                  //       )
                  // }
                  alt="File preview"
                  style={{ borderRadius: "12px" }}
                />
              </Box>
            ) : (
              <SecondaryButton fullWidth size="medium" endIcon={<Edit />}>
                Sign here
              </SecondaryButton>
            )}
          </Box>
        </Box>

        <FreezerAssetTagModal open={isAssetTagOpen} onClose={onAssetTagClose} />

        <SignatureCanvasModal
          open={isCanvasOpen}
          onClose={onCanvasClose}
          setSignature={handleSetSignature}
          signature={ownersRequirements["signature"]}
        />
      </Box>
    </Box>
  );
}

export default TermsAndConditions;
