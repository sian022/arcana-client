import { Autocomplete } from "@mui/material";
import { Controller } from "react-hook-form";

function ControlledAutocomplete({
  name,
  control,
  onChange: onValueChange,
  ...autocomplete
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const { value, onChange: setValue } = field;

        return (
          <Autocomplete
            {...autocomplete}
            value={value}
            onChange={(e, value) => {
              if (onValueChange) return setValue(onValueChange(e, value));

              setValue(value);
            }}
          />
        );
      }}
    />
  );
}

export default ControlledAutocomplete;
