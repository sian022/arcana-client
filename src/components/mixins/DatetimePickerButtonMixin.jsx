import { Box, TextField } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import SecondaryButton from "../SecondaryButton";

function DatetimePickerButtonMixin({
  dateTime,
  setDateTime,
  buttonTitle,
  buttonOnClick,
  buttonProps,
}) {
  return (
    <Box className="mixin" sx={{ my: "-20px" }}>
      <Box className="mixin__left">
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DateTimePicker
            label="Date From"
            value={dateTime}
            onChange={setDateTime}
            slotProps={{
              textField: {
                size: "small",
              },
            }}
            sx={{ width: "240px" }}
          />
        </LocalizationProvider>

        <SecondaryButton {...buttonProps} onClick={buttonOnClick}>
          {buttonTitle || "Button"}
        </SecondaryButton>
      </Box>

      <Box className="mixin__right">
        <TextField type="search" size="small" />
      </Box>
    </Box>
    // </Paper>
  );
}

export default DatetimePickerButtonMixin;
