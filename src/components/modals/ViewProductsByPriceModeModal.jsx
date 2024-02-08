import React, { useEffect } from "react";
import CommonModal from "../CommonModal";
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
import { useSelector } from "react-redux";
import { useLazyGetAllItemsByPriceModeIdQuery } from "../../features/setup/api/priceModeItemsApi";
import NoProductFound from "../../assets/images/NoProductFound.svg";
import TaggedProductsTableSkeleton from "../skeletons/TaggedProductsTableSkeleton";

function ViewProductsByPriceModeModal({ ...props }) {
  const { open } = props;

  const selectedRowData = useSelector((state) => state.selectedRow.value);

  //RTK Query
  const [triggerProducts, { data, isSuccess, isFetching }] =
    useLazyGetAllItemsByPriceModeIdQuery();

  //UseEffects
  useEffect(() => {
    if (!!open) {
      triggerProducts(
        {
          priceModeId: selectedRowData?.id,
        },
        { preferCacheValue: true }
      );
    }
  }, [open]);

  return (
    <CommonModal width="800px" closeTopRight {...props}>
      <Box className="viewProductsByPriceModal">
        <Typography className="viewProductsByPriceModal__title">
          Products List
        </Typography>

        <Box className="viewProductsByPriceModal__priceMode">
          <Box className="viewProductsByPriceModal__priceMode__code">
            {selectedRowData?.priceModeCode}
          </Box>

          <Box className="viewProductsByPriceModal__priceMode__description">
            {selectedRowData?.priceModeDescription}
          </Box>

          <Typography className="viewProductsByPriceModal__priceMode__value"></Typography>
        </Box>

        <TableContainer sx={{ height: "400px" }}>
          <Table>
            <TableHead sx={{ bgcolor: "white !important" }}>
              <TableRow>
                <TableCell sx={{ color: "black !important" }}>
                  Product Code
                </TableCell>
                <TableCell sx={{ color: "black !important" }}>
                  Item Description
                </TableCell>
                <TableCell sx={{ color: "black !important" }}>UOM</TableCell>
                <TableCell sx={{ color: "black !important" }}>Price</TableCell>
              </TableRow>
            </TableHead>

            {data?.priceModeItems?.length === 0 ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={4}>
                    <Box className="viewProductsByPriceModal__noProductsFound">
                      <img
                        src={NoProductFound}
                        alt="no-products"
                        width="150px"
                      />
                    </Box>
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <>
                {isFetching ? (
                  <TaggedProductsTableSkeleton />
                ) : (
                  <TableBody>
                    {data?.priceModeItems?.map((item) => (
                      <TableRow key={item.priceModeItemId}>
                        <TableCell>{item.itemCode}</TableCell>
                        <TableCell>{item.itemDescription}</TableCell>
                        <TableCell>{item.uom}</TableCell>
                        <TableCell>₱{item.currentPrice}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                )}
              </>
            )}
          </Table>
        </TableContainer>
      </Box>
    </CommonModal>
  );
}

export default ViewProductsByPriceModeModal;
