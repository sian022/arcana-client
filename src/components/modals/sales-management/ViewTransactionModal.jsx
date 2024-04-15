import CommonModal from "../../CommonModal";
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
import FOLogo from "../../../assets/images/FO-Logo.png";
import moment from "moment/moment";
import { useLazyGetSalesTransactionByIdQuery } from "../../../features/sales-management/api/salesTransactionApi";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { formatPesoAmount } from "../../../utils/CustomFunctions";

function ViewTransactionModal({ ...props }) {
  const { open } = props;
  const selectedRowData = useSelector((state) => state.selectedRow.value);

  //RTK Query
  const [trigger, { data, isFetching }] = useLazyGetSalesTransactionByIdQuery();

  //useEffect
  useEffect(() => {
    if (open) {
      trigger(
        { id: selectedRowData?.transactionNo },
        { preferCacheValue: true }
      );
    }
  }, [open, selectedRowData, trigger]);

  return (
    <CommonModal closeTopRight {...props} width="1000px">
      {/* <Typography
        fontWeight="700"
        fontSize="1.1rem"
        width="100%"
        textAlign="center"
      >
        Transaction Slip
      </Typography> */}

      <Box className="viewTransactionSlipModal">
        <Box className="viewTransactionSlipModal__header">
          <Box className="viewTransactionSlipModal__header__logo">
            <img src={FOLogo} alt="FO-Logo" width="200px" />
          </Box>

          <Typography>
            Purok 06 Brgy. Lara, City of San Fernando, Pampanga
          </Typography>
        </Box>

        <Box className="viewTransactionSlipModal__details">
          <Box className="viewTransactionSlipModal__details__left">
            <Box className="viewTransactionSlipModal__details__left__row">
              <Typography fontWeight="700" textTransform="uppercase">
                Business Name:{" "}
              </Typography>
              <Typography>{data?.businessName}</Typography>
            </Box>

            <Box className="viewTransactionSlipModal__details__left__row">
              <Typography fontWeight="700" textTransform="uppercase">
                Address:{" "}
              </Typography>
              <Typography>
                {`${
                  data?.businessAddress?.houseNumber
                    ? `#${data?.businessAddress.houseNumber}`
                    : ""
                }${
                  data?.businessAddress?.houseNumber &&
                  (data?.businessAddress?.streetName ||
                    data?.businessAddress?.barangayName)
                    ? ", "
                    : ""
                }${
                  data?.businessAddress?.streetName
                    ? `${data?.businessAddress.streetName}`
                    : ""
                }${
                  data?.businessAddress?.streetName &&
                  data?.businessAddress?.barangayName
                    ? ", "
                    : ""
                }${
                  data?.businessAddress?.barangayName
                    ? `${data?.businessAddress.barangayName}`
                    : ""
                }${
                  data?.businessAddress?.city
                    ? `, ${data?.businessAddress.city}`
                    : ""
                }${
                  data?.businessAddress?.province
                    ? `, ${data?.businessAddress.province}`
                    : ""
                }`}
              </Typography>
            </Box>
          </Box>

          <Box className="viewTransactionSlipModal__details__right">
            <Box className="viewTransactionSlipModal__details__right__row">
              <Typography fontWeight="700" textTransform="uppercase">
                Date:{" "}
              </Typography>
              <Typography>
                {moment(data?.createdAt).format("MM/DD/YYYY")}
              </Typography>
            </Box>

            <Box className="viewTransactionSlipModal__details__right__row">
              <Typography fontWeight="700" textTransform="uppercase">
                Charge Invoice No:{" "}
              </Typography>
              <Typography>{data?.chargeInvoiceNo}</Typography>
            </Box>
          </Box>
        </Box>

        <TableContainer className="viewTransactionSlipModal__tableContainer">
          <Table>
            <TableHead className="viewTransactionSlipModal__tableContainer__tableHead">
              <TableRow>
                <TableCell className="viewTransactionSlipModal__tableContainer__tableHead__tableCell">
                  QTY
                </TableCell>
                <TableCell className="viewTransactionSlipModal__tableContainer__tableHead__tableCell">
                  UNIT
                </TableCell>
                <TableCell className="viewTransactionSlipModal__tableContainer__tableHead__tableCell">
                  ARTICLES
                </TableCell>
                <TableCell className="viewTransactionSlipModal__tableContainer__tableHead__tableCell">
                  UNIT PRICE
                </TableCell>
                <TableCell className="viewTransactionSlipModal__tableContainer__tableHead__tableCell">
                  AMOUNT
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody className="viewTransactionSlipModal__tableContainer__tableBody">
              {(data?.items || []).map((item) => (
                <TableRow key={item.itemId}>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.uom}</TableCell>
                  <TableCell sx={{ textTransform: "uppercase" }}>
                    {item.itemDescription}
                  </TableCell>
                  <TableCell>{formatPesoAmount(item.unitPrice)}</TableCell>
                  <TableCell>{formatPesoAmount(item.amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>

            <TableBody
              className="viewTransactionSlipModal__tableContainer__tableBody"
              // sx={{ position: "sticky", bottom: 0 }}
            >
              <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell>
                  <span className="label">SUBTOTAL</span>
                </TableCell>
                <TableCell>{formatPesoAmount(data?.subtotal)}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell>
                  <span className="label">DISCOUNT</span>{" "}
                  <span style={{ fontWeight: "400" }}>
                    ({data?.discountPercentage}%)
                  </span>
                </TableCell>
                <TableCell>{formatPesoAmount(data?.discountAmount)}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>

              <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell>
                  <Box className="labelValueGrid">
                    <span className="label">VATABLE SALES</span>{" "}
                    {formatPesoAmount(data?.vatableSales)}
                  </Box>
                </TableCell>
                <TableCell>
                  <span className="label">TOTAL SALES</span>{" "}
                  <span style={{ fontWeight: "400" }}>(VAT INCLUSIVE)</span>
                </TableCell>
                <TableCell>{formatPesoAmount(data?.totalSales)}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell>
                  <Box className="labelValueGrid">
                    <span className="label">VAT-EXEMPT SALES</span>{" "}
                    {data?.vatExemptSales > 0 &&
                      formatPesoAmount(data?.vatExemptSales)}
                  </Box>
                </TableCell>
                <TableCell>
                  <span className="label">AMOUNT DUE</span>
                </TableCell>
                <TableCell>{formatPesoAmount(data?.amountDue)}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell>
                  <Box className="labelValueGrid">
                    <span className="label">ZERO RATED SALES</span>{" "}
                    {data?.zeroRatedSales > 0 &&
                      formatPesoAmount(data?.zeroRatedSales)}
                  </Box>
                </TableCell>
                <TableCell>
                  <span className="label">ADD VAT</span>
                </TableCell>
                <TableCell>{formatPesoAmount(data?.addVat)}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell>
                  <Box className="labelValueGrid">
                    <span className="label">VAT AMOUNT</span>{" "}
                    {formatPesoAmount(data?.vatAmount)}
                  </Box>
                </TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>

              <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell>
                  <span className="label">TOTAL AMOUNT DUE</span>
                </TableCell>
                <TableCell>{formatPesoAmount(data?.totalAmountDue)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        {/* <img src={UnderConstruction} alt="under-construction" width="400px" />
        <Typography fontWeight="500" fontSize="1.2rem">
          Under Construction!
        </Typography> */}
      </Box>
    </CommonModal>
  );
}

export default ViewTransactionModal;
