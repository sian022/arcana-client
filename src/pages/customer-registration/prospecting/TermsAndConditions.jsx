import { Box, Radio, TextField, Typography } from "@mui/material";
import React from "react";

function TermsAndConditions() {
  return (
    <Box className="terms">
      <Box className="terms__column">
        <Box className="terms__column__item">
          <Box className="terms__column__item__title">
            <Typography>Freezer</Typography>
          </Box>
          <Box className="terms__column__item__choices">
            <Box className="terms__column__item__choices__choice">
              <Radio name="freezer" />
              <Typography>Yes</Typography>
            </Box>
            <Box className="terms__column__item__choices__choice">
              <Radio name="freezer" />
              <Typography>No</Typography>
            </Box>
          </Box>
        </Box>
        <Box className="terms__column__item">
          <Box className="terms__column__item__title">
            <Typography>Type of Customer</Typography>
          </Box>
          <Box className="terms__column__item__choices">
            <Box className="terms__column__item__choices__choice">
              <Radio />
              <Typography>Dealer</Typography>
            </Box>
            <Box className="terms__column__item__choices__choice">
              <Radio />
              <Typography>Retailer</Typography>
            </Box>
          </Box>
        </Box>
        <Box className="terms__column__item">
          <Box className="terms__column__item__title">
            <Typography>Type of Customer</Typography>
          </Box>
          <Box className="terms__column__item__choices">
            <Box className="terms__column__item__choices__choice">
              <Radio />
              <Typography>Dealer</Typography>
            </Box>
            <Box className="terms__column__item__choices__choice">
              <Radio />
              <Typography>Retailer</Typography>
            </Box>
          </Box>
        </Box>

        <Box className="terms__column__item">
          <Box className="terms__column__item__title">
            <Typography>Direct Delivery</Typography>
          </Box>
          <Box className="terms__column__item__choices">
            <Box className="terms__column__item__choices__choice">
              <Radio />
              <Typography>Yes</Typography>
            </Box>
            <Box className="terms__column__item__choices__choice">
              <Radio />
              <Typography>No</Typography>
            </Box>
          </Box>
        </Box>

        <Box className="terms__column__item">
          <Box className="terms__column__item__title">
            <Typography>Booking Coverage</Typography>
          </Box>
          <Box className="terms__column__item__choices">
            <Box className="terms__column__item__choices__choice">
              <Radio />
              <Typography>Yes</Typography>
            </Box>
            <Box className="terms__column__item__choices__choice">
              <Radio />
              <Typography>No</Typography>
            </Box>
            <Box className="terms__column__item__choices__choice">
              <Radio />
              <Typography>Yes</Typography>
            </Box>
            <Box className="terms__column__item__choices__choice">
              <Radio />
              <Typography>No</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box className="terms__column">
        <Box className="terms__column__item">
          <Box className="terms__column__item__title">
            <Typography>Terms</Typography>
          </Box>
          <Box className="terms__column__item__choices">
            <Box className="terms__column__item__choices__choice">
              <Radio />
              <Typography>COD</Typography>
            </Box>
            <Box className="terms__column__item__choices__choice">
              <Radio />
              <Typography>1 up 1 down</Typography>
            </Box>
          </Box>
          <Box className="terms__column__item__choices">
            <Box className="terms__column__item__choices__choice">
              <Radio />
              <Typography>Credit Limit</Typography>
              <TextField size="small" sx={{ ml: "10px" }} />
            </Box>
            {/* <Box className="terms__column__item__choices__choice">
              <Radio />
              <Typography>1 up 1 down</Typography>
            </Box> */}
          </Box>
        </Box>

        <Box className="terms__column__item">
          <Box className="terms__column__item__title">
            <Typography>Mode of Payment</Typography>
          </Box>
          <Box className="terms__column__item__choices">
            <Box className="terms__column__item__choices__choice">
              <Radio />
              <Typography>Cash</Typography>
            </Box>
            <Box className="terms__column__item__choices__choice">
              <Radio />
              <Typography>Online/Check</Typography>
            </Box>
          </Box>
        </Box>

        <Box className="terms__column__item">
          <Box className="terms__column__item__title">
            <Typography>Discount</Typography>
          </Box>
          <Box className="terms__column__item__choices">
            <Box className="terms__column__item__choices__choice">
              <Radio />
              <Typography>Variable</Typography>
            </Box>
            <Box className="terms__column__item__choices__choice">
              <Radio />
              <Typography>Fixed</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default TermsAndConditions;
