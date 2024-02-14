import React from "react";
import CommonModal from "../../CommonModal";
import { useSelector } from "react-redux";
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
import UnderConstruction from "../../../assets/images/under-construction.svg";
import FOLogo from "../../../assets/images/FO-Logo.png";
import moment from "moment/moment";

function ViewTransactionModal({ ...props }) {
  const selectedRowData = useSelector((state) => state.selectedRow.value);

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
              <Typography>Changioc</Typography>
            </Box>

            <Box className="viewTransactionSlipModal__details__left__row">
              <Typography fontWeight="700" textTransform="uppercase">
                Address:{" "}
              </Typography>
              <Typography>#64 Sto. Cristo, Guagua, Pampanga</Typography>
            </Box>
          </Box>

          <Box className="viewTransactionSlipModal__details__right">
            <Box className="viewTransactionSlipModal__details__right__row">
              <Typography fontWeight="700" textTransform="uppercase">
                Date:{" "}
              </Typography>
              <Typography>{moment().format("MM/DD/YYYY")}</Typography>
            </Box>

            <Box className="viewTransactionSlipModal__details__right__row">
              <Typography fontWeight="700" textTransform="uppercase">
                Charge Invoice No:{" "}
              </Typography>
              <Typography>20016</Typography>
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
              {Array.from({ length: 4 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>1</TableCell>
                  <TableCell>PC</TableCell>
                  <TableCell>Changioc</TableCell>
                  <TableCell>1000.00</TableCell>
                  <TableCell>1000.00</TableCell>
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
                <TableCell>2795.00</TableCell>
              </TableRow>

              <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell>
                  <span className="label">DISCOUNT</span>{" "}
                  <span style={{ fontWeight: "400" }}>(10%)</span>
                </TableCell>
                <TableCell>279.50</TableCell>
              </TableRow>

              {/* <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow> */}

              <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell>
                  <Box className="labelValueGrid">
                    <span className="label">VATABLE SALES</span> 2245.98
                  </Box>
                </TableCell>
                <TableCell>
                  <span className="label">TOTAL SALES</span>{" "}
                  <span style={{ fontWeight: "400" }}>(VAT INCLUSIVE)</span>
                </TableCell>
                <TableCell>2515.50</TableCell>
              </TableRow>

              <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell>
                  <span className="label">VAT-EXEMPT SALES</span>
                </TableCell>
                <TableCell>
                  <span className="label">AMOUNT DUE</span>
                </TableCell>
                <TableCell>2245.98</TableCell>
              </TableRow>

              <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell>
                  <span className="label">ZERO RATED SALES</span>
                </TableCell>
                <TableCell>
                  <span className="label">ADD VAT</span>
                </TableCell>
                <TableCell>269.52</TableCell>
              </TableRow>

              <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell>
                  <Box className="labelValueGrid">
                    <span className="label">VAT AMOUNT</span> 269.52
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
                <TableCell>25515.50</TableCell>
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
