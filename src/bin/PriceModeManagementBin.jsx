//Common Modal Form
{
  /* <CommonModalForm
        title="Manage Products"
        open={isModalFormOpen}
        onClose={isDirty ? onConfirmCloseOpen : handleFormClose}
        disableSubmit={
          watch("priceModeItems")?.length === 0 ? false : !isValid || !isDirty
        }
        onSubmit={onConfirmSubmitOpen}
        width="1400px"
        height="660px"
      >
        {isProductsByIdFetching ? (
          <ManageProductsSkeleton />
        ) : (
          <Box className="priceModeManagementModal">
            <Typography fontSize="1.1rem" fontWeight="700">
              Price Mode Info
            </Typography>

            <Box className="priceModeManagementModal__header">
              <TextField
                label="Price Mode"
                size="small"
                readOnly
                value={selectedRowData?.priceModeCode}
                sx={{ width: "140px", pointerEvents: "none" }}
              />

              <TextField
                label="Price Mode Description"
                size="small"
                readOnly
                value={selectedRowData?.priceModeDescription}
                sx={{ width: "400px", pointerEvents: "none" }}
              />
            </Box>

            <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <Typography fontSize="1.1rem" fontWeight="700">
                Products List
              </Typography>

              <Button
                sx={{ color: "gray" }}
                onClick={() => {
                  if (watch("priceModeItems").length > 0) {
                    onConfirmClearOpen();
                  } else {
                    remove();
                  }
                }}
              >
                Clear All
              </Button>

              {initialProducts?.length > 0 && (
                <Tooltip
                  title="To change prices, please go to the price change form."
                  placement="top"
                >
                  <Info sx={{ color: "gray", fontSize: "20px" }} />
                </Tooltip>
              )}
            </Box>

            {fields?.length === 0 ? (
              <Box className="priceModeManagementModal__noProducts">
                <img src={NoProducts} alt="no-products" width="210px" />
              </Box>
            ) : (
              <Box className="priceModeManagementModal__items" ref={parent}>
                {fields.map((item, index) => (
                  <Box
                    key={item.id}
                    className="priceModeManagementModal__items__item"
                  >
                    <ControlledAutocomplete
                      name={`priceModeItems[${index}].itemId`}
                      control={control}
                      options={productData?.items || []}
                      getOptionLabel={(option) => option.itemCode || ""}
                      getOptionDisabled={(option) =>
                        watch("priceModeItems")?.some(
                          (item) => item?.itemId?.itemCode === option.itemCode
                        )
                      }
                      disableClearable
                      // filterSelectedOptions
                      loading={isProductLoading}
                      isOptionEqualToValue={(option, value) => true}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          label="Product Code"
                          sx={{ width: "180px" }}
                        />
                      )}
                      onChange={(_, value) => {
                        setValue(
                          `priceModeItems[${index}].itemDescription`,
                          value?.itemDescription
                        );

                        if (
                          initialProducts?.some(
                            (item) => item.itemId?.id === value?.id
                          )
                        ) {
                          setValue(
                            `priceModeItems[${index}].price`,
                            initialProducts?.find(
                              (item) => item.itemId?.id === value?.id
                            )?.price
                          );
                        }
                        return value;
                      }}
                    />

                    <Controller
                      control={control}
                      name={`priceModeItems[${index}].itemDescription`}
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <Tooltip
                          title={value?.toUpperCase() || ""}
                          placement="top"
                        >
                          <TextField
                            label="Item Description"
                            size="small"
                            autoComplete="off"
                            disabled
                            onChange={onChange}
                            onBlur={onBlur}
                            value={value?.toUpperCase() || ""}
                            ref={ref}
                            sx={{ width: "250px" }}
                          />
                        </Tooltip>
                      )}
                    />

                    <Controller
                      control={control}
                      name={`priceModeItems[${index}].price`}
                      render={({ field: { onChange, onBlur, value, ref } }) => (
                        <NumericFormat
                          label="Price"
                          type="text"
                          size="small"
                          customInput={TextField}
                          autoComplete="off"
                          onValueChange={(e) => {
                            onChange(Number(e.value));
                          }}
                          onBlur={onBlur}
                          value={value || ""}
                          // ref={ref}
                          // required
                          thousandSeparator=","
                          allowNegative={false}
                          allowLeadingZeros={false}
                          prefix="₱"
                          sx={{ width: "120px" }}
                          disabled={initialProducts?.some(
                            (item) =>
                              item.itemId?.id ===
                              watch(`priceModeItems[${index}].itemId.id`)
                          )}
                        />
                      )}
                    />

                    <IconButton
                      sx={{ color: "error.main" }}
                      onClick={() => {
                        // fields.length <= 1
                        //   ? showSnackbar(
                        //       "At least one product is required",
                        //       "error"
                        //     )
                        //   : remove(index);
                        remove(index);
                      }}
                      tabIndex={-1}
                    >
                      <Cancel sx={{ fontSize: "30px" }} />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}

            <SecondaryButton
              sx={{ width: "150px" }}
              onClick={() =>
                append({
                  priceModeId: selectedRowData?.id,
                  itemId: null,
                  price: null,
                })
              }
              disabled={!isValid}
            >
              Add Product
            </SecondaryButton>
          </Box>
        )}
      </CommonModalForm> */
}

//UseEffects
// useEffect(() => {
//   if (isModalFormOpen) {
//     triggerProductsById(
//       {
//         id: selectedRowData?.id,
//         Status: true,
//         PageNumber: 1,
//         PageSize: 1000,
//       },
//       { preferCacheValue: true }
//     );
//   }
// }, [isModalFormOpen]);

// useEffect(() => {
//   if (isModalFormOpen && productsByIdData && !isProductsByIdFetching) {
//     const transformedArray = productsByIdData?.priceModeItems?.map(
//       (item) => ({
//         priceModeId: selectedRowData?.id,
//         itemId: productData?.items?.find(
//           (product) => product.id === item.itemId
//         ),
//         itemDescription: item.itemDescription,
//         price: item.currentPrice,
//       })
//     );

//     setInitialProducts(transformedArray);
//     setValue("priceModeItems", transformedArray);
//   }
// }, [isModalFormOpen, productsByIdData]);

//React Hook Form
// const onSubmit = async (data) => {
//   const transformedData = {
//     priceModeId: selectedRowData?.id,
//     priceModeItems: data.priceModeItems.map((item) => ({
//       itemId: item.itemId.id,
//       price: item.price,
//     })),
//   };

//   try {
//     await postItemsToPriceMode(transformedData).unwrap();
//     handleFormClose();
//     onConfirmSubmitClose();
//     showSnackbar("Products successfully tagged to price mode", "success");
//   } catch (error) {
//     if (error?.data?.error?.message) {
//       showSnackbar(error?.data?.error?.message, "error");
//     } else {
//       showSnackbar("Error tagging products to price mode", "error");
//     }
//     onConfirmSubmitClose();
//   }
// };

// const {
//   handleSubmit,
//   formState: { errors, isValid, isDirty },
//   register,
//   setValue,
//   reset,
//   getValues,
//   control,
//   watch,
// } = useForm({
//   resolver: yupResolver(priceModeTaggingSchema.schema),
//   mode: "onChange",
//   defaultValues: priceModeTaggingSchema.defaultValues,
// });

// const { fields, remove, append } = useFieldArray({
//   control,
//   name: "priceModeItems",
// });
