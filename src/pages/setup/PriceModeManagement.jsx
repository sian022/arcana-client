import {
  Box,
  Button,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import PageHeaderAdd from "../../components/PageHeaderAdd";
import { Cancel, Help, Info, Link } from "@mui/icons-material";
import CommonTable from "../../components/CommonTable";
import { useGetAllPriceModeQuery } from "../../features/setup/api/priceModeSetupApi";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import CommonModalForm from "../../components/CommonModalForm";
import useDisclosure from "../../hooks/useDisclosure";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  priceModeItemSchema,
  priceModeTaggingSchema,
} from "../../schema/schema";
import { useSelector } from "react-redux";
import SecondaryButton from "../../components/SecondaryButton";
import ControlledAutocomplete from "../../components/ControlledAutocomplete";
import { useGetAllProductsQuery } from "../../features/setup/api/productsApi";
import useSnackbar from "../../hooks/useSnackbar";
import { NumericFormat } from "react-number-format";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import NoProducts from "../../assets/images/NoProductFound.svg";
import CommonDialog from "../../components/CommonDialog";
import {
  useGetAllItemsByPriceModeIdQuery,
  useLazyGetAllItemsByPriceModeIdQuery,
  usePostItemsToPriceModeMutation,
} from "../../features/setup/api/priceModeItemsApi";
import ManageProductsSkeleton from "../../components/skeletons/ManageProductsSkeleton";
import PriceChangeModal from "../../components/modals/PriceChangeModal";
import CommonDrawer from "../../components/CommonDrawer";

function PriceModeManagement() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);

  const [initialProducts, setInitialProducts] = useState([]);

  const selectedRowData = useSelector((state) => state.selectedRow.value);
  const [parent] = useAutoAnimate();

  const { showSnackbar } = useSnackbar();

  //Disclosures
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();

  const {
    isOpen: isModalFormOpen,
    onOpen: onModalFormOpen,
    onClose: onModalFormClose,
  } = useDisclosure();

  const {
    isOpen: isPriceChangeOpen,
    onOpen: onPriceChangeOpen,
    onClose: onPriceChangeClose,
  } = useDisclosure();

  const {
    isOpen: isConfirmClearOpen,
    onOpen: onConfirmClearOpen,
    onClose: onConfirmClearClose,
  } = useDisclosure();

  const {
    isOpen: isConfirmCloseOpen,
    onOpen: onConfirmCloseOpen,
    onClose: onConfirmCloseClose,
  } = useDisclosure();

  const {
    isOpen: isConfirmSubmitOpen,
    onOpen: onConfirmSubmitOpen,
    onClose: onConfirmSubmitClose,
  } = useDisclosure();

  //React Hook Form
  const {
    handleSubmit,
    formState: { errors, isValid, isDirty },
    register,
    setValue,
    reset,
    getValues,
    control,
    watch,
  } = useForm({
    resolver: yupResolver(priceModeItemSchema.schema),
    mode: "onChange",
    defaultValues: priceModeItemSchema.defaultValues,
  });

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

  //RTK Query
  const { data: priceModeData, isFetching: isPriceModeFetching } =
    useGetAllPriceModeQuery({
      Status: true,
      PageNumber: 1,
      PageSize: 1000,
    });

  const { data: productData, isLoading: isProductLoading } =
    useGetAllProductsQuery({
      priceModeId: watch("priceModeId") ? watch("priceModeId")?.id : "",
      Status: true,
      page: 1,
      pageSize: 1000,
    });

  const [
    triggerProductsById,
    { data: productsByIdData, isFetching: isProductsByIdFetching },
  ] = useLazyGetAllItemsByPriceModeIdQuery();

  const { data: priceModeItemsData, isFetching: isPriceModeItemsFetching } =
    useGetAllItemsByPriceModeIdQuery({
      Search: search,
      Status: status,
      PageNumber: page + 1,
      PageSize: rowsPerPage,
    });

  const [postItemsToPriceMode, { isLoading: isTaggingLoading }] =
    usePostItemsToPriceModeMutation();

  // Constants
  const tableHeads = [
    // "ID",
    "Product Code",
    "Item Description",
    "UOM",
    "Price",
    "Price Mode",
  ];

  const customOrderKeys = [
    // "priceModeItemId",
    "itemCode",
    "itemDescription",
    "uom",
    "currentPrice",
    "priceModeCode",
  ];

  const pesoArray = ["currentPrice"];

  const disableActions = ["priceChange"];

  //Functions
  const onSubmit = async (data) => {
    const transformedData = {
      priceModeId: data?.priceModeId?.id,
      itemId: data?.itemId?.id,
      price: data?.price,
    };

    try {
      await postItemsToPriceMode(transformedData).unwrap();
      handleDrawerClose();
      showSnackbar("Product successfully tagged to price mode", "success");
    } catch (error) {
      if (error?.data?.error?.message) {
        showSnackbar(error?.data?.error?.message, "error");
      } else {
        showSnackbar("Error tagging product to price mode", "error");
      }
    }
  };

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

  const handleDrawerClose = () => {
    onDrawerClose();
    reset();
  };

  const handleFormClose = () => {
    onModalFormClose();
    onConfirmCloseClose();
    reset();
  };

  const handleClearAll = () => {
    remove();
    onConfirmClearClose();
  };

  // UseEffect;
  useEffect(() => {
    setCount(priceModeItemsData?.totalCount);
  }, [priceModeItemsData]);

  useEffect(() => {
    setPage(0);
  }, [search, rowsPerPage]);

  // useEffect(() => {
  //   if (isModalFormOpen) {
  //     setValue("priceModeItems[0].priceModeId", selectedRowData?.id);
  //   }
  // }, [isModalFormOpen]);

  useEffect(() => {
    if (isModalFormOpen) {
      triggerProductsById(
        {
          id: selectedRowData?.id,
          Status: true,
          PageNumber: 1,
          PageSize: 1000,
        },
        { preferCacheValue: true }
      );
    }
  }, [isModalFormOpen]);

  useEffect(() => {
    if (isModalFormOpen && productsByIdData && !isProductsByIdFetching) {
      const transformedArray = productsByIdData?.priceModeItems?.map(
        (item) => ({
          priceModeId: selectedRowData?.id,
          itemId: productData?.items?.find(
            (product) => product.id === item.itemId
          ),
          itemDescription: item.itemDescription,
          price: item.currentPrice,
        })
      );

      setInitialProducts(transformedArray);
      setValue("priceModeItems", transformedArray);
    }
  }, [isModalFormOpen, productsByIdData]);

  return (
    <>
      <Box className="commonPageLayout">
        <PageHeaderAdd
          pageTitle={
            <>
              Price Mode Management <Link />
            </>
          }
          setSearch={setSearch}
          onOpen={onDrawerOpen}
          setStatus={setStatus}
        />

        {isPriceModeItemsFetching ? (
          <CommonTableSkeleton />
        ) : (
          <CommonTable
            mapData={priceModeItemsData?.priceModeItems}
            editable
            onManageProducts={onModalFormOpen}
            onPriceChange={onPriceChangeOpen}
            // disableActions={
            //   productsByIdData?.priceModeItems?.length === 0 && disableActions
            // }
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            tableHeads={tableHeads}
            customOrderKeys={customOrderKeys}
            pesoArray={pesoArray}
            count={count}
          />
        )}
      </Box>

      <CommonDrawer
        drawerHeader="Add Product by Price Mode"
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        disableSubmit={!isValid || !isDirty}
        onSubmit={handleSubmit(onSubmit)}
        isLoading={isTaggingLoading}
      >
        <ControlledAutocomplete
          name="priceModeId"
          control={control}
          options={priceModeData?.priceMode || []}
          getOptionLabel={(option) => option.priceModeCode || ""}
          // getOptionDisabled={(option) =>
          //   watch("priceModeItems")?.some(
          //     (item) => item?.itemId?.itemCode === option.itemCode
          //   )
          // }
          disableClearable
          loading={isPriceModeFetching}
          isOptionEqualToValue={(option, value) => true}
          renderInput={(params) => (
            <TextField {...params} size="small" label="Price Mode" />
          )}
          onChange={(_, value) => {
            setValue("itemId", null);
            setValue("itemDescription", "");
            setValue("uom", "");
            setValue("price", null);
            return value;
          }}
        />

        <ControlledAutocomplete
          name="itemId"
          control={control}
          options={productData?.items || []}
          getOptionLabel={(option) => option.itemCode || ""}
          disabled={!watch("priceModeId")}
          // getOptionDisabled={(option) =>
          //   watch("priceModeItems")?.some(
          //     (item) => item?.itemId?.itemCode === option.itemCode
          //   )
          // }
          disableClearable
          loading={isProductLoading}
          isOptionEqualToValue={(option, value) => true}
          renderInput={(params) => (
            <TextField {...params} size="small" label="Product Code" />
          )}
          onChange={(_, value) => {
            setValue("itemDescription", value?.itemDescription);
            setValue("uom", value?.uom);
            return value;
          }}
        />

        <Controller
          control={control}
          name="itemDescription"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Tooltip title={value?.toUpperCase() || ""} placement="top">
              <TextField
                label="Item Description"
                size="small"
                autoComplete="off"
                disabled
                onChange={onChange}
                onBlur={onBlur}
                value={value?.toUpperCase() || ""}
                ref={ref}
              />
            </Tooltip>
          )}
        />

        <Controller
          control={control}
          name="uom"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <TextField
              label="Unit of Measurement"
              size="small"
              autoComplete="off"
              disabled
              onChange={onChange}
              onBlur={onBlur}
              value={value?.toUpperCase() || ""}
              ref={ref}
            />
          )}
        />

        <Controller
          control={control}
          name="price"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <NumericFormat
              label="Price"
              type="text"
              size="small"
              customInput={TextField}
              autoComplete="off"
              onValueChange={(e) => {
                e.value !== "" && onChange(Number(e.value));
              }}
              onBlur={onBlur}
              value={value || ""}
              inputRef={ref}
              // required
              thousandSeparator=","
              allowNegative={false}
              allowLeadingZeros={false}
              prefix="₱"
            />
          )}
        />
      </CommonDrawer>

      {/* <CommonModalForm
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
      </CommonModalForm> */}

      <PriceChangeModal open={isPriceChangeOpen} onClose={onPriceChangeClose} />

      <CommonDialog
        open={isConfirmClearOpen}
        onClose={onConfirmClearClose}
        onYes={handleClearAll}
      >
        Are you sure you want to clear all products?
      </CommonDialog>

      <CommonDialog
        open={isConfirmCloseOpen}
        onClose={onConfirmCloseClose}
        onYes={handleFormClose}
      >
        Are you sure you want to close the form? <br />
        <span style={{ fontWeight: "bold" }}>(FIELDS WILL BE RESET)</span>
      </CommonDialog>

      <CommonDialog
        open={isConfirmSubmitOpen}
        onClose={onConfirmSubmitClose}
        onYes={handleSubmit(onSubmit)}
        isLoading={isTaggingLoading}
        noIcon
      >
        Are you sure you want to tag products to price mode?
      </CommonDialog>
    </>
  );
}

export default PriceModeManagement;
