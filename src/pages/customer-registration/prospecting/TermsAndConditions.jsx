import {
  Box,
  FormControlLabel,
  InputAdornment,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTermsAndConditions } from "../../../features/registration/reducers/regularRegistrationSlice";
import { useGetAllTermDaysQuery } from "../../../features/setup/api/termDaysApi";

function TermsAndConditions() {
  const dispatch = useDispatch();

  const termsAndConditions = useSelector(
    (state) => state.regularRegistration.value.termsAndConditions
  );

  const { data: termDaysData } = useGetAllTermDaysQuery({ Status: true });

  console.log("termsAndConditions", termsAndConditions);

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
                <TextField
                  sx={{
                    width: "100px",
                    position: "absolute",
                    right: "-65px",
                    "& .MuiInputBase-root": {
                      height: "30px",
                    },
                  }}
                  className="terms__select"
                  defaultValue={termsAndConditions["termDays"]}
                  select
                  label="Term Days"
                  value={termsAndConditions["termDaysId"]}
                  onChange={(e) => {
                    dispatch(
                      setTermsAndConditions({
                        property: "termDaysId",
                        value: e.target.value,
                      })
                    );
                  }}
                >
                  {termDaysData?.termDays?.map((item) => (
                    <MenuItem key={item.days} value={item.days}>
                      {item.days}
                    </MenuItem>
                  ))}
                  {/* <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                  <MenuItem value={30}>30</MenuItem> */}
                </TextField>
              )}
            </Box>

            <Box className="terms__column__item__choicesNoSpace">
              <FormControlLabel
                sx={{ ml: "28px" }}
                value={3}
                control={<Radio />}
                label="Credit Limit"
              />

              {termsAndConditions["terms"] === 3 && (
                <>
                  <TextField
                    sx={{
                      width: "120px",
                      position: "absolute",
                      right: "30px",
                      "& .MuiInputBase-root": {
                        height: "30px",
                      },
                    }}
                    value={termsAndConditions["creditLimit"]}
                    onChange={(e) => {
                      dispatch(
                        setTermsAndConditions({
                          property: "creditLimit",
                          value: parseInt(e.target.value),
                        })
                      );
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
                  <TextField
                    sx={{
                      width: "100px",
                      position: "absolute",
                      right: "-80px",
                      "& .MuiInputBase-root": {
                        height: "30px",
                      },
                    }}
                    defaultValue={termsAndConditions["termDays"]}
                    select
                    label="Term Days"
                    value={termsAndConditions["termDaysId"]}
                    onChange={(e) => {
                      dispatch(
                        setTermsAndConditions({
                          property: "termDaysId",
                          value: e.target.value,
                        })
                      );
                    }}
                  >
                    {termDaysData?.termDays?.map((item) => (
                      <MenuItem key={item.days} value={item.days}>
                        {item.days}
                      </MenuItem>
                    ))}
                  </TextField>
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
              <TextField
                sx={{
                  width: "60px",
                  position: "absolute",
                  right: "-15px",
                  "& .MuiInputBase-root": {
                    height: "30px",
                  },
                }}
                type="number"
                value={termsAndConditions["fixedDiscounts"].discountPercentage}
                onChange={(e) => {
                  dispatch(
                    setTermsAndConditions({
                      property: "fixedDiscounts",
                      value: { discountPercentage: parseInt(e.target.value) },
                    })
                  );
                }}
                // InputProps={{
                //   inputProps: { min: 1, max: 10 },
                // }}
              />
            )}
          </RadioGroup>
        </Box>
      </Box>
    </Box>
  );
}

export default TermsAndConditions;
