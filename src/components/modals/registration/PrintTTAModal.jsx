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
import CommonModal from "../../CommonModal";
import DangerButton from "../../DangerButton";
import SecondaryButton from "../../SecondaryButton";

function PrintTTAModal({ onPrint, ...props }) {
  const { onClose } = props;

  return (
    <CommonModal width="800px" closeTopRight {...props}>
      <Box className="printTTAModal">
        <Typography className="printTTAModal__title">
          Print Term Trade Agreement
        </Typography>

        <Box className="printTTAModal__body">
          <Typography className="printTTAModal__body__title">
            Special Agreement Between RDFFLFI and SMAXS
          </Typography>

          <TableContainer className="printTTAModal__body__tableContainer">
            <Table>
              <TableHead className="printTTAModal__body__tableContainer__tableHead">
                <TableRow className="printTTAModal__body__tableContainer__tableHead__tableRow">
                  <TableCell
                    className="printTTAModal__body__tableContainer__tableHead__tableCell"
                    sx={{ borderRight: "1px solid #e0e0e0 !important" }}
                  >
                    Customer Name:
                  </TableCell>
                  <TableCell className="printTTAModal__body__tableContainer__tableHead__tableCell">
                    SMAXS
                  </TableCell>
                </TableRow>

                <TableRow className="printTTAModal__body__tableContainer__tableHead__tableRow">
                  <TableCell
                    className="printTTAModal__body__tableContainer__tableHead__tableCell"
                    sx={{ borderRight: "1px solid #e0e0e0 !important" }}
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
                  {Array.from({ length: 12 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell
                        sx={{ borderRight: "1px solid #e0e0e0 !important" }}
                      >
                        <Box className="printTTAModal__body__tableContainer__productsAndOthers__product">
                          <span className="printTTAModal__body__tableContainer__productsAndOthers__product__number">
                            {index + 1}.
                          </span>{" "}
                          Rapsarap Chicken Nuggets 200g
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
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
                <Typography>Listing Fee - 24,000 (2,000 per SKU)</Typography>
                <Typography>Electricty Allowance – 2,000 per month</Typography>
                <Typography>Vendors Fee - 10,000</Typography>

                <Typography>Discount - 5%</Typography>
              </Box>
            </Box>

            <Table>
              <TableBody>
                <TableRow
                  sx={{ borderTop: "1px solid #e0e0e0 !important" }}
                  className="printTTAModal__body__tableContainer__supportRow"
                >
                  <TableCell
                    sx={{ borderRight: "1px solid #e0e0e0 !important" }}
                  >
                    Mode of Payment
                  </TableCell>
                  <TableCell>
                    1 up - 1 down (to be collected in 15 days)
                  </TableCell>
                </TableRow>

                <TableRow className="printTTAModal__body__tableContainer__supportRow">
                  <TableCell
                    sx={{ borderRight: "1px solid #e0e0e0 !important" }}
                  >
                    Delivery Schedule
                  </TableCell>
                  <TableCell>Every Monday and Thursday</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box className="printTTAModal__actions">
          <DangerButton onClick={onClose}>Close</DangerButton>
          <SecondaryButton onClick={onPrint}>Print</SecondaryButton>
        </Box>
      </Box>
    </CommonModal>
  );
}

export default PrintTTAModal;
