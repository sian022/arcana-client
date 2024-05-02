import {
  Box,
  CircularProgress,
  List,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import CommonModal from "../../CommonModal";
import DangerButton from "../../DangerButton";
import SecondaryButton from "../../SecondaryButton";
import { useReactToPrint } from "react-to-print";
import { useEffect, useRef, useState } from "react";
import RDFLogo from "../../../assets/images/RDF-Logo.png";
import { useSelector } from "react-redux";
import {
  useLazyGetAttachmentsByClientIdQuery,
  useLazyGetListingFeeByClientIdQuery,
  useLazyGetOtherExpensesByClientIdQuery,
  useLazyGetTermsByClientIdQuery,
} from "../../../features/registration/api/registrationApi";
import { formatPhoneNumber } from "../../../utils/CustomFunctions";

function PrintTTAModal({ ...props }) {
  const { open, onClose } = props;

  //States
  const [isLoading, setIsLoading] = useState(false);

  //Hooks
  const printRef = useRef();
  const selectedRowData = useSelector((state) => state.selectedRow.value);

  //RTK Query
  const [triggerTerms, { data: termsData, isFetching: isTermsFetching }] =
    useLazyGetTermsByClientIdQuery();
  const [
    triggerListingFee,
    { data: listingFeeData, isFetching: isListingFeeFetching },
  ] = useLazyGetListingFeeByClientIdQuery();
  const [
    triggerExpenses,
    { data: expensesData, isFetching: isExpensesFetching },
  ] = useLazyGetOtherExpensesByClientIdQuery();
  const [
    triggerAttachments,
    { data: attachmentsData, isFetching: isAttachmentsFetching },
  ] = useLazyGetAttachmentsByClientIdQuery();

  //Functions
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onBeforeGetContent: () => {
      setIsLoading(true);
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 500); // Delay to ensure the content is loaded before printing
      });
    },

    onAfterPrint: () => {
      setIsLoading(false);
    },
  });

  const renderExpenses = (expensesData) => {
    const expenseTotals = {};

    expensesData?.expenses?.forEach((expenseRequest) => {
      if (expenseRequest?.status === "Approved") {
        expenseRequest?.expenses?.forEach((expense) => {
          const { expenseType, amount } = expense;
          if (expenseType in expenseTotals) {
            expenseTotals[expenseType] += amount;
          } else {
            expenseTotals[expenseType] = amount;
          }
        });
      }
    });

    return Object.entries(expenseTotals).map(
      ([expenseType, totalAmount], index) => (
        <Typography key={index}>
          {expenseType} - ₱
          {totalAmount?.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Typography>
      )
    );
  };

  const calculateApprovedListingFees = (listingFees) => {
    let sum = 0;
    let totalItems = 0;

    listingFees?.forEach((request) => {
      if (request.status === "Approved") {
        sum += request.total;
        totalItems += request.listingItems.length;
      }
    });

    return {
      sum: sum?.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      perSku: (sum / totalItems)?.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    };
  };

  const calculateListingFeePosition = (i, j) => {
    let position = 0;
    for (let index = 0; index < i; index++) {
      if (listingFeeData?.listingFees[index].status === "Approved") {
        position += listingFeeData.listingFees[index].listingItems.length;
      }
    }
    return position + j + 1;
  };

  //UseEffect
  useEffect(() => {
    if (open) {
      triggerTerms({ id: selectedRowData?.id }, { preferCacheValue: true });
      triggerListingFee(
        { id: selectedRowData?.id },
        { preferCacheValue: true }
      );
      triggerExpenses({ id: selectedRowData?.id }, { preferCacheValue: true });
      triggerAttachments(
        { id: selectedRowData?.id },
        { preferCacheValue: true }
      );
    }
  }, [
    open,
    selectedRowData,
    triggerTerms,
    triggerListingFee,
    triggerExpenses,
    triggerAttachments,
  ]);

  console.log(attachmentsData);
  return (
    <CommonModal width="900px" closeTopRight {...props}>
      <Box className="printTTAModal">
        <Typography className="printTTAModal__title">
          Print Term Trade Agreement
        </Typography>

        {isTermsFetching ||
        isListingFeeFetching ||
        isExpensesFetching ||
        isAttachmentsFetching ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "65vh",
            }}
          >
            <CircularProgress size="20px" />
          </Box>
        ) : (
          <Box className="printTTAModal__body" ref={printRef}>
            <Box className="printTTAModal__body__logo">
              <img src={RDFLogo} alt="rdf-logo" />
            </Box>

            <Typography className="printTTAModal__body__title">
              Special Agreement Between RDFFLFI and{" "}
              {selectedRowData?.businessName}
            </Typography>

            <TableContainer className="printTTAModal__body__tableContainer">
              <Table>
                <TableHead className="printTTAModal__body__tableContainer__tableHead">
                  <TableRow className="printTTAModal__body__tableContainer__tableHead__tableRow">
                    <TableCell
                      className="printTTAModal__body__tableContainer__tableHead__tableCell"
                      sx={{
                        borderRight: "1px solid #e0e0e0 !important",
                      }}
                    >
                      Customer Name:
                    </TableCell>
                    <TableCell className="printTTAModal__body__tableContainer__tableHead__tableCell">
                      {selectedRowData?.businessName}
                    </TableCell>
                  </TableRow>

                  <TableRow className="printTTAModal__body__tableContainer__tableHead__tableRow">
                    <TableCell
                      className="printTTAModal__body__tableContainer__tableHead__tableCell"
                      sx={{
                        borderRight: "1px solid #e0e0e0 !important",
                      }}
                    >
                      Product Lines
                    </TableCell>

                    <TableCell className="printTTAModal__body__tableContainer__tableHead__tableCell"></TableCell>
                  </TableRow>
                </TableHead>
              </Table>

              <Box className="printTTAModal__body__tableContainer__productsAndOthers">
                <Table>
                  <TableBody>
                    {listingFeeData?.listingFees?.map(
                      (listingFeeRequest, i) => {
                        if (listingFeeRequest.status === "Approved") {
                          return listingFeeRequest.listingItems.map(
                            (listingItem, j) => (
                              <TableRow key={listingItem.id}>
                                <TableCell
                                  sx={{
                                    borderRight: "1px solid #e0e0e0 !important",
                                  }}
                                >
                                  <Box className="printTTAModal__body__tableContainer__productsAndOthers__product">
                                    <span className="printTTAModal__body__tableContainer__productsAndOthers__product__number">
                                      {calculateListingFeePosition(i, j)}.
                                    </span>{" "}
                                    {listingItem.itemDescription}
                                  </Box>
                                </TableCell>
                              </TableRow>
                            )
                          );
                        }
                        return null;
                      }
                    )}

                    <TableRow>
                      <TableCell
                        sx={{
                          borderRight: "1px solid #e0e0e0 !important",
                          textAlign: "center",
                          textTransform: "uppercase",
                          fontWeight: "bold",
                        }}
                      >
                        Support
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <Box className="printTTAModal__body__tableContainer__productsAndOthers__others">
                  <Box className="printTTAModal__body__tableContainer__productsAndOthers__others__invoiceDeduction">
                    <Typography>
                      {calculateApprovedListingFees(listingFeeData?.listingFees)
                        .sum <= 0
                        ? ""
                        : `Listing Fee - ₱${
                            calculateApprovedListingFees(
                              listingFeeData?.listingFees
                            ).sum
                          } (₱${
                            calculateApprovedListingFees(
                              listingFeeData?.listingFees
                            ).perSku
                          } per SKU)`}
                    </Typography>

                    {renderExpenses(expensesData)}

                    {/* <Box className="printTTAModal__body__tableContainer__productsAndOthers__others__invoiceDeduction__grouping">
                    <Box className="printTTAModal__body__tableContainer__productsAndOthers__others__invoiceDeduction__grouping__bracket" />

                    <Typography className="printTTAModal__body__tableContainer__productsAndOthers__others__invoiceDeduction__grouping__label">
                      Invoice Deduction
                    </Typography>
                  </Box> */}
                  </Box>

                  <Typography>
                    Discount -{" "}
                    {termsData?.fixedDiscount?.discountPercentage
                      ? `${(
                          termsData?.fixedDiscount?.discountPercentage * 100
                        )?.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionsDigits: 2,
                        })}%`
                      : "Variable"}
                  </Typography>
                </Box>
              </Box>

              <Table>
                <TableBody>
                  <TableRow
                    sx={{ borderTop: "1px solid #e0e0e0 !important" }}
                    className="printTTAModal__body__tableContainer__supportRow"
                  >
                    <TableCell
                      className="printTTAModal__body__tableContainer__supportRow__cell"
                      sx={{ borderRight: "1px solid #e0e0e0 !important" }}
                    >
                      Mode of Payment
                    </TableCell>
                    <TableCell className="printTTAModal__body__tableContainer__supportRow__cell">
                      {termsData?.term === "COD"
                        ? "Cash on Delivery"
                        : termsData?.term === "1 Up 1 Down"
                        ? `1 up - 1 down (to be collected in ${termsData?.termDays} days)`
                        : termsData?.term === "Credit Limit"
                        ? `Credit Limit ₱${termsData?.creditLimit?.toLocaleString()} (to be collected in ${
                            termsData?.termDays
                          } days)`
                        : ""}
                    </TableCell>
                  </TableRow>

                  <TableRow className="printTTAModal__body__tableContainer__supportRow">
                    <TableCell
                      className="printTTAModal__body__tableContainer__supportRow__cell"
                      sx={{ borderRight: "1px solid #e0e0e0 !important" }}
                    >
                      Booking Coverage
                    </TableCell>

                    <TableCell className="printTTAModal__body__tableContainer__supportRow__cell">
                      {termsData?.bookingCoverage} Coverage,{" "}
                      {termsData?.bookingCoverage === "F1"
                        ? "once"
                        : termsData?.bookingCoverage === "F2"
                        ? "twice"
                        : termsData?.bookingCoverage === "F3"
                        ? "thrice"
                        : termsData?.bookingCoverage === "F4"
                        ? "four times"
                        : ""}{" "}
                      a month
                    </TableCell>
                  </TableRow>

                  <TableRow className="printTTAModal__body__tableContainer__supportRow">
                    <TableCell
                      className="printTTAModal__body__tableContainer__supportRow__cell"
                      sx={{ borderRight: "1px solid #e0e0e0 !important" }}
                    >
                      Delivery Type
                    </TableCell>

                    <TableCell className="printTTAModal__body__tableContainer__supportRow__cell">
                      Products will be served by Channel Development Officer
                      {termsData?.directDelivery
                        ? ` directly delivered to ${selectedRowData?.businessName}`
                        : ` not directly delivered to ${selectedRowData?.businessName}`}
                    </TableCell>
                  </TableRow>

                  <TableRow className="printTTAModal__body__tableContainer__supportRow">
                    <TableCell
                      className="printTTAModal__body__tableContainer__supportRow__cell"
                      sx={{ borderRight: "1px solid #e0e0e0 !important" }}
                    >
                      BO Allowance
                    </TableCell>

                    <TableCell className="printTTAModal__body__tableContainer__supportRow__cell">
                      Near BBD will be replaced before 15 days on expiration
                      date
                    </TableCell>
                  </TableRow>

                  <TableRow className="printTTAModal__body__tableContainer__supportRow">
                    <TableCell
                      className="printTTAModal__body__tableContainer__supportRow__cell"
                      sx={{ borderRight: "1px solid #e0e0e0 !important" }}
                    >
                      Transaction Process
                    </TableCell>

                    <TableCell className="printTTAModal__body__tableContainer__supportRow__cell">
                      Charge Invoice; Collection Receipt upon Collection
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <Table>
                <TableHead className="printTTAModal__body__tableContainer__tableHead">
                  <TableRow sx={{ borderTop: "1px solid #e0e0e0 !important" }}>
                    <TableCell className="printTTAModal__body__tableContainer__tableHead__tableCell">
                      Contact Person
                    </TableCell>
                  </TableRow>
                </TableHead>
              </Table>

              <Table>
                <TableBody>
                  <TableRow className="printTTAModal__body__tableContainer__contactHeader">
                    <TableCell
                      sx={{ borderRight: "1px solid #e0e0e0 !important" }}
                      className="printTTAModal__body__tableContainer__contactHeader__cell"
                    >
                      RDF Feed, Livestock & Foods Inc.
                    </TableCell>

                    <TableCell className="printTTAModal__body__tableContainer__contactHeader__cell">
                      Purpose
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <Box className="printTTAModal__body__tableContainer__contactItem">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell
                        className="printTTAModal__body__tableContainer__contactItem__cell"
                        sx={{ fontWeight: "600" }}
                      >
                        {selectedRowData?.requestor} - Channel Development
                        Officer
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="printTTAModal__body__tableContainer__contactItem__cell">
                        Email Address:
                        {/* noelbaylon.rdf@gmail.com */}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="printTTAModal__body__tableContainer__contactItem__cell">
                        Contact Number:{" "}
                        {selectedRowData?.requestorMobileNumber
                          ? `0${formatPhoneNumber(
                              selectedRowData?.requestorMobileNumber
                            )}`
                          : ""}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <Box className="printTTAModal__body__tableContainer__contactItem__purpose">
                  <Typography>
                    Order processing/ Suggested order/ Alignments /Payment
                    Monitoring/ New Products/ business review and the likes
                  </Typography>
                </Box>
              </Box>

              <Box className="printTTAModal__body__tableContainer__contactItem">
                <Table>
                  <TableBody>
                    <TableRow
                      sx={{ borderTop: "1px solid #e0e0e0 !important" }}
                    >
                      <TableCell
                        className="printTTAModal__body__tableContainer__contactItem__cell"
                        sx={{ fontWeight: "600" }}
                      >
                        DAN JERVY JIMENEZ – RDF General Trade Head
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="printTTAModal__body__tableContainer__contactItem__cell">
                        Email Address: dan.jimenez@rdfmeatshop.com
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="printTTAModal__body__tableContainer__contactItem__cell">
                        Contact Number: 0998-988-9509
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <Box
                  className="printTTAModal__body__tableContainer__contactItem__purpose"
                  sx={{ borderTop: "1px solid #e0e0e0 !important" }}
                >
                  <Typography>
                    Alignments/ New Products/ Business Reviews and the likes
                  </Typography>
                </Box>
              </Box>

              <Table>
                <TableBody>
                  <TableRow className="printTTAModal__body__tableContainer__customerInfoHeader">
                    <TableCell
                      sx={{ borderRight: "1px solid #e0e0e0 !important" }}
                      className="printTTAModal__body__tableContainer__customerInfoHeader__cell"
                    >
                      {selectedRowData?.businessName}
                    </TableCell>

                    <TableCell className="printTTAModal__body__tableContainer__customerInfoHeader__cell">
                      Purpose
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <Box className="printTTAModal__body__tableContainer__customerInfoItem">
                <Table>
                  <TableBody>
                    <TableRow
                      sx={{ borderTop: "1px solid #e0e0e0 !important" }}
                    >
                      <TableCell
                        className="printTTAModal__body__tableContainer__customerInfoItem__cell"
                        sx={{ fontWeight: "600" }}
                      >
                        Name:{" "}
                        <span style={{ textTransform: "uppercase" }}>
                          {selectedRowData?.ownersName}
                        </span>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="printTTAModal__body__tableContainer__customerInfoItem__cell">
                        Email Address: {selectedRowData?.emailAddress}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="printTTAModal__body__tableContainer__customerInfoItem__cell">
                        Contact Number:{" "}
                        {selectedRowData?.phoneNumber
                          ? `0${formatPhoneNumber(
                              selectedRowData?.phoneNumber
                            )}`
                          : ""}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <Box
                  className="printTTAModal__body__tableContainer__customerInfoItem__purpose"
                  sx={{ borderTop: "1px solid #e0e0e0 !important" }}
                >
                  <Typography>
                    Order Process / New Product lines and related concerns:
                  </Typography>
                </Box>
              </Box>

              <Box className="printTTAModal__body__tableContainer__customerInfoItem">
                <Table>
                  <TableBody>
                    <TableRow
                      sx={{ borderTop: "1px solid #e0e0e0 !important" }}
                    >
                      <TableCell
                        className="printTTAModal__body__tableContainer__customerInfoItem__cell"
                        sx={{ fontWeight: "600" }}
                      >
                        Name:{" "}
                        <span style={{ textTransform: "uppercase" }}></span>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="printTTAModal__body__tableContainer__customerInfoItem__cell">
                        Email Address:
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="printTTAModal__body__tableContainer__customerInfoItem__cell">
                        Contact Number:
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <Box
                  className="printTTAModal__body__tableContainer__customerInfoItem__purpose"
                  sx={{ borderTop: "1px solid #e0e0e0 !important" }}
                >
                  <Typography>Warehouse In charge:</Typography>
                </Box>
              </Box>

              <Box className="printTTAModal__body__tableContainer__customerInfoItem">
                <Table>
                  <TableBody>
                    <TableRow
                      sx={{ borderTop: "1px solid #e0e0e0 !important" }}
                    >
                      <TableCell
                        className="printTTAModal__body__tableContainer__customerInfoItem__cell"
                        sx={{ fontWeight: "600" }}
                      >
                        Name:{" "}
                        <span style={{ textTransform: "uppercase" }}>
                          {selectedRowData?.ownersName}
                        </span>
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="printTTAModal__body__tableContainer__customerInfoItem__cell">
                        Email Address: {selectedRowData?.emailAddress}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell className="printTTAModal__body__tableContainer__customerInfoItem__cell">
                        Contact Number:{" "}
                        {selectedRowData?.phoneNumber
                          ? `0${formatPhoneNumber(
                              selectedRowData?.phoneNumber
                            )}`
                          : ""}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <Box
                  className="printTTAModal__body__tableContainer__customerInfoItem__purpose"
                  sx={{ borderTop: "1px solid #e0e0e0 !important" }}
                >
                  <Typography>Payment:</Typography>
                </Box>
              </Box>

              <Table>
                <TableBody>
                  <TableRow
                    className="printTTAModal__body__tableContainer__fillerTableRow"
                    sx={{ borderTop: "1px solid #e0e0e0 !important" }}
                  >
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>

                  <TableRow className="printTTAModal__body__tableContainer__fillerTableRow">
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>

              <Box className="printTTAModal__body__tableContainer__signatures">
                <Typography className="printTTAModal__body__tableContainer__signatures__signedBy">
                  Signed by:
                </Typography>

                <Box className="printTTAModal__body__tableContainer__signatures__content">
                  <Box className="printTTAModal__body__tableContainer__signatures__content__rdf">
                    <Typography className="printTTAModal__body__tableContainer__signatures__content__rdf__title">
                      RDF FEED, LIVESTOCK & FOODS INC.
                    </Typography>

                    <Box className="printTTAModal__body__tableContainer__signatures__content__rdf__signaturesList">
                      <Box className="printTTAModal__body__tableContainer__signatures__content__rdf__signaturesList__item">
                        <Box className="printTTAModal__body__tableContainer__signatures__content__rdf__signaturesList__item__underline" />

                        <Typography className="printTTAModal__body__tableContainer__signatures__content__rdf__signaturesList__item__name">
                          DAN JERVY JIMENEZ
                        </Typography>

                        <Typography className="printTTAModal__body__tableContainer__signatures__content__rdf__signaturesList__item__position">
                          General Trade Distribution Head
                        </Typography>
                      </Box>

                      <Box className="printTTAModal__body__tableContainer__signatures__content__rdf__signaturesList__item">
                        <Box className="printTTAModal__body__tableContainer__signatures__content__rdf__signaturesList__item__underline" />

                        <Typography className="printTTAModal__body__tableContainer__signatures__content__rdf__signaturesList__item__name">
                          ANTHONY LOZANO
                        </Typography>

                        <Typography className="printTTAModal__body__tableContainer__signatures__content__rdf__signaturesList__item__position">
                          Sales & Marketing Director
                        </Typography>
                      </Box>

                      <Box className="printTTAModal__body__tableContainer__signatures__content__rdf__signaturesList__item">
                        <Box className="printTTAModal__body__tableContainer__signatures__content__rdf__signaturesList__item__underline" />

                        <Typography className="printTTAModal__body__tableContainer__signatures__content__rdf__signaturesList__item__name">
                          ROBERT H.LO, DVM
                        </Typography>

                        <Typography className="printTTAModal__body__tableContainer__signatures__content__rdf__signaturesList__item__position">
                          CEO
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box className="printTTAModal__body__tableContainer__signatures__content__business">
                    <Typography className="printTTAModal__body__tableContainer__signatures__content__business__title">
                      {selectedRowData?.businessName}
                    </Typography>

                    <Box className="printTTAModal__body__tableContainer__signatures__content__business__signature">
                      <Box className="printTTAModal__body__tableContainer__signatures__content__business__signature__underline" />

                      <img src={attachmentsData} alt="client-signature" />
                      <Typography className="printTTAModal__body__tableContainer__signatures__content__business__signature__name">
                        {selectedRowData?.businessName}
                      </Typography>

                      <Typography className="printTTAModal__body__tableContainer__signatures__content__business__signature__position">
                        Owner/Representative
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              <Box className="printTTAModal__body__tableContainer__footer">
                <List
                  sx={{
                    listStyleType: "disc",
                    pl: 2,
                    "& .MuiListItem-root": {
                      display: "list-item",
                      marginBottom: "-14px",
                    },
                  }}
                >
                  <ListItem>
                    <Typography>
                      This form serves as an official agreement between RDF
                      Feed, Livestock & Foods Inc. and{" "}
                      {selectedRowData?.businessName}. Both parties agree to
                      follow all terms stated above this contract.
                    </Typography>
                  </ListItem>

                  <ListItem>
                    <Typography>
                      All stipulations stated in this agreement shall be
                      strictly adhered to and shall extend indefinitely until
                      both parties agree to terminate or revise this agreement.
                    </Typography>
                  </ListItem>

                  <ListItem>
                    <Typography>
                      Both parties shall keep the terms and conditions of this
                      agreement confidential and shall not disclose this to any
                      person.
                    </Typography>
                  </ListItem>
                </List>
              </Box>
            </TableContainer>
          </Box>
        )}

        <Box className="printTTAModal__actions">
          <DangerButton onClick={onClose}>Close</DangerButton>
          <SecondaryButton onClick={handlePrint} disabled={isLoading}>
            {isLoading ? <CircularProgress size="20px" /> : "Print"}
          </SecondaryButton>
        </Box>
      </Box>
    </CommonModal>
  );
}

export default PrintTTAModal;
