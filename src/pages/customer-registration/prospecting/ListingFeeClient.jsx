import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Checkbox,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { listingFeeForRegistrationSchema } from "../../../schema/schema";
import { useDispatch, useSelector } from "react-redux";
import SecondaryButton from "../../../components/SecondaryButton";
import { RemoveCircleOutline } from "@mui/icons-material";
import { NumericFormat } from "react-number-format";
import ControlledAutocomplete from "../../../components/ControlledAutocomplete";
import { useGetAllProductsQuery } from "../../../features/setup/api/productsApi";
import { useEffect, useState } from "react";
import {
  resetListingFeeForRegistration,
  setIsAgree,
  setIsListingFeeValid,
  setListingFeeForRegistration,
} from "../../../features/registration/reducers/regularRegistrationSlice";

function ListingFeeClient() {
  const [totalAmount, setTotalAmount] = useState(0);

  //Hooks
  const dispatch = useDispatch();
  const listingFeesForRegistration = useSelector(
    (state) =>
      state.regularRegistration.value.listingFeeForRegistration.listingItems
  );
  const isAgree = useSelector(
    (state) => state.regularRegistration.value.isAgree
  );

  //React Hook Form
  const {
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    reset,
    control,
    watch,
  } = useForm({
    resolver: yupResolver(listingFeeForRegistrationSchema.schema),
    mode: "onChange",
    defaultValues: {
      listingItems: listingFeesForRegistration,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "listingItems",
  });

  //RTK Query
  const { data: productData, isLoading: isProductLoading } =
    useGetAllProductsQuery({ Status: true, page: 1, pageSize: 1000 });

  //Functions
  const handleReset = () => {
    reset();
    dispatch(resetListingFeeForRegistration());
  };

  const handleRecalculateTotalAmount = () => {
    let total = 0;
    watch("listingItems").forEach((item) => {
      const unitCost = parseFloat(item.unitCost);
      if (!isNaN(unitCost)) {
        total += unitCost;
      }
    });

    setTotalAmount(total);
  };

  //UseEffect
  useEffect(() => {
    dispatch(setIsListingFeeValid(isValid));
  }, [isValid, dispatch]);

  useEffect(() => {
    if (watch("listingItems")) {
      const listingItems = [...watch("listingItems")];
      console.log(listingItems);
      dispatch(setListingFeeForRegistration(listingItems));
    }
  }, [dispatch, watch("listingItems"), watch]);

  return (
    <Box className="listingFeeClient">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          // maxHeight: "310px",
          maxHeight: "80%",
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}>
            Product Information
          </Typography>
        </Box>

        {fields.map((item, index) => (
          <Box
            key={item.id}
            sx={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <ControlledAutocomplete
              name={`listingItems[${index}].itemId`}
              control={control}
              options={productData?.items || []}
              getOptionLabel={(option) => option.itemCode || ""}
              getOptionDisabled={(option) => {
                const listingFees = watch("listingItems");
                // const isListingFeeRepeating = listingFees.some(
                //   (item) => item?.itemId?.itemCode === option.itemCode
                // );

                const isListingFeeRepeating = Array.isArray(listingFees)
                  ? listingFees.some(
                      (item) => item?.itemId?.itemCode === option.itemCode
                    )
                  : false;

                const selectedClientData = watch("clientId");

                const isListingFeeRepeatingBackend =
                  selectedClientData?.listingFees?.some((item) =>
                    item?.listingItems?.some(
                      (item) => item?.itemCode === option.itemCode
                    )
                  );

                return isListingFeeRepeating || isListingFeeRepeatingBackend;
              }}
              disableClearable
              loading={isProductLoading}
              isOptionEqualToValue={() => true}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  label="Product Code"
                  // required
                  helperText={errors?.itemId?.message}
                  error={errors?.itemId}
                  sx={{ width: "180px" }}
                />
              )}
              onChange={(_, value) => {
                setValue(
                  `listingItems[${index}].itemDescription`,
                  value?.itemDescription
                );
                setValue(`listingItems[${index}].uom`, value?.uom);
                return value;
              }}
            />

            <Controller
              control={control}
              name={`listingItems[${index}].itemDescription`}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <TextField
                  label="Item Description"
                  size="small"
                  autoComplete="off"
                  disabled
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value?.toUpperCase() || ""}
                  ref={ref}
                  sx={{ width: "400px" }}
                />
              )}
            />

            <Controller
              control={control}
              name={`listingItems[${index}].uom`}
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
                  sx={{ width: "200px" }}
                />
              )}
            />

            <Controller
              key={index}
              control={control}
              name={`listingItems[${index}].sku`}
              render={({ field: { onChange, onBlur, ref } }) => (
                <TextField
                  label="SKU"
                  size="small"
                  autoComplete="off"
                  disabled
                  onChange={onChange}
                  onBlur={onBlur}
                  value={1}
                  ref={ref}
                  sx={{ width: "200px" }}
                />
              )}
            />

            <Controller
              control={control}
              name={`listingItems[${index}].unitCost`}
              render={({ field: { onChange, onBlur, value } }) => (
                <NumericFormat
                  label="Unit Cost"
                  type="text"
                  size="small"
                  customInput={TextField}
                  autoComplete="off"
                  onValueChange={(e) => {
                    onChange(Number(e.value));
                    handleRecalculateTotalAmount();
                  }}
                  onBlur={onBlur}
                  value={value || ""}
                  // ref={ref}
                  // required
                  thousandSeparator=","
                  allowNegative={false}
                  allowLeadingZeros={false}
                  prefix="₱"
                />
              )}
            />

            <IconButton
              sx={{ color: "error.main" }}
              variant=""
              onClick={() => {
                remove(index);
                handleRecalculateTotalAmount();
              }}
              tabIndex={-1}
            >
              <RemoveCircleOutline sx={{ fontSize: "30px" }} />
            </IconButton>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
          mt: "20px",
        }}
      >
        <SecondaryButton
          sx={{ width: "150px" }}
          onClick={() => {
            // fields.length < 5
            //   ? append({ itemId: null, unitCost: null })
            //   : handleListingFeeError();
            append({
              itemId: null,
              sku: 1,
              unitCost: null,
            });
          }}
          // disabled={
          //   !watch("listingItems")[watch("listingItems")?.length - 1]
          //     ?.itemId ||
          //   watch("listingItems")[watch("listingItems")?.length - 1]
          //     ?.unitCost == null ||
          //   watch("listingItems")[watch("listingItems")?.length - 1]
          //     ?.unitCost == undefined
          // }
          disabled={!isValid}
        >
          Add Product
        </SecondaryButton>

        <Box
          sx={{
            display: "flex",
            mr: "50px",
            position: "absolute",
            left: "600px",
            // gap: "23px",
            gap: "16px",
          }}
        >
          <Typography
            sx={{
              fontSize: "1rem",
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            Total Amount
          </Typography>

          <Typography sx={{ fontSize: "1rem" }}>
            ₱{totalAmount?.toLocaleString() || 0}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: "5px",
          alignItems: "center",
          justifyContent: "flex-end",
          position: "absolute",
          bottom: 0,
          right: 0,
        }}
      >
        <Checkbox
          checked={isAgree}
          onChange={(e) => dispatch(setIsAgree(e.target.checked))}
        />
        <Typography>I agree to the terms and conditions</Typography>
      </Box>
    </Box>
  );
}

export default ListingFeeClient;
