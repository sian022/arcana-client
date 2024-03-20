import { Box, Divider, Skeleton } from "@mui/material";

function PaymentListSkeleton() {
  return (
    <>
      <Box className="paymentPage__body__transactions__header">
        <Skeleton width="100px" height="36px" sx={{ transform: "none" }} />

        <Box className="paymentPage__body__transactions__header__totalAmount">
          <Skeleton width="120px" height="30px" sx={{ transform: "none" }} />

          <Skeleton width="120px" height="30px" sx={{ transform: "none" }} />
        </Box>
      </Box>

      <Box
        className="paymentPage__body__transactions__transactionsList"
        sx={{ overflow: "hidden" }}
      >
        {Array.from({ length: 9 }).map((_, index) => (
          <Box
            key={index}
            className="paymentPage__body__transactions__transactionsList__item"
            sx={{ pointerEvents: "none" }}
          >
            <Skeleton width="50%" sx={{ transform: "none" }} />

            <Box className="paymentPage__body__transactions__transactionsList__item__identifiers">
              <Box className="paymentPage__body__transactions__transactionsList__item__identifiers__transactionNumber">
                <Skeleton width="60%" />

                <Skeleton width="30%" />
              </Box>

              <Box className="paymentPage__body__transactions__transactionsList__item__identifiers__invoiceNumber">
                <Skeleton width="45%" />

                <Skeleton width="30%" />
              </Box>
            </Box>

            <Divider variant="inset" />

            <Box className="paymentPage__body__transactions__transactionsList__item__numbers">
              <Box className="paymentPage__body__transactions__transactionsList__item__numbers__discount">
                <Skeleton width="30%" />

                <Skeleton width="35%" />
              </Box>

              <Box className="paymentPage__body__transactions__transactionsList__item__numbers__amount">
                <Skeleton sx={{ transform: "none" }} width="25%" />

                <Skeleton sx={{ transform: "none" }} width="40%" />
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </>
  );
}

export default PaymentListSkeleton;
