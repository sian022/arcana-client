import React, { useEffect, useRef, useState } from "react";
import CommonModal from "../CommonModal";
import {
  Box,
  IconButton,
  InputAdornment,
  Step,
  StepButton,
  StepContent,
  StepIcon,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import SecondaryButton from "../SecondaryButton";
import {
  Cancel,
  Check,
  CheckCircle,
  Circle,
  Close,
  Delete,
  EventNote,
  HowToReg,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import TertiaryButton from "../TertiaryButton";
import CommonDialog from "../CommonDialog";
import useDisclosure from "../../hooks/useDisclosure";
import { useDeletePriceChangeMutation } from "../../features/setup/api/productsApi";
import useSnackbar from "../../hooks/useSnackbar";
import { setSelectedRow } from "../../features/misc/reducers/selectedRowSlice";

function PriceDetailsModal({ isFetching, data, ...otherProps }) {
  const { onClose, ...noOnCloseProps } = otherProps;

  const dispatch = useDispatch();

  const [manageMode, setManageMode] = useState(false);
  const [futurePriceIndex, setFuturePriceIndex] = useState(0);

  const { showSnackbar } = useSnackbar();

  const selectedRowData = useSelector((state) => state.selectedRow.value);

  const [deletePriceChange, { isLoading: isDeleteLoading }] =
    useDeletePriceChangeMutation();

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

  // console.log(selectedRowData);
  // console.log(data?.find((item) => item.id === selectedRowData?.id));
  const onArchiveSubmit = async () => {
    try {
      await deletePriceChange(
        selectedRowData?.futurePriceChanges?.[futurePriceIndex]?.id
      ).unwrap();

      // dispatch(setSelectedRow());
      showSnackbar("Price change successfully deleted!", "success");

      // if (!isFetching) {
      //   dispatch(
      //     setSelectedRow(data?.find((item) => item.id === selectedRowData?.id))
      //   );
      // }

      onArchiveClose();
    } catch (error) {
      if (error?.data?.error?.message) {
        showSnackbar(error?.data?.error?.message, "error");
      } else {
        showSnackbar("Error deleting price change", "error");
      }
    }
  };

  useEffect(() => {
    if (!isFetching) {
      dispatch(
        setSelectedRow(data?.find((item) => item.id === selectedRowData?.id))
      );
    }
  }, [isFetching]);

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

          {/* <Box
          sx={{
            position: "absolute",
            right: "20px",
            top: "20px",
          }}
        >
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box> */}

          <Box sx={{ display: "flex", flexDirection: "column", gap: "30px" }}>
            <Box className="priceChangeModal__currentPrice">
              <Box className="priceChangeModal__currentPrice__left">
                <Box
                  sx={{
                    bgcolor: "secondary.main",
                    padding: "10px",
                    borderRadius: "5px",
                    color: "white !important",
                  }}
                >
                  Current Price
                </Box>
                <Box>
                  <TextField
                    size="small"
                    value={
                      // selectedRowData?.latestPriceChange?.price?.toLocaleString() ||
                      // ""
                      selectedRowData?.priceChangeHistories?.[0]?.price?.toLocaleString() ||
                      ""
                    }
                    readOnly
                    sx={{ pointerEvents: "none" }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">₱</InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </Box>

              <Box className="priceChangeModal__currentPrice__right">
                <Box
                  sx={{
                    bgcolor: "secondary.main",
                    padding: "10px",
                    borderRadius: "5px",
                    color: "white !important",
                  }}
                >
                  Last Updated
                </Box>
                <Box>
                  <TextField
                    size="small"
                    readOnly
                    value={
                      // moment(
                      //   selectedRowData?.latestPriceChange?.effectivityDate
                      // ).format("MMMM D") || ""

                      moment(
                        selectedRowData?.priceChangeHistories?.[0]
                          ?.effectivityDate
                      ).format("MMMM D") || ""
                    }
                    sx={{ pointerEvents: "none" }}
                  />
                </Box>
              </Box>
            </Box>

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
                    disabled={selectedRowData?.futurePriceChanges?.length === 0}
                  >
                    {manageMode ? "Done" : "Manage"}
                  </TertiaryButton>
                </Box>

                <Box className="priceChangeModal__content__left__body">
                  {selectedRowData?.futurePriceChanges?.length > 0 ? (
                    <Stepper orientation="vertical">
                      {selectedRowData?.futurePriceChanges?.map(
                        (item, index) => (
                          <Step expanded>
                            <StepLabel sx={{ position: "relative" }}>
                              <span style={{ fontWeight: "600" }}>
                                ₱ {item.price?.toLocaleString()}
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
                              <Typography fontSize="14px">
                                Effectivity Date:{" "}
                                <span style={{ fontWeight: "500" }}>
                                  {moment(item.effectivityDate).format(
                                    "MMMM D"
                                  )}
                                </span>
                              </Typography>
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
                  {selectedRowData?.priceChangeHistories?.length > 0 ? (
                    <Stepper
                      orientation="vertical"
                      // activeStep={null}
                    >
                      {selectedRowData?.priceChangeHistories?.map(
                        (item, index) => (
                          <Step active expanded>
                            <StepLabel
                              sx={{ position: "relative" }}
                              StepIconProps={{ icon: "" }}
                            >
                              <span style={{ fontWeight: "600" }}>
                                ₱ {item.price?.toLocaleString()}
                              </span>
                            </StepLabel>
                            <StepContent>
                              <Typography fontSize="14px">
                                Effectivity Date:{" "}
                                <span style={{ fontWeight: "500" }}>
                                  {moment(item.effectivityDate).format(
                                    "MMMM D"
                                  )}
                                </span>
                              </Typography>
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
          </Box>
        </Box>
      </CommonModal>

      <CommonDialog
        open={isArchiveOpen}
        onClose={onArchiveClose}
        onYes={onArchiveSubmit}
        isLoading={isDeleteLoading}
        // noIcon={!status}
      >
        Are you sure you want to archive price change of <br />
        <span style={{ fontWeight: "bold", textTransform: "uppercase" }}>
          ₱{" "}
          {selectedRowData?.futurePriceChanges?.[
            futurePriceIndex
          ]?.price?.toLocaleString()}
        </span>
        ?
      </CommonDialog>
    </>
  );
}

export default PriceDetailsModal;
