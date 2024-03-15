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
    <CommonModal width="900px" closeTopRight {...props}>
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
                    className="printTTAModal__body__tableContainer__supportRow__cell"
                    sx={{ borderRight: "1px solid #e0e0e0 !important" }}
                  >
                    Mode of Payment
                  </TableCell>
                  <TableCell className="printTTAModal__body__tableContainer__supportRow__cell">
                    1 up - 1 down (to be collected in 15 days)
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
                    F2 Coverage, Twice a month
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
                    directly delivered to SMAXS
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
                    Near BBD will be replaced before 15 days on expiration date
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
                      JAN TRISTAN MERLLIES - Channel Development Officer
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="printTTAModal__body__tableContainer__contactItem__cell">
                      Email Address: tristanmerilles.rdf@gmail.com
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="printTTAModal__body__tableContainer__contactItem__cell">
                      Contact Number: 0999-2231-940
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
                  <TableRow sx={{ borderTop: "1px solid #e0e0e0 !important" }}>
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
                    SMAXS
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
                  <TableRow sx={{ borderTop: "1px solid #e0e0e0 !important" }}>
                    <TableCell
                      className="printTTAModal__body__tableContainer__customerInfoItem__cell"
                      sx={{ fontWeight: "600" }}
                    >
                      Name:{" "}
                      <span style={{ textTransform: "uppercase" }}>
                        Fhae Bariata
                      </span>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="printTTAModal__body__tableContainer__customerInfoItem__cell">
                      Email Address:
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="printTTAModal__body__tableContainer__customerInfoItem__cell">
                      Contact Number: 0963-2899-999
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
                  <TableRow sx={{ borderTop: "1px solid #e0e0e0 !important" }}>
                    <TableCell
                      className="printTTAModal__body__tableContainer__customerInfoItem__cell"
                      sx={{ fontWeight: "600" }}
                    >
                      Name: <span style={{ textTransform: "uppercase" }}></span>
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
                  <TableRow sx={{ borderTop: "1px solid #e0e0e0 !important" }}>
                    <TableCell
                      className="printTTAModal__body__tableContainer__customerInfoItem__cell"
                      sx={{ fontWeight: "600" }}
                    >
                      Name:{" "}
                      <span style={{ textTransform: "uppercase" }}>
                        Fhae Bariata
                      </span>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="printTTAModal__body__tableContainer__customerInfoItem__cell">
                      Email Address:
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="printTTAModal__body__tableContainer__customerInfoItem__cell">
                      Contact Number: 0963-2899-999
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

              <Box className="printTTAModal__body__tableContainer__signatures__rdf"></Box>

              <Box className="printTTAModal__body__tableContainer__signatures__business"></Box>
            </Box>
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
