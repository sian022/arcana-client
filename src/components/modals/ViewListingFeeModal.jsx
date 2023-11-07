import React from "react";
import CommonModal from "../CommonModal";
import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Close } from "@mui/icons-material";

function ViewListingFeeModal({ approval, ...props }) {
  const { onClose, ...noOnClose } = props;

  const customRibbonContent = (
    // <Box sx={{ display: "flex", flex: 1, gap: "10px" }}>
    <>
      <Box className="viewListingFeeModal__headers">
        <Typography className="viewListingFeeModal__headers__title">
          Listing Fee Form
        </Typography>
        <IconButton
          sx={{
            color: "white !important",
            position: "absolute",
            right: "20px",
          }}
          onClick={onClose}
        >
          <Close />
        </IconButton>
      </Box>
    </>

    // </Box>
  );

  return (
    <CommonModal
      width="900px"
      height="660px"
      disablePadding
      ribbon
      customRibbonContent={customRibbonContent}
      {...props}
    >
      <Box className="viewListingFeeModal">
        <Box className="viewListingFeeModal__customerDetails">
          <Box className="viewListingFeeModal__customerDetails__left">
            <Box
              sx={{
                bgcolor: "secondary.main",
                padding: "10px",
                borderRadius: "5px",
                color: "white !important",
              }}
            >
              Business Name
            </Box>
            <Box>
              <TextField size="small" value="Match and Meats" readOnly />
            </Box>
          </Box>

          <Box className="viewListingFeeModal__customerDetails__right">
            <Box
              sx={{
                bgcolor: "secondary.main",
                padding: "10px",
                borderRadius: "5px",
                color: "white !important",
              }}
            >
              Customer Name
            </Box>
            <Box>
              <TextField size="small" readOnly value="Robert H. Lo" />
            </Box>
          </Box>
        </Box>
        <Box className="viewListingFeeModal__table">
          <TableContainer
            sx={{
              maxHeight: "350px",
              overflow: "auto",
              width: "815px",
              borderRadius: "10px",
            }}
          >
            <Table>
              <TableHead
              // sx={{
              //   bgcolor: "#fff",
              // }}
              >
                <TableRow>
                  <TableCell>Item Code</TableCell>
                  <TableCell>Item Description</TableCell>
                  <TableCell>UOM</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell>Unit Cost</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {/* {selectedRowData?.freebies?.[
                  freebiesLength - 1
                ].freebieItems?.map((item, i) => ( */}
                <TableRow>
                  <TableCell>52319</TableCell>
                  <TableCell>Rapsarap Chicken Nuggets 200G</TableCell>
                  <TableCell>PACK</TableCell>
                  <TableCell>1</TableCell>
                  <TableCell>4000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>52319</TableCell>
                  <TableCell>Rapsarap Chicken Nuggets 200G</TableCell>
                  <TableCell>PACK</TableCell>
                  <TableCell>1</TableCell>
                  <TableCell>4000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>52319</TableCell>
                  <TableCell>Rapsarap Chicken Nuggets 200G</TableCell>
                  <TableCell>PACK</TableCell>
                  <TableCell>1</TableCell>
                  <TableCell>4000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>52319</TableCell>
                  <TableCell>Rapsarap Chicken Nuggets 200G</TableCell>
                  <TableCell>PACK</TableCell>
                  <TableCell>1</TableCell>
                  <TableCell>4000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>52319</TableCell>
                  <TableCell>Rapsarap Chicken Nuggets 200G</TableCell>
                  <TableCell>PACK</TableCell>
                  <TableCell>1</TableCell>
                  <TableCell>4000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>52319</TableCell>
                  <TableCell>Rapsarap Chicken Nuggets 200G</TableCell>
                  <TableCell>PACK</TableCell>
                  <TableCell>1</TableCell>
                  <TableCell>4000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>52319</TableCell>
                  <TableCell>Rapsarap Chicken Nuggets 200G</TableCell>
                  <TableCell>PACK</TableCell>
                  <TableCell>1</TableCell>
                  <TableCell>4000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>52319</TableCell>
                  <TableCell>Rapsarap Chicken Nuggets 200G</TableCell>
                  <TableCell>PACK</TableCell>
                  <TableCell>1</TableCell>
                  <TableCell>4000</TableCell>
                </TableRow>
                {/* ))} */}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </CommonModal>
  );
}

export default ViewListingFeeModal;
