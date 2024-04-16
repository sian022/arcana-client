import { Box, Typography } from "@mui/material";
import CommonModal from "../../CommonModal";
import { useSelector } from "react-redux";
import { formatPesoAmount } from "../../../utils/CustomFunctions";
import moment from "moment";

function ViewAdvancePaymentDetailsModal({ ...props }) {
  const selectedRowData = useSelector((state) => state.selectedRow.value);

  return (
    <CommonModal
      {...props}
      closeTopRight
      width="500px"
      // height="320px"
    >
      <Box className="viewAdvancePaymentDetailsModal">
        <Typography className="viewAdvancePaymentDetailsModal__title">
          Advance Payment Details
        </Typography>

        <Box className="viewAdvancePaymentDetailsModal__clientInfo">
          <Box className="viewAdvancePaymentDetailsModal__clientInfo__item">
            <Typography className="viewAdvancePaymentDetailsModal__clientInfo__item__label">
              Business Name
            </Typography>
            <Typography className="viewAdvancePaymentDetailsModal__clientInfo__item__value">
              {selectedRowData?.businessName}
            </Typography>
          </Box>

          <Box className="viewAdvancePaymentDetailsModal__clientInfo__item">
            <Typography className="viewAdvancePaymentDetailsModal__clientInfo__item__label">
              Client Name
            </Typography>
            <Typography className="viewAdvancePaymentDetailsModal__clientInfo__item__value">
              {selectedRowData?.fullname}
            </Typography>
          </Box>
        </Box>

        <Box className="viewAdvancePaymentDetailsModal__paymentInfo">
          <Typography className="viewAdvancePaymentDetailsModal__paymentInfo__title">
            Payment Information
          </Typography>

          <Box className="viewAdvancePaymentDetailsModal__paymentInfo__content">
            <Box className="viewAdvancePaymentDetailsModal__paymentInfo__content__amount">
              <Typography className="viewAdvancePaymentDetailsModal__paymentInfo__content__amount__label">
                Amount
              </Typography>
              <Typography className="viewAdvancePaymentDetailsModal__paymentInfo__content__amount__value">
                {formatPesoAmount(selectedRowData?.advancePaymentAmount)}
              </Typography>
            </Box>

            <Box className="viewAdvancePaymentDetailsModal__paymentInfo__content__item">
              <Typography className="viewAdvancePaymentDetailsModal__paymentInfo__content__item__label">
                Payment Method
              </Typography>
              <Typography className="viewAdvancePaymentDetailsModal__paymentInfo__content__item__value">
                {selectedRowData?.paymentMethod}
              </Typography>
            </Box>

            <Box className="viewAdvancePaymentDetailsModal__paymentInfo__content__item">
              <Typography className="viewAdvancePaymentDetailsModal__paymentInfo__content__item__label">
                Origin
              </Typography>
              <Typography className="viewAdvancePaymentDetailsModal__paymentInfo__content__item__value">
                {selectedRowData?.origin}
              </Typography>
            </Box>

            {selectedRowData?.paymentMethod === "Cheque" && (
              <>
                <Box className="viewAdvancePaymentDetailsModal__paymentInfo__content__item">
                  <Typography className="viewAdvancePaymentDetailsModal__paymentInfo__content__item__label">
                    Payee
                  </Typography>
                  <Typography className="viewAdvancePaymentDetailsModal__paymentInfo__content__item__value">
                    {selectedRowData?.payee}
                  </Typography>
                </Box>

                <Box className="viewAdvancePaymentDetailsModal__paymentInfo__content__item">
                  <Typography className="viewAdvancePaymentDetailsModal__paymentInfo__content__item__label">
                    Cheque Number
                  </Typography>
                  <Typography className="viewAdvancePaymentDetailsModal__paymentInfo__content__item__value">
                    {selectedRowData?.chequeNo}
                  </Typography>
                </Box>

                <Box className="viewAdvancePaymentDetailsModal__paymentInfo__content__item">
                  <Typography className="viewAdvancePaymentDetailsModal__paymentInfo__content__item__label">
                    Bank Name
                  </Typography>
                  <Typography className="viewAdvancePaymentDetailsModal__paymentInfo__content__item__value">
                    {selectedRowData?.bankName}
                  </Typography>
                </Box>

                <Box className="viewAdvancePaymentDetailsModal__paymentInfo__content__item">
                  <Typography className="viewAdvancePaymentDetailsModal__paymentInfo__content__item__label">
                    Cheque Date
                  </Typography>
                  <Typography className="viewAdvancePaymentDetailsModal__paymentInfo__content__item__value">
                    {moment(selectedRowData?.chequeDate).format("MM-DD-YYYY")}
                  </Typography>
                </Box>

                <Box className="viewAdvancePaymentDetailsModal__paymentInfo__content__item">
                  <Typography className="viewAdvancePaymentDetailsModal__paymentInfo__content__item__label">
                    Date Received
                  </Typography>
                  <Typography className="viewAdvancePaymentDetailsModal__paymentInfo__content__item__value">
                    {moment(selectedRowData?.dateReceived).format("MM-DD-YYYY")}
                  </Typography>
                </Box>
              </>
            )}

            {selectedRowData?.paymentMethod === "Online" && (
              <>
                <Box className="viewAdvancePaymentDetailsModal__paymentInfo__content__item">
                  <Typography className="viewAdvancePaymentDetailsModal__paymentInfo__content__item__label">
                    Account Name
                  </Typography>
                  <Typography className="viewAdvancePaymentDetailsModal__paymentInfo__content__item__value">
                    {selectedRowData?.accountName}
                  </Typography>
                </Box>

                <Box className="viewAdvancePaymentDetailsModal__paymentInfo__content__item">
                  <Typography className="viewAdvancePaymentDetailsModal__paymentInfo__content__item__label">
                    Account Number
                  </Typography>
                  <Typography className="viewAdvancePaymentDetailsModal__paymentInfo__content__item__value">
                    {selectedRowData?.accountNo}
                  </Typography>
                </Box>

                <Box className="viewAdvancePaymentDetailsModal__paymentInfo__content__item">
                  <Typography className="viewAdvancePaymentDetailsModal__paymentInfo__content__item__label">
                    Reference Number
                  </Typography>
                  <Typography className="viewAdvancePaymentDetailsModal__paymentInfo__content__item__value">
                    {selectedRowData?.referenceNo}
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </CommonModal>
  );
}

export default ViewAdvancePaymentDetailsModal;
