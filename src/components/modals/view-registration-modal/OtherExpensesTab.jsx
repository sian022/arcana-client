import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import NoRecordsFound from "../../../assets/images/NoRecordsFound.svg";
import { useGetOtherExpensesByClientIdQuery } from "../../../features/registration/api/registrationApi";
import OtherExpensesTabSkeleton from "../../skeletons/OtherExpensesTabSkeleton";

function OtherExpensesTab() {
  const selectedRowData = useSelector((state) => state.selectedRow.value);
  // const [totalAmount, setTotalAmount] = useState(0);

  //Disclosures

  //RTK Query
  const { data, isLoading } = useGetOtherExpensesByClientIdQuery({
    id: selectedRowData?.id,
  });

  const totalAmount = useMemo(() => {
    return data?.expenses?.reduce((total, item) => {
      return (
        total +
        item?.expenses?.reduce((subtotal, expense) => {
          return subtotal + (expense.amount || 0);
        }, 0)
      );
    }, 0);
  }, [data]);

  return (
    <>
      <Box className="viewRegistrationModal__listingFee">
        <Box className="viewRegistrationModal__listingFee__header">
          <Typography className="viewRegistrationModal__listingFee__header__label">
            Requested by:{" "}
          </Typography>
          <Typography>{selectedRowData?.requestor}</Typography>
        </Box>

        {isLoading ? (
          <OtherExpensesTabSkeleton />
        ) : (
          <Box className="viewRegistrationModal__listingFee__content">
            <Box className="viewRegistrationModal__listingFee__content__titleGroup">
              <Typography className="viewRegistrationModal__listingFee__content__titleGroup__title">
                Other Expenses
              </Typography>

              {/* {data?.expenses &&
              data?.expenses?.length > 0 && (
                <Typography className="viewRegistrationModal__listingFee__content__titleGroup__title">
                  Expenses Information
                </Typography>
              )} */}
            </Box>

            {data?.expenses && data?.expenses?.length > 0 ? (
              <Box className="viewListingFeeModal__table">
                <TableContainer
                  sx={{
                    maxHeight: "280px",
                    overflow: "auto",
                    // width: "620px",
                    // width: "700px",
                    width: "720px",
                    // maxWidth: "700px",
                    borderRadius: "10px",
                  }}
                >
                  <Table>
                    <TableHead
                      sx={{
                        bgcolor: "white !important",
                      }}
                    >
                      <TableRow>
                        <TableCell sx={{ color: "black !important" }}>
                          Expense Type
                        </TableCell>
                        <TableCell sx={{ color: "black !important" }}>
                          Remarks
                        </TableCell>
                        <TableCell sx={{ color: "black !important" }}>
                          Amount
                        </TableCell>
                        <TableCell sx={{ color: "black !important" }}>
                          Tx No.
                        </TableCell>
                        <TableCell sx={{ color: "black !important" }}>
                          Status
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {data?.expenses?.map((item, index) => (
                        <React.Fragment key={index}>
                          {item?.expenses?.map((expense) => (
                            <TableRow key={expense.id}>
                              <TableCell>{expense.expenseType}</TableCell>
                              <TableCell>{expense.remarks || "N/A"}</TableCell>
                              <TableCell>
                                ₱ {expense.amount?.toLocaleString()}
                              </TableCell>
                              <TableCell>{item.id}</TableCell>
                              <TableCell>
                                <Box
                                  sx={{
                                    bgcolor:
                                      item?.status === "Approved"
                                        ? "success.main"
                                        : item?.status === "Rejected"
                                        ? "error.main"
                                        : item?.status === "Voided"
                                        ? "gray"
                                        : "warning.main",
                                    borderRadius: "5px",
                                    padding: "3px",
                                    color: "white !important",
                                    fontWeight: "500",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  {item.status === "Under review"
                                    ? "Pending"
                                    : item.status || "Pending"}
                                </Box>
                              </TableCell>
                            </TableRow>
                          ))}
                        </React.Fragment>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box
                  sx={{
                    display: "flex",
                    position: "absolute",
                    // right: "150px",
                    // right: "125px",
                    // left: "453px",
                    right: "50px",
                    bottom: "90px",
                    gap: "20px",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "1rem",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    }}
                  >
                    Total Amount
                  </Typography>
                  <Typography sx={{ fontSize: "1rem" }}>
                    ₱{totalAmount?.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "300px",
                  width: "300px",
                }}
              >
                <img
                  src={NoRecordsFound}
                  alt="no-data"
                  width="300px"
                  style={{ position: "relative", top: "15%" }}
                />
              </Box>
            )}
          </Box>
        )}
      </Box>
    </>
  );
}

export default OtherExpensesTab;
