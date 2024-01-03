import React, { useContext, useEffect, useState } from "react";
import {
  requestFreebiesSchema,
  requestFreebiesDirectSchema,
} from "../../../schema/schema";
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
import {
  resetFreebies,
  setFreebies,
} from "../../../features/registration/reducers/regularRegistrationSlice";
import useSnackbar from "../../../hooks/useSnackbar";
import {
  DirectReleaseContext,
  DirectReleaseProvider,
} from "../../../context/DirectReleaseContext";
import { notificationApi } from "../../../features/notification/api/notificationApi";

function FreebieForm({
  isFreebieFormOpen,
  onFreebieFormClose,
  updateFreebies,
  direct,
}) {
  const [snackbarMessage, setSnackbarMessage] = useState("");

  //Redux States
  const selectedRowData = useSelector((state) => state.selectedRow.value);
  const clientId = selectedRowData?.id || selectedRowData?.clientId;
  const freebiesDirect = useSelector(
    (state) => state.regularRegistration.value.directFreebie.freebies
  );
  const dispatch = useDispatch();

  const { signatureDirect, photoProofDirect } =
    useContext(DirectReleaseContext);

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

  //React Hook Form
  const {
    handleSubmit,
    formState: { errors, isValid, isDirty },
    register,
    setValue,
    reset,
    control,
    watch,
    getValues,
  } = useForm({
    resolver: yupResolver(
      direct ? requestFreebiesDirectSchema.schema : requestFreebiesSchema.schema
    ),
    mode: "onChange",
    defaultValues: direct
      ? requestFreebiesDirectSchema.defaultValues
      : requestFreebiesSchema.defaultValues,
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

  const { data: productData, isLoading: isProductDataLoading } =
    useGetAllProductsQuery({ Status: true, page: 1, pageSize: 1000 });

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

      dispatch(setSelectedRow(response?.value));
      handleDrawerClose();
      debounce(onRedirectReleaseOpen(), 2000);
      onSuccessOpen();
      dispatch(notificationApi.util.invalidateTags(["Notification"]));
    } catch (error) {
      if (error?.data?.error?.message) {
        setSnackbarMessage(error?.data?.error?.message);
      } else {
        setSnackbarMessage(
          `Error ${
            updateFreebies ? "updating" : "adding"
          } freebies for prospect`
        );
      }

      onErrorOpen();
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

  const { showSnackbar } = useSnackbar();

  const onDirectFreebieSave = (data) => {
    if (hasDuplicateItemCodes(watch("freebies"))) {
      setSnackbarMessage("No duplicate freebies allowed");
      showSnackbar("No duplicated freebies allowed", "error");
      onConfirmSubmitClose();
      return;
    }

    dispatch(setFreebies(data.freebies));
    setSnackbarMessage("Freebies saved successfully");
    onSuccessOpen();
    onConfirmSubmitClose();
    handleDrawerClose();
  };

  //Misc Functions
  const handleFreebieError = () => {
    if (fields.length === 1) {
      showSnackbar("Must have at least 1 freebie", "error");
    } else if (fields.length === 5) {
      showSnackbar("Maximum of 5 freebies only", "error");
    }
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
    if (!direct) {
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
    }
  }, [isFreebieFormOpen]);

  useEffect(() => {
    if (direct && freebiesDirect?.length > 0) {
      setValue("freebies", freebiesDirect);
    }

    if (direct && freebiesDirect?.length === 0) {
      reset();
    }
  }, [isFreebieFormOpen]);

  // useEffect(() => {
  //   if (direct) {
  //     // const freebiesValue = getValues("freebies");
  //     // const freebiesValue = watch("freebies");
  //     // dispatch(setFreebies([...freebiesValue]));
  //   }
  // }, [watch("freebies")]);

  return (
    <>
      <CommonDrawer
        drawerHeader={updateFreebies ? "Update Freebies" : "Request Freebies"}
        open={isFreebieFormOpen}
        onClose={isDirty ? onConfirmCancelOpen : handleDrawerClose}
        width="1000px"
        disableSubmit={
          direct ? !isValid || !photoProofDirect || !signatureDirect : !isValid
        }
        onSubmit={onConfirmSubmitOpen}
        submitLabel={direct && "Save"}
        enableAutoAnimate
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
            <ControlledAutocomplete
              name={`freebies[${index}].itemId`}
              control={control}
              options={productData?.items || []}
              getOptionLabel={(option) => option.itemCode || ""}
              getOptionDisabled={(option) => {
                const freebies = watch("freebies");
                return freebies.some(
                  (item) => item?.itemId?.itemCode === option.itemCode
                );
              }}
              loading={isProductDataLoading}
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
                  sx={{ width: "500px" }}
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

            {/* <TextField
              label="Quantity"
              size="small"
              autoComplete="off"
              // value={1}
              disabled
              // sx={{ width: "100px" }}
              // {...register(`freebies[${index}].quantity`)}
              helperText={errors?.freebies?.quantity?.message}
              error={errors?.freebies?.quantity}
            /> */}

            <Controller
              control={control}
              name={`freebies[${index}].quantity`}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <TextField
                  label="Quantity"
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {watch("freebies").length < 5 && (
            <SecondaryButton
              sx={{ width: "150px" }}
              onClick={() => {
                fields.length < 5
                  ? append({ itemId: null, quantity: 1 })
                  : handleFreebieError();
              }}
              disabled={
                !watch("freebies")[watch("freebies").length - 1]?.itemId
              }
            >
              Add Freebie
            </SecondaryButton>
          )}
          {direct && (
            <SecondaryButton
              sx={{ width: "160px" }}
              onClick={() => {
                // dispatch(setSelectedRow(...selectedRowData, freebies: {}))
                // const freebiesValue = watch("freebies");
                dispatch(setFreebies(watch("freebies")));
                onFreebieReleaseOpen();
              }}
              disabled={
                // freebiesDirect?.length === 0
                !isValid || watch("freebies")?.length === 0
              }
            >
              Release Freebie(s)
            </SecondaryButton>
          )}
        </Box>
      </CommonDrawer>

      <CommonDialog
        open={isConfirmSubmitOpen}
        onClose={onConfirmSubmitClose}
        onYes={
          direct
            ? handleSubmit(onDirectFreebieSave)
            : handleSubmit(onFreebieSubmit)
        }
        isLoading={updateFreebies ? isUpdateLoading : isRequestLoading}
        noIcon
      >
        Confirm {direct ? "save" : "request"} of freebies for{" "}
        <span style={{ textTransform: "uppercase", fontWeight: "bold" }}>
          {selectedRowData?.businessName && !direct
            ? selectedRowData?.businessName
            : "client"}
        </span>
        ?
      </CommonDialog>

      <CommonDialog
        open={isConfirmCancelOpen}
        onClose={onConfirmCancelClose}
        onYes={handleDrawerClose}
      >
        Are you sure you want to cancel {direct ? "save" : "request"} of
        freebies for{" "}
        <span style={{ textTransform: "uppercase", fontWeight: "bold" }}>
          {selectedRowData?.businessName && !direct
            ? selectedRowData?.businessName
            : "client"}
        </span>
        ?
      </CommonDialog>

      <CommonDialog
        open={isRedirectReleaseOpen}
        onClose={onRedirectReleaseClose}
        onYes={handleRedirectReleaseYes}
        noIcon
      >
        Continue to release freebies for{" "}
        <span style={{ textTransform: "uppercase", fontWeight: "bold" }}>
          {selectedRowData?.businessName
            ? selectedRowData?.businessName
            : "client"}
        </span>
        ?
      </CommonDialog>

      <ReleaseFreebieModal
        open={isFreebieReleaseOpen}
        // open={true}
        onClose={onFreebieReleaseClose}
        direct={direct}
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
