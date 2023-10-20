import React, { useEffect, useState } from "react";
import { requestFreebiesSchema } from "../../../schema/schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import CommonDrawer from "../../../components/CommonDrawer";
import { Box, IconButton, TextField } from "@mui/material";
import ControlledAutocomplete from "../../../components/ControlledAutocomplete";
import { Add, Cancel } from "@mui/icons-material";
import { usePostRequestFreebiesMutation } from "../../../features/prospect/api/prospectApi";
import { useGetAllProductsQuery } from "../../../features/setup/api/productsApi";
import { useSelector } from "react-redux";
import SecondaryButton from "../../../components/SecondaryButton";
import ErrorSnackbar from "../../../components/ErrorSnackbar";
import useDisclosure from "../../../hooks/useDisclosure";
import SuccessSnackbar from "../../../components/SuccessSnackbar";

function FreebieForm({ isFreebieFormOpen, onFreebieFormClose }) {
  const [snackbarMessage, setSnackbarMessage] = useState("");

  //Redux States
  const selectedRowData = useSelector((state) => state.selectedRow.value);
  const clientId = selectedRowData?.id || selectedRowData?.clientId;

  //Disclosures
  const {
    isOpen: isSuccessOpen,
    onOpen: onSuccessOpen,
    onClose: onSuccessClose,
  } = useDisclosure();

  const {
    isOpen: isErrorOpen,
    onOpen: onErrorOpen,
    onClose: onErrorClose,
  } = useDisclosure();

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

  const { fields, append, remove } = useFieldArray({
    control,
    name: "freebies",
  });

  //RTK Query
  const [postRequestFreebies] = usePostRequestFreebiesMutation();

  const { data: productData } = useGetAllProductsQuery();

  //Drawer Functions
  const onFreebieSubmit = async (data) => {
    if (hasDuplicateItemCodes(watch("freebies"))) {
      setSnackbarMessage("No duplicate freebies allowed");
      onErrorOpen();
      return;
    }

    try {
      await postRequestFreebies({
        clientId: data.clientId,
        freebies: data.freebies.map((freebie) => ({
          itemId: freebie.itemId.id,
          quantity: freebie.quantity,
        })),
      }).unwrap();

      setSnackbarMessage("Freebies requested successfully");
      handleDrawerClose();
      onSuccessOpen();
    } catch (error) {
      setSnackbarMessage(error?.data?.messages || "Something went wrong");
      onErrorOpen();
      console.log(error);
    }
  };

  const handleDrawerClose = () => {
    reset();
    onFreebieFormClose();
  };

  //Misc Functions
  const handleFreebieError = () => {
    if (fields.length === 1) {
      setSnackbarMessage("Must have at least 1 freebie");
    } else if (fields.length === 5) {
      setSnackbarMessage("Maximum of 5 freebies only");
    }
    onErrorOpen();
  };

  function hasDuplicateItemCodes(data) {
    const itemCodes = new Set();

    for (const item of data) {
      const itemCode = item.itemId.itemCode;
      if (itemCodes.has(itemCode)) {
        return true;
      }
      itemCodes.add(itemCode);
    }

    return false;
  }

  //UseEffects
  useEffect(() => {
    setValue("clientId", clientId);

    return () => {
      setValue("clientId", null);
    };
  }, [selectedRowData]);

  return (
    <>
      <CommonDrawer
        drawerHeader={"Request Freebies"}
        open={isFreebieFormOpen}
        onClose={handleDrawerClose}
        width="1000px"
        disableSubmit={!isValid}
        onSubmit={handleSubmit(onFreebieSubmit)}
      >
        {fields.map((item, index) => (
          <Box
            key={item.id}
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <TextField
              label="Quantity"
              size="small"
              autoComplete="off"
              value={1}
              disabled
              // sx={{ width: "100px" }}
              {...register(`freebies[${index}].quantity`)}
              helperText={errors?.freebies?.quantity?.message}
              error={errors?.freebies?.quantity}
            />

            <ControlledAutocomplete
              name={`freebies[${index}].itemId`}
              control={control}
              options={productData?.items || []}
              getOptionLabel={(option) => option.itemCode}
              disableClearable
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  label="Product Code"
                  required
                  helperText={errors?.itemId?.message}
                  error={errors?.itemId}
                  sx={{ width: "200px" }}
                />
              )}
            />

            <TextField
              label="Item Description"
              size="small"
              autoComplete="off"
              disabled
              value={watch("freebies")[index]?.itemId?.itemDescription || ""}
              defaultValue=""
            />

            <TextField
              label="UOM"
              size="small"
              autoComplete="off"
              disabled
              value={watch("freebies")[index]?.itemId?.uom || ""}
              defaultValue=""
            />

            <IconButton
              sx={{ color: "error.main" }}
              onClick={() => {
                fields.length <= 1
                  ? handleFreebieError()
                  : remove(fields[index]);
              }}
            >
              <Cancel sx={{ fontSize: "30px" }} />
            </IconButton>
          </Box>
        ))}
        <SecondaryButton
          sx={{ width: "150px" }}
          onClick={() => {
            fields.length < 5
              ? append({ itemId: null, quantity: 1 })
              : handleFreebieError();
          }}
        >
          Add Freebie
        </SecondaryButton>
      </CommonDrawer>

      <SuccessSnackbar
        open={isSuccessOpen}
        onClose={onSuccessClose}
        message={snackbarMessage}
      />

      <ErrorSnackbar
        open={isErrorOpen}
        onClose={onErrorClose}
        message={snackbarMessage}
      />
    </>
  );
}

export default FreebieForm;
