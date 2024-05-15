import CommonModal from "../CommonModal";
import { Box, TextField, Typography } from "@mui/material";

import { useSelector } from "react-redux";
import NoData from "../../assets/images/no-data.jpg";

function ViewCDOModal({ ...props }) {
  const { onClose } = props;

  const selectedRowData = useSelector((state) => state.selectedRow.value);

  const handleClose = () => {
    onClose();
  };

  return (
    <>
      <CommonModal
        width="400px"
        {...props}
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
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <img src={NoData} alt="no-data" style={{ width: "230px" }} />
                  <div style={{ textAlign: "center", fontSize: "1.1rem" }}>
                    No CDO found
                  </div>
                </Box>
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
                    </Box>
                  </>
                ))
              )}
            </Box>
          </Box>
        </Box>
      </CommonModal>
    </>
  );
}

export default ViewCDOModal;
