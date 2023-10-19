import React from "react";
import { requestFreebiesSchema } from "../../../schema/schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import CommonDrawer from "../../../components/CommonDrawer";
import { Box, IconButton, TextField } from "@mui/material";
import ControlledAutocomplete from "../../../components/ControlledAutocomplete";
import { Add, Cancel } from "@mui/icons-material";

function FreebieForm({ isFreebieFormOpen, onFreebieFormClose }) {
  //React Hook Form
  const {
    handleSubmit,
    formState: { errors, isValid },
    register,
    setValue,
    reset,
    control,
    watch,
    getValues,
  } = useForm({
    resolver: yupResolver(requestFreebiesSchema.schema),
    mode: "onChange",
    defaultValues: requestFreebiesSchema.defaultValues,
  });

  const handleDrawerClose = () => {
    reset();
    onFreebieFormClose();
  };

  console.log(getValues());
  return (
    <CommonDrawer
      drawerHeader={"Request Freebies"}
      open={isFreebieFormOpen}
      onClose={handleDrawerClose}
      width="1000px"
      disableSubmit={!isValid}
      // onSubmit={
      //   // handleSubmit(onDrawerSubmit)
      //   onConfirmOpen
      // }
    >
      <Box sx={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        <TextField
          label="Quantity"
          size="small"
          autoComplete="off"
          required
          value={1}
          disabled
          {...register("freebies.quantity")}
          helperText={errors?.freebies?.quantity?.message}
          error={errors?.freebies?.quantity}
        />
        <TextField
          label="Product Code"
          size="small"
          autoComplete="off"
          required
          // {...register("freebies.quantity")}
          // helperText={errors?.freebies?.quantity?.message}
          // error={errors?.freebies?.quantity}
        />
        <TextField
          label="Item Description"
          size="small"
          autoComplete="off"
          required
          disabled
          // {...register("freebies.quantity")}
          // helperText={errors?.freebies?.quantity?.message}
          // error={errors?.freebies?.quantity}
        />
        <TextField
          label="UOM"
          size="small"
          autoComplete="off"
          required
          disabled
          // {...register("freebies.quantity")}
          // helperText={errors?.freebies?.quantity?.message}
          // error={errors?.freebies?.quantity}
        />
        <IconButton sx={{ color: "error.main" }}>
          <Cancel />
        </IconButton>
        <IconButton sx={{ color: "secondary.main" }}>
          <Add />
        </IconButton>
      </Box>

      {/* <ControlledAutocomplete
        name={"storeTypeId"}
        control={control}
        options={storeTypeData?.storeTypes}
        getOptionLabel={(option) => option.storeTypeName}
        disableClearable
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderInput={(params) => (
          <TextField
            {...params}
            size="small"
            label="Store Type"
            required
            helperText={errors?.storeTypeId?.message}
            error={errors?.storeTypeId}
          />
        )}
      /> */}
    </CommonDrawer>
  );
}

export default FreebieForm;
