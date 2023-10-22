import {
  Box,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTermsAndConditions } from "../../../features/registration/reducers/regularRegistrationSlice";

function TermsAndConditions() {
  const dispatch = useDispatch();

  const termsAndConditions = useSelector(
    (state) => state.regularRegistration.value.termsAndConditions
  );

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
                  value: e.target.value,
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
                  value: e.target.value,
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
            value={termsAndConditions["bookingCoverage"]}
            onChange={(e) => {
              dispatch(
                setTermsAndConditions({
                  property: "bookingCoverage",
                  value: e.target.value,
                })
              );
            }}
          >
            <FormControlLabel value="F1" control={<Radio />} label="F1" />
            <FormControlLabel value="F2" control={<Radio />} label="F2" />
            <FormControlLabel value="F3" control={<Radio />} label="F3" />
            <FormControlLabel value="F4" control={<Radio />} label="F4" />
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
                  value: e.target.value,
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
              {termsAndConditions["terms"] === "2" && (
                <TextField
                  sx={{
                    width: "100px",
                    position: "absolute",
                    right: "-65px",
                    "& .MuiInputBase-root": {
                      height: "30px",
                    },
                  }}
                  defaultValue={termsAndConditions["termDays"]}
                  select
                  label="Term Days"
                  value={termsAndConditions["termdays"]}
                  onChange={(e) => {
                    dispatch(
                      setTermsAndConditions({
                        property: "termDays",
                        value: e.target.value,
                      })
                    );
                  }}
                >
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                  <MenuItem value={30}>30</MenuItem>
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

              {termsAndConditions["terms"] === "3" && (
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
                          value: e.target.value,
                        })
                      );
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
                    value={termsAndConditions["termdays"]}
                    onChange={(e) => {
                      dispatch(
                        setTermsAndConditions({
                          property: "termDays",
                          value: e.target.value,
                        })
                      );
                    }}
                  >
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={30}>30</MenuItem>
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
                  value: e.target.value,
                })
              );
            }}
          >
            <FormControlLabel value="Cash" control={<Radio />} label="Cash" />
            <FormControlLabel
              value="Online/Check"
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
            value={termsAndConditions["discount"]}
            onChange={(e) => {
              dispatch(
                setTermsAndConditions({
                  property: "discount",
                  value: e.target.value,
                })
              );
            }}
          >
            <FormControlLabel
              value="Variable"
              control={<Radio />}
              label="Variable"
            />
            <FormControlLabel value="Fixed" control={<Radio />} label="Fixed" />
          </RadioGroup>
        </Box>
      </Box>
    </Box>
  );
}

export default TermsAndConditions;
