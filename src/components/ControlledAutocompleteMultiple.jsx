import { Autocomplete } from "@mui/material";
import React from "react";
import { Controller } from "react-hook-form";

function ControlledAutocompleteMultiple({
  name,
  control,
  onChange: onValueChange,
  ...autocomplete
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Autocomplete
          {...autocomplete}
          value={field.value}
          onChange={(_, value) => field.onChange(value)}
        />
      )}
    />
  );
}

export default ControlledAutocompleteMultiple;
