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
  RemoveCircle,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import TertiaryButton from "../TertiaryButton";
import CommonDialog from "../CommonDialog";
import useDisclosure from "../../hooks/useDisclosure";
import { useDeletePriceChangeMutation } from "../../features/setup/api/productsApi";
import useSnackbar from "../../hooks/useSnackbar";
import { setSelectedRow } from "../../features/misc/reducers/selectedRowSlice";
import { useDeleteUntagUserInClusterMutation } from "../../features/setup/api/clusterApi";

function ViewCDOModal({ isFetching, data, ...otherProps }) {
  const { onClose, ...noOnCloseProps } = otherProps;

  const dispatch = useDispatch();

  const [manageMode, setManageMode] = useState(false);
  const [CDOIndex, setCDOIndex] = useState(0);

  const { showSnackbar } = useSnackbar();

  const selectedRowData = useSelector((state) => state.selectedRow.value);

  const [deleteUntagUserInCluster, { isLoading: isDeleteLoading }] =
    useDeleteUntagUserInClusterMutation();

  //Disclosures
  const {
    isOpen: isArchiveOpen,
    onOpen: onArchiveOpen,
    onClose: onArchiveClose,
  } = useDisclosure();

  const handleClose = () => {
    setManageMode(false);
    setCDOIndex(0);
    onClose();
  };

  // console.log(data?.find((item) => item.id === selectedRowData?.id));
  const onArchiveSubmit = async () => {
    try {
      await deleteUntagUserInCluster({
        id: selectedRowData?.users?.[CDOIndex]?.userId,
        clusterId: selectedRowData?.id,
      }).unwrap();

      // dispatch(setSelectedRow());
      showSnackbar("CDO successfully tagged!", "success");

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
        showSnackbar("Error untagging CDO", "error");
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
        width="400px"
        {...otherProps}
        closeTopRight
        customOnClose={handleClose}
      >
        <Box className="viewCDOModal">
          <Typography className="viewCDOModal__title">View CDO List</Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: "30px" }}>
            <Box className="viewCDOModal__cluster">
              <Box
                sx={{
                  bgcolor: "secondary.main",
                  padding: "10px",
                  borderRadius: "5px",
                  color: "white !important",
                }}
              >
                Cluster Name
              </Box>
              <TextField
                size="small"
                value={
                  // selectedRowData?.latestPriceChange?.price?.toLocaleString() ||
                  // ""
                  selectedRowData?.cluster || ""
                }
                readOnly
                sx={{ pointerEvents: "none", flex: 1 }}
              />
            </Box>

            <Box className="viewCDOModal__content">
              {selectedRowData?.users?.length === 0 ? (
                <div style={{ textAlign: "center" }}>No CDO found</div>
              ) : (
                selectedRowData?.users?.map((user, index) => (
                  <>
                    <Box
                      key={user.id}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box sx={{ display: "flex", gap: "10px" }}>
                        <Typography sx={{ color: "gray", minWidth: "20px" }}>
                          {index + 1}.
                        </Typography>
                        <Typography sx={{ fontWeight: "500" }}>
                          {user.fullname}
                        </Typography>
                      </Box>

                      <IconButton
                        // sx={{
                        //   position: "absolute",
                        //   right: 0,
                        //   top: 0,
                        // }}
                        color="error"
                        onClick={() => {
                          onArchiveOpen();
                          setCDOIndex(index);
                        }}
                      >
                        <RemoveCircle />
                      </IconButton>
                    </Box>
                  </>
                ))
              )}
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
        Are you sure you want to untag <br />
        <span style={{ fontWeight: "bold", textTransform: "uppercase" }}>
          {selectedRowData?.users?.[CDOIndex]?.fullname}
        </span>
        ?
      </CommonDialog>
    </>
  );
}

export default ViewCDOModal;
