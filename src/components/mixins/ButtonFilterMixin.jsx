import { Box, MenuItem, TextField } from "@mui/material";
import "../../assets/styles/common.styles.scss";
import SecondaryButton from "../SecondaryButton";

function ButtonFilterMixin({
  onButtonClick,
  buttonIcon,
  buttonTitle,
  selectOptions,
  setSelectValue,
}) {
  return (
    <Box className="mixin" sx={{ my: "-20px" }}>
      <Box className="mixin__left">
        <SecondaryButton
          variant="outlined"
          size="medium"
          onClick={onButtonClick}
          endIcon={buttonIcon && buttonIcon}
        >
          {buttonTitle ? buttonTitle : "Button"}
        </SecondaryButton>
      </Box>

      <Box className="mixin__right">
        <TextField
          sx={{ minWidth: "150px" }}
          size="small"
          label="Origin"
          defaultValue={selectOptions?.[0]?.value}
          select
          onChange={(e) => setSelectValue(e.target.value)}
        >
          {selectOptions?.map((item, i) => (
            <MenuItem key={i} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>
    </Box>
  );
}

export default ButtonFilterMixin;
