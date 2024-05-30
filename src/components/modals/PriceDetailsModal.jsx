import { useEffect, useState } from "react";
import CommonModal from "../CommonModal";
import {
  Box,
  IconButton,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import TertiaryButton from "../TertiaryButton";
import CommonDialog from "../common/CommonDialog";
import useDisclosure from "../../hooks/useDisclosure";
import useSnackbar from "../../hooks/useSnackbar";
import { setSelectedRow } from "../../features/misc/reducers/selectedRowSlice";
import {
  useDeletePriceChangeMutation,
  useLazyGetPriceChangeByPriceModeItemIdQuery,
} from "../../features/setup/api/priceModeItemsApi";
import PriceDetailsSkeleton from "../skeletons/PriceDetailsSkeleton";

function PriceDetailsModal({ isFetching, data, ...otherProps }) {
  const { open, onClose } = otherProps;
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();

  const [manageMode, setManageMode] = useState(false);
  const [futurePriceIndex, setFuturePriceIndex] = useState(0);

  const snackbar = useSnackbar();

  const selectedRowData = useSelector((state) => state.selectedRow.value);

  //RTK Query
  const [deletePriceChange, { isLoading: isDeleteLoading }] =
    useDeletePriceChangeMutation();

  const [
    triggerPriceChange,
    { data: priceChangeData, isFetching: isPriceChangeFetching },
  ] = useLazyGetPriceChangeByPriceModeItemIdQuery();

  //Disclosures
  const {
    isOpen: isArchiveOpen,
    onOpen: onArchiveOpen,
    onClose: onArchiveClose,
  } = useDisclosure();

  const handleClose = () => {
    setManageMode(false);
    setFuturePriceIndex(0);
    onClose();
  };

  const onArchiveSubmit = async () => {
    try {
      await deletePriceChange({
        id: priceChangeData?.futurePriceChanges?.[futurePriceIndex]?.id,
      }).unwrap();

      snackbar({
        message: "Price change successfully removed!",
        variant: "success",
      });

      onArchiveClose();
    } catch (error) {
      if (error?.data?.error?.message) {
        snackbar({ message: error?.data?.error?.message, variant: "error" });
      } else {
        snackbar({ message: "Error deleting price change", variant: "error" });
      }
    }
  };

  useEffect(() => {
    if (!isFetching) {
      dispatch(
        setSelectedRow(data?.find((item) => item.id === selectedRowData?.id))
      );
    }
  }, [isFetching, dispatch, data, selectedRowData?.id]);

  useEffect(() => {
    if (open) {
      setIsLoading(true);

      triggerPriceChange(
        {
          PriceModeId: selectedRowData?.priceModeId,
          ItemId: selectedRowData?.itemId,
        },
        { preferCacheValue: true }
      ).then(() => setIsLoading(false));
    }
  }, [
    open,
    selectedRowData?.priceModeId,
    selectedRowData?.itemId,
    triggerPriceChange,
  ]);

  return (
    <>
      <CommonModal
        width="760px"
        {...otherProps}
        closeTopRight
        customOnClose={handleClose}
      >
        <Box className="priceChangeModal">
          <Typography className="priceChangeModal__title">
            Price Details
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: "30px" }}>
            <Box className="priceChangeModal__currentPrice">
              <Box className="priceChangeModal__currentPrice__left">
                <Box
                  sx={{
                    bgcolor: "secondary.main",
                    padding: "10px",
                    borderRadius: "5px",
                    color: "white !important",
                    width: "150px",
                  }}
                >
                  Item Code
                </Box>

                <TextField
                  size="small"
                  value={selectedRowData?.itemCode?.toUpperCase() || ""}
                  readOnly
                  sx={{ pointerEvents: "none", width: "100%" }}
                />
              </Box>

              <Box className="priceChangeModal__currentPrice__right">
                <Box
                  sx={{
                    bgcolor: "secondary.main",
                    padding: "10px",
                    borderRadius: "5px",
                    color: "white !important",
                    width: "150px",
                  }}
                >
                  Price Mode
                </Box>

                <TextField
                  size="small"
                  readOnly
                  value={selectedRowData?.priceModeCode?.toUpperCase() || ""}
                  sx={{ pointerEvents: "none", width: "100%" }}
                />
              </Box>
            </Box>

            {isLoading || isPriceChangeFetching ? (
              <PriceDetailsSkeleton />
            ) : (
              <Box className="priceChangeModal__content">
                <Box className="priceChangeModal__content__left">
                  <Box
                    sx={{ display: "flex", gap: "20px", alignItems: "center" }}
                  >
                    <Typography className="priceChangeModal__content__left__title">
                      Future Prices
                    </Typography>
                    <TertiaryButton
                      sx={{ maxHeight: "25px" }}
                      onClick={() => setManageMode((prev) => !prev)}
                      disabled={
                        priceChangeData?.futurePriceChanges?.length === 0
                      }
                    >
                      {manageMode ? "Done" : "Manage"}
                    </TertiaryButton>
                  </Box>

                  <Box className="priceChangeModal__content__left__body">
                    {priceChangeData?.futurePriceChanges?.length > 0 ? (
                      <Stepper orientation="vertical">
                        {priceChangeData?.futurePriceChanges?.map(
                          (item, index) => (
                            <Step key={index} expanded>
                              <StepLabel sx={{ position: "relative" }}>
                                <span style={{ fontWeight: "600" }}>
                                  ₱{" "}
                                  {item.price?.toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
                                </span>
                                {manageMode && (
                                  <IconButton
                                    sx={{
                                      position: "absolute",
                                      right: 0,
                                      top: 0,
                                    }}
                                    color="error"
                                    onClick={() => {
                                      onArchiveOpen();
                                      setFuturePriceIndex(index);
                                    }}
                                  >
                                    <Delete />
                                  </IconButton>
                                )}
                              </StepLabel>

                              <StepContent>
                                <Box sx={{ display: "flex", gap: "5px" }}>
                                  <Typography fontSize="14px">
                                    Effectivity Date:{" "}
                                  </Typography>

                                  <Typography fontWeight="500" fontSize="14px">
                                    {moment(item.effectivityDate).format(
                                      "MMMM D, hh:mm a"
                                    )}
                                  </Typography>
                                </Box>
                              </StepContent>
                            </Step>
                          )
                        )}
                      </Stepper>
                    ) : (
                      <div>No future prices</div>
                    )}
                  </Box>
                </Box>
                <Box className="priceChangeModal__content__right">
                  <Typography className="priceChangeModal__content__right__title">
                    Price History
                  </Typography>

                  <Box className="priceChangeModal__content__right__body">
                    {priceChangeData?.priceChangeHistories?.length > 0 ? (
                      <Stepper
                        orientation="vertical"
                        // activeStep={null}
                      >
                        {priceChangeData?.priceChangeHistories?.map(
                          (item, index) => (
                            <Step key={index} active expanded>
                              <StepLabel
                                sx={{ position: "relative" }}
                                StepIconProps={{ icon: "" }}
                              >
                                <span style={{ fontWeight: "600" }}>
                                  ₱{" "}
                                  {item.price?.toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
                                </span>
                              </StepLabel>

                              <StepContent>
                                <Box sx={{ display: "flex", gap: "5px" }}>
                                  <Typography fontSize="14px">
                                    Effectivity Date:{" "}
                                  </Typography>

                                  <Typography fontSize="14px" fontWeight="500">
                                    {moment(item.effectivityDate).format(
                                      "MMMM D, hh:mm a"
                                    )}
                                  </Typography>
                                </Box>
                              </StepContent>
                            </Step>
                          )
                        )}
                      </Stepper>
                    ) : (
                      <div>No price history</div>
                    )}
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </CommonModal>

      <CommonDialog
        open={isArchiveOpen}
        onClose={onArchiveClose}
        onYes={onArchiveSubmit}
        isLoading={isDeleteLoading}
        // question={!status}
      >
        Are you sure you want to remove price change of <br />
        <span style={{ fontWeight: "bold", textTransform: "uppercase" }}>
          ₱{" "}
          {priceChangeData?.futurePriceChanges?.[
            futurePriceIndex
          ]?.price?.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
        ?
      </CommonDialog>
    </>
  );
}

export default PriceDetailsModal;
