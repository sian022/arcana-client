import {
  Autocomplete,
  Box,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
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
import { Cancel } from "@mui/icons-material";

function TermsAndConditions({ direct, editMode }) {
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();

  const termsAndConditions = useSelector(
    (state) => state.regularRegistration.value.termsAndConditions
  );
  const freebiesDirect = useSelector(
    (state) => state.regularRegistration.value.freebies
  );

  //Disclosures
  const {
    isOpen: isFreebieFormOpen,
    onOpen: onFreebieFormOpen,
    onClose: onFreebieFormClose,
  } = useDisclosure();

  //RTK Query
  const { data: termDaysData, isLoading: isTermDaysLoading } =
    useGetAllTermDaysQuery({ Status: true });

  const handleFixedDiscountChange = (e) => {
    const parsedValue =
      e.target.value !== "" ? parseInt(e.target.value) : e.target.value;
    if (
      (parsedValue < 0 || parsedValue > 10) &&
      parsedValue !== "" &&
      parsedValue !== null
    ) {
      showSnackbar("Value must be between 0% and 10%", "error");
      return;
    }
    dispatch(
      setTermsAndConditions({
        property: "fixedDiscounts",
        value: { discountPercentage: parsedValue === "" ? null : parsedValue },
      })
    );
  };

  const handleCreditLimitChange = (e) => {
    const parsedValue =
      e.target.value !== "" ? parseInt(e.target.value) : e.target.value;
    dispatch(
      setTermsAndConditions({
        property: "creditLimit",
        value: parsedValue === "" ? null : parsedValue,
      })
    );
  };

  // const handleFixedDiscountChange = (e) => {
  //   if (e.target.value < 0 || e.target.value > 10) {
  //     showSnackbar("Maximum of 10% only", "error");
  //     return;
  //   }
  //   dispatch(
  //     setTermsAndConditions({
  //       property: "fixedDiscounts",
  //       value: {
  //         discountPercentage: parseInt(e.target.value),
  //       },
  //     })
  //   );
  // };

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
          property: "fixedDiscounts",
          value: { discountPercentage: null },
        })
      );
    }
  }, [termsAndConditions["terms"], termsAndConditions["variableDiscount"]]);

  return (
    <Box className="terms">
      <Box className="terms__column">
        <Box className="terms__column__item">
          <Box className="terms__column__item__title">
            <Typography>Freezer</Typography>
          </Box>
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
            <FormControlLabel value={true} control={<Radio />} label="Yes" />
            <FormControlLabel value={false} control={<Radio />} label="No" />
          </RadioGroup>
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
              control={<Radio />}
              label="Dealer"
            />
            <FormControlLabel
              value="Retailer"
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
                    console.log(value);
                    dispatch(
                      setTermsAndConditions({
                        property: "termDaysId",
                        value: value?.id,
                        value,
                      })
                    );
                  }}
                />
                // <TextField
                //   sx={{
                //     width: "100px",
                //     position: "absolute",
                //     right: "-65px",
                //     "& .MuiInputBase-root": {
                //       height: "30px",
                //     },
                //   }}
                //   className="terms__select"
                //   defaultValue={termsAndConditions["termDaysId"] ?? ""}
                //   select
                //   label="Term Days"
                //   value={termsAndConditions["termDaysId"] ?? ""}
                //   onChange={(e) => {
                //     dispatch(
                //       setTermsAndConditions({
                //         property: "termDaysId",
                //         value: e.target.value,
                //       })
                //     );
                //   }}
                //   InputLabelProps={{ shrink: true }}
                // >
                //   {termDaysData?.termDays?.map((item) => (
                //     <MenuItem key={item.days} value={item.days}>
                //       {item.days}
                //     </MenuItem>
                //   ))}
                // </TextField>
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
                //  && termDaysData
                <>
                  <TextField
                    className="termsAndConditionsCreditLimit"
                    sx={{
                      width: "120px",
                      // position: "absolute",
                      // right: "30px",
                      "& .MuiInputBase-root": {
                        height: "30px",
                      },
                    }}
                    type="number"
                    value={
                      termsAndConditions["creditLimit"] != null
                        ? termsAndConditions["creditLimit"].toString()
                        : ""
                    }
                    onChange={(e) => {
                      // dispatch(
                      //   setTermsAndConditions({
                      //     property: "creditLimit",
                      //     value: parseInt(e.target.value) ?? 0,
                      //   })
                      // );
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
                      console.log(value);
                      dispatch(
                        setTermsAndConditions({
                          property: "termDaysId",
                          value: value?.id,
                          value,
                        })
                      );
                    }}
                  />
                  {/* <TextField
                    sx={{
                      width: "100px",
                      position: "absolute",
                      right: "-80px",
                      "& .MuiInputBase-root": {
                        height: "30px",
                      },
                    }}
                    defaultValue={termsAndConditions["termDaysId"] ?? ""}
                    select
                    label="Term Days"
                    value={termsAndConditions["termDaysId"] ?? ""}
                    onChange={(e) => {
                      dispatch(
                        setTermsAndConditions({
                          property: "termDaysId",
                          value: e.target.value,
                        })
                      );
                    }}
                    InputLabelProps={{ shrink: true }}
                  >
                    {termDaysData?.termDays?.map((item) => (
                      <MenuItem key={item.days} value={item.days}>
                        {item.days}
                      </MenuItem>
                    ))}
                  </TextField> */}
                </>
              )}
            </Box>
          </RadioGroup>
        </Box>

        <Box className="terms__column__item">
          <Box className="terms__column__item__title">
            <Typography>Mode of Payment</Typography>
          </Box>
          <RadioGroup
            row
            className="terms__column__item__choices"
            value={termsAndConditions["modeOfPayment"]}
            onChange={(e) => {
              dispatch(
                setTermsAndConditions({
                  property: "modeOfPayment",
                  value: parseInt(e.target.value),
                })
              );
            }}
          >
            <FormControlLabel value={1} control={<Radio />} label="Cash" />
            <FormControlLabel
              value={2}
              control={<Radio />}
              label="Online/Check"
            />
          </RadioGroup>
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
              <Box
                className="termsAndConditionsFixedDiscount"
                // sx={{
                //   display: "flex",
                //   alignItems: "center",
                //   gap: "5px",
                //   position: "absolute",
                //   right: "-35px",
                // }}
              >
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
                    termsAndConditions["fixedDiscounts"].discountPercentage !=
                    null
                      ? termsAndConditions[
                          "fixedDiscounts"
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
            <SecondaryButton medium onClick={onFreebieFormOpen}>
              Request Freebie
            </SecondaryButton>{" "}
            {freebiesDirect?.length > 0 && (
              <IconButton
                className="termsAndConditionsCancelFreebies"
                // sx={{
                //   color: "error.main",
                //   position: "absolute",
                //   right: "85px",
                //   top: "408px",
                // }}
                onClick={() => {
                  dispatch(resetFreebies());
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
      </Box>
    </Box>
  );
}

export default TermsAndConditions;
