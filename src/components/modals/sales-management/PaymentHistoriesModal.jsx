import { Box, Typography } from "@mui/material";
import CommonModal from "../../CommonModal";

function PaymentHistoriesModal({ ...props }) {
  return (
    <CommonModal {...props} closeTopRight>
      <Box className="paymentHistoriesModal">
        <Typography className="paymentHistoriesModal__title">
          Payment Histories
        </Typography>
      </Box>
    </CommonModal>
  );
}

export default PaymentHistoriesModal;
