import {
  Box,
  IconButton,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import CommonModal from "../../CommonModal";
import moment from "moment";
import { KeyboardArrowDown } from "@mui/icons-material";

function PaymentHistoriesModal({ ...props }) {
  return (
    <CommonModal {...props} closeTopRight>
      <Box className="paymentHistoriesModal">
        <Typography className="paymentHistoriesModal__title">
          Payment Histories
        </Typography>

        <Box className="paymentHistoriesModal__body">
          <Stepper orientation="vertical">
            <Step active expanded>
              <StepLabel StepIconProps={{ icon: "" }}>
                <span style={{ fontWeight: "600", marginRight: "5px" }}>
                  {moment("2024-03-10T10:00:33").format("MMMM D, YYYY")}
                </span>

                <span>{moment("2024-03-10T10:00:33").format("H:mm a")}</span>
              </StepLabel>

              <StepContent>
                Total: ₱200,000.00{" "}
                <IconButton>
                  <KeyboardArrowDown />
                </IconButton>
              </StepContent>
            </Step>

            <Step active expanded>
              <StepLabel StepIconProps={{ icon: "" }}>
                <span style={{ fontWeight: "600", marginRight: "5px" }}>
                  {moment("2024-03-10T10:00:33").format("MMMM D, YYYY")}
                </span>

                <span>{moment("2024-03-10T10:00:33").format("H:mm a")}</span>
              </StepLabel>
            </Step>

            <Step active expanded>
              <StepLabel StepIconProps={{ icon: "" }}>
                <span style={{ fontWeight: "600", marginRight: "5px" }}>
                  {moment("2024-03-10T10:00:33").format("MMMM D, YYYY")}
                </span>

                <span>{moment("2024-03-10T10:00:33").format("H:mm a")}</span>
              </StepLabel>
            </Step>
          </Stepper>
        </Box>
      </Box>
    </CommonModal>
  );
}

export default PaymentHistoriesModal;
