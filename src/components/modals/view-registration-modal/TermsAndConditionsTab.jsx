import { Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { useGetTermsByClientIdQuery } from "../../../features/registration/api/registrationApi";
import TermsAndConditionsTabSkeleton from "../../skeletons/TermsAndConditionsTabSkeleton";

function TermsAndConditionsTab() {
  const selectedRowData = useSelector((state) => state.selectedRow.value);

  //RTK Query
  const { data, isLoading } = useGetTermsByClientIdQuery({
    id: selectedRowData?.id,
  });

  return (
    <Box className="viewRegistrationModal__termsAndConditions">
      <Box className="viewRegistrationModal__termsAndConditions__header">
        <Typography className="viewRegistrationModal__termsAndConditions__header__label">
          Requested by:{" "}
        </Typography>
        <Typography>{selectedRowData?.requestor}</Typography>
      </Box>

      {isLoading ? (
        <TermsAndConditionsTabSkeleton />
      ) : (
        <Box className="viewRegistrationModal__termsAndConditions__content">
          <Typography className="viewRegistrationModal__termsAndConditions__content__title">
            Terms and Conditions
          </Typography>
          <Box className="viewRegistrationModal__termsAndConditions__content__fields">
            <Box className="viewRegistrationModal__termsAndConditions__content__fields__item">
              <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__label">
                Freezer:
              </Typography>
              <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__value">
                {data?.freezer ? data.freezer : "N/A"}
              </Typography>
            </Box>

            <Box className="viewRegistrationModal__termsAndConditions__content__fields__item">
              <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__label">
                Type of Customer:
              </Typography>
              <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__value">
                {data?.typeOfCustomer}
              </Typography>
            </Box>

            <Box className="viewRegistrationModal__termsAndConditions__content__fields__item">
              <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__label">
                Direct Delivery:
              </Typography>
              <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__value">
                {data?.freezer ? "Yes" : "No"}
              </Typography>
            </Box>

            <Box className="viewRegistrationModal__termsAndConditions__content__fields__item">
              <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__label">
                Booking Coverage:
              </Typography>
              <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__value">
                {data?.bookingCoverage}
              </Typography>
            </Box>

            <Box className="viewRegistrationModal__termsAndConditions__content__fields__item">
              <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__label">
                Mode of Payment:
              </Typography>
              <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__value">
                {/* {data?.modeofPayment} */}
                {data?.modeofPayments?.some((item) => item.id === 1) &&
                  "Cash"}{" "}
                {data?.modeofPayments?.some((item) => item.id === 1) &&
                  data?.modeofPayments?.some((item) => item.id === 2) &&
                  "&"}{" "}
                {data?.modeofPayments?.some((item) => item.id === 2) &&
                  "Cheque"}{" "}
                {data?.modeofPayments?.some((item) => item.id === 2) &&
                  data?.modeofPayments?.some((item) => item.id === 3) &&
                  "&"}{" "}
                {data?.modeofPayments?.some((item) => item.id === 3) &&
                  "Online"}
              </Typography>
            </Box>

            <Box className="viewRegistrationModal__termsAndConditions__content__fields__item">
              <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__label">
                Terms:
              </Typography>
              <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__value">
                {/* Credit Limit (P50,000) (45 Days) */}
                {data?.term} {data?.termId === 2 && `(${data?.termDays} Day/s)`}
                {data?.termId === 3 &&
                  `(₱${data?.creditLimit?.toLocaleString()}) (${
                    data?.termDays
                  } Day/s)`}
              </Typography>
            </Box>

            <Box className="viewRegistrationModal__termsAndConditions__content__fields__item">
              <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__label">
                Discount:
              </Typography>
              <Typography className="viewRegistrationModal__termsAndConditions__content__fields__item__value">
                {data?.fixedDiscount?.discountPercentage
                  ? `Fixed (${(
                      data?.fixedDiscount?.discountPercentage * 100
                    ).toFixed(2)}%)`
                  : data?.variableDiscount
                  ? "Variable"
                  : "N/A"}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default TermsAndConditionsTab;
