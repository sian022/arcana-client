import { Box, CircularProgress, Typography } from "@mui/material";
import CommonModal from "../CommonModal";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import SecondaryButton from "../SecondaryButton";
import DangerButton from "../DangerButton";
import moment from "moment";

function ExportPriceModal({
  onExport,
  isExportLoading,
  dateTime,
  setDateTime,
  ...props
}) {
  const { onClose } = props;

  //Functions
  const handleClose = () => {
    onClose();
    setDateTime(moment());
  };

  return (
    <CommonModal
      width="340px"
      {...props}
      closeTopRight
      disableCloseTopRight={isExportLoading}
    >
      <Box className="exportPriceModal">
        <Typography className="exportPriceModal__title">
          Export Price
        </Typography>

        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DateTimePicker
            label="Date & Time"
            value={dateTime}
            onChange={setDateTime}
            slotProps={{
              textField: {
                size: "small",
              },
            }}
          />
        </LocalizationProvider>

        <Box className="exportPriceModal__actions">
          <DangerButton onClick={handleClose}>Close</DangerButton>
          <SecondaryButton disabled={isExportLoading} onClick={onExport}>
            {isExportLoading ? <CircularProgress size="20px" /> : "Export"}
          </SecondaryButton>
        </Box>
      </Box>
    </CommonModal>
  );
}

export default ExportPriceModal;
