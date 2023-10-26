import React, { useEffect, useState } from "react";
import { requestFreebiesSchema } from "../../../schema/schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import CommonDrawer from "../../../components/CommonDrawer";
import { Box, IconButton, TextField } from "@mui/material";
import ControlledAutocomplete from "../../../components/ControlledAutocomplete";
import { Add, Cancel } from "@mui/icons-material";
import {
  usePostRequestFreebiesMutation,
  usePutFreebiesInformationMutation,
} from "../../../features/prospect/api/prospectApi";
import { useGetAllProductsQuery } from "../../../features/setup/api/productsApi";
import { useDispatch, useSelector } from "react-redux";
import SecondaryButton from "../../../components/SecondaryButton";
import ErrorSnackbar from "../../../components/ErrorSnackbar";
import useDisclosure from "../../../hooks/useDisclosure";
import SuccessSnackbar from "../../../components/SuccessSnackbar";
import CommonDialog from "../../../components/CommonDialog";
import ReleaseFreebieModal from "../../../components/modals/ReleaseFreebieModal";
import { debounce } from "../../../utils/CustomFunctions";
import { setSelectedRow } from "../../../features/misc/reducers/selectedRowSlice";

function FreebieForm({
  isFreebieFormOpen,
  onFreebieFormClose,
  updateFreebies,
}) {
  const [snackbarMessage, setSnackbarMessage] = useState("");

  //Redux States
  const selectedRowData = useSelector((state) => state.selectedRow.value);
  const clientId = selectedRowData?.id || selectedRowData?.clientId;
  const dispatch = useDispatch();

  //Disclosures
  const {
    isOpen: isConfirmSubmitOpen,
    onOpen: onConfirmSubmitOpen,
    onClose: onConfirmSubmitClose,
  } = useDisclosure();

  const {
    isOpen: isConfirmCancelOpen,
    onOpen: onConfirmCancelOpen,
    onClose: onConfirmCancelClose,
  } = useDisclosure();

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

  const {
    isOpen: isRedirectReleaseOpen,
    onOpen: onRedirectReleaseOpen,
    onClose: onRedirectReleaseClose,
  } = useDisclosure();

  const {
    isOpen: isFreebieReleaseOpen,
    onOpen: onFreebieReleaseOpen,
    onClose: onFreebieReleaseClose,
  } = useDisclosure();

  console.log(isFreebieReleaseOpen);
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
  const [postRequestFreebies, { isLoading: isRequestLoading }] =
    usePostRequestFreebiesMutation();
  const [putFreebiesInformation, { isLoading: isUpdateLoading }] =
    usePutFreebiesInformationMutation();

  const { data: productData } = useGetAllProductsQuery({ Status: true });

  //Drawer Functions
  const onFreebieSubmit = async (data) => {
    if (hasDuplicateItemCodes(watch("freebies"))) {
      setSnackbarMessage("No duplicate freebies allowed");
      onErrorOpen();
      onConfirmSubmitClose();
      return;
    }

    try {
      let response;

      if (updateFreebies) {
        response = await putFreebiesInformation({
          id: data.clientId,
          // freebieRequestId: data.freebieRequestId,
          params: { freebieId: data.freebieRequestId },
          freebies: data.freebies.map((freebie) => ({
            itemId: freebie.itemId.itemId,
            quantity: freebie.quantity,
          })),
        });
        setSnackbarMessage("Freebies updated successfully");
      } else {
        response = await postRequestFreebies({
          clientId: data.clientId,
          freebies: data.freebies.map((freebie) => ({
            itemId: freebie.itemId.id,
            quantity: freebie.quantity,
          })),
        }).unwrap();
        setSnackbarMessage("Freebies requested successfully");
      }

      dispatch(setSelectedRow(response?.data));
      handleDrawerClose();
      debounce(onRedirectReleaseOpen(), 2000);
      onSuccessOpen();
    } catch (error) {
      setSnackbarMessage(error?.data?.messages || "Something went wrong");
      onErrorOpen();
      console.log(error);
    }

    onConfirmSubmitClose();
  };

  const handleDrawerClose = () => {
    reset();
    onFreebieFormClose();
    onConfirmCancelClose();
  };

  const handleRedirectReleaseYes = () => {
    onFreebieReleaseOpen();
    onRedirectReleaseClose();
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
    const freebiesLength = selectedRowData?.freebies?.length;

    if (updateFreebies && isFreebieFormOpen) {
      const originalFreebies =
        selectedRowData?.freebies?.[freebiesLength - 1]?.freebieItems || [];

      const transformedFreebies = originalFreebies.map((item) => ({
        itemId: item,
        quantity: 1,
        itemDescription: item.itemDescription,
        uom: item.uom,
      }));

      setValue("freebies", transformedFreebies);
      setValue(
        "freebieRequestId",
        selectedRowData?.freebies?.[freebiesLength - 1]?.freebieRequestId ||
          null
      );
    }

    return () => {
      setValue("clientId", null);
    };
  }, [isFreebieFormOpen]);

  // useEffect(() => {
  //   onFreebieReleaseOpen();
  // }, [isFreebieFormOpen]);
  return (
    <>
      <CommonDrawer
        drawerHeader={updateFreebies ? "Update Freebies" : "Request Freebies"}
        open={isFreebieFormOpen}
        onClose={onConfirmCancelOpen}
        width="1000px"
        disableSubmit={!isValid}
        onSubmit={onConfirmSubmitOpen}
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
              getOptionLabel={(option) => option.itemCode || ""}
              disableClearable
              // isOptionEqualToValue={(option, value) => option.id === value.id}
              isOptionEqualToValue={(option, value) => true}
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
              onChange={(_, value) => {
                setValue(
                  `freebies[${index}].itemDescription`,
                  value?.itemDescription
                );
                setValue(`freebies[${index}].uom`, value?.uom);
                return value;
              }}
            />

            <Controller
              control={control}
              name={`freebies[${index}].itemDescription`}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <TextField
                  label="Item Description"
                  size="small"
                  autoComplete="off"
                  disabled
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value || ""}
                  ref={ref}
                />
              )}
            />

            <Controller
              control={control}
              name={`freebies[${index}].uom`}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <TextField
                  label="UOM"
                  size="small"
                  autoComplete="off"
                  disabled
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value || ""}
                  ref={ref}
                />
              )}
            />

            <IconButton
              sx={{ color: "error.main" }}
              onClick={() => {
                fields.length <= 1
                  ? handleFreebieError()
                  : // : remove(fields[index]);
                    remove(index);
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

      <CommonDialog
        open={isConfirmSubmitOpen}
        onClose={onConfirmSubmitClose}
        onYes={handleSubmit(onFreebieSubmit)}
        isLoading={updateFreebies ? isUpdateLoading : isRequestLoading}
        noIcon
      >
        Confirm request of freebies for{" "}
        <span style={{ textTransform: "uppercase", fontWeight: "bold" }}>
          {selectedRowData.businessName
            ? selectedRowData.businessName
            : "client"}
        </span>
        ?
      </CommonDialog>

      <CommonDialog
        open={isConfirmCancelOpen}
        onClose={onConfirmCancelClose}
        onYes={handleDrawerClose}
      >
        Are you sure you want to cancel request of freebies for{" "}
        <span style={{ textTransform: "uppercase", fontWeight: "bold" }}>
          {selectedRowData.businessName
            ? selectedRowData.businessName
            : "client"}
        </span>
        ?
      </CommonDialog>

      <CommonDialog
        open={isRedirectReleaseOpen}
        onClose={onRedirectReleaseClose}
        onYes={handleRedirectReleaseYes}
      >
        Continue to release freebies for{" "}
        <span style={{ textTransform: "uppercase", fontWeight: "bold" }}>
          {selectedRowData.businessName
            ? selectedRowData.businessName
            : "client"}
        </span>
        ?
      </CommonDialog>

      <ReleaseFreebieModal
        open={isFreebieReleaseOpen}
        // open={true}
        onClose={onFreebieReleaseClose}
      />

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
