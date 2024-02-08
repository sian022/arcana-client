import { Box, TextField, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import PageHeaderAdd from "../../components/PageHeaderAdd";
import { Link } from "@mui/icons-material";
import CommonTable from "../../components/CommonTable";
import { useGetAllPriceModeQuery } from "../../features/setup/api/priceModeSetupApi";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import useDisclosure from "../../hooks/useDisclosure";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { priceModeItemSchema } from "../../schema/schema";
import { useDispatch, useSelector } from "react-redux";
import SecondaryButton from "../../components/SecondaryButton";
import ControlledAutocomplete from "../../components/ControlledAutocomplete";
import {
  productsApi,
  useLazyGetAllProductsQuery,
} from "../../features/setup/api/productsApi";
import useSnackbar from "../../hooks/useSnackbar";
import { NumericFormat } from "react-number-format";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import CommonDialog from "../../components/CommonDialog";
import {
  useDeletePriceModeItemMutation,
  useGetAllItemsByPriceModeIdQuery,
  usePostItemsToPriceModeMutation,
  useUpdatePriceModeItemStatusMutation,
} from "../../features/setup/api/priceModeItemsApi";
import CommonDrawer from "../../components/CommonDrawer";
import PriceChangeDrawer from "../../components/drawers/PriceChangeDrawer";
import PriceDetailsModal from "../../components/modals/PriceDetailsModal";

function PriceModeManagement() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);

  const selectedRowData = useSelector((state) => state.selectedRow.value);
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();

  //Disclosures
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();

  const {
    isOpen: isPriceChangeOpen,
    onOpen: onPriceChangeOpen,
    onClose: onPriceChangeClose,
  } = useDisclosure();

  const {
    isOpen: isPriceDetailsOpen,
    onOpen: onPriceDetailsOpen,
    onClose: onPriceDetailsClose,
  } = useDisclosure();

  const {
    isOpen: isArchiveOpen,
    onOpen: onArchiveOpen,
    onClose: onArchiveClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
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

  //RTK Query
  const { data: priceModeData, isFetching: isPriceModeFetching } =
    useGetAllPriceModeQuery({
      Status: true,
      PageNumber: 1,
      PageSize: 1000,
    });
  const [postItemsToPriceMode, { isLoading: isTaggingLoading }] =
    usePostItemsToPriceModeMutation();
  const [updatePriceModeItemStatus, { isLoading: isArchiveLoading }] =
    useUpdatePriceModeItemStatusMutation();
  const [deletePriceModeItem, { isLoading: isDeleteLoading }] =
    useDeletePriceModeItemMutation();

  const [
    triggerProducts,
    { data: productData, isFetching: isProductFetching },
  ] = useLazyGetAllProductsQuery();

  const { data: priceModeItemsData, isFetching: isPriceModeItemsFetching } =
    useGetAllItemsByPriceModeIdQuery({
      Search: search,
      Status: status,
      PageNumber: page + 1,
      PageSize: rowsPerPage,
    });

  // Constants
  const tableHeads = [
    // "ID",
    "Product Code",
    "Item Description",
    "UOM",
    "Price",
    "Price Mode",
    "Price Details",
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

  //Functions
  const onSubmit = async (data) => {
    const transformedData = {
      priceModeId: data?.priceModeId?.id,
      itemId: data?.itemId?.id,
      price: data?.price,
    };

    try {
      await postItemsToPriceMode(transformedData).unwrap();
      dispatch(productsApi.util.resetApiState());

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

  const handleArchive = async () => {
    try {
      await updatePriceModeItemStatus({
        id: selectedRowData?.priceModeItemId,
      }).unwrap();
      showSnackbar("Item archived successfully", "success");
      onArchiveClose();
    } catch (error) {
      if (error?.data?.error?.message) {
        showSnackbar(error?.data?.error?.message, "error");
      } else {
        showSnackbar("Error archiving item", "error");
      }
      onArchiveClose();
    }
  };

  const handleDelete = async () => {
    try {
      await deletePriceModeItem({
        id: selectedRowData?.priceModeItemId,
      }).unwrap();
      showSnackbar("Item deleted successfully", "success");
      onDeleteClose();
    } catch (error) {
      if (error?.data?.error?.message) {
        showSnackbar(error?.data?.error?.message, "error");
      } else {
        showSnackbar("Error deleting item", "error");
      }
      onDeleteClose();
    }
  };

  const handleDrawerClose = () => {
    onDrawerClose();
    reset();
  };

  // UseEffect;
  useEffect(() => {
    if (watch("priceModeId")) {
      triggerProducts(
        {
          priceModeId: watch("priceModeId")?.id,
          Status: true,
          page: 1,
          pageSize: 1000,
        },
        { preferCacheValue: true }
      );
    }
  }, [watch("priceModeId")]);

  useEffect(() => {
    setCount(priceModeItemsData?.totalCount);
  }, [priceModeItemsData]);

  useEffect(() => {
    setPage(0);
  }, [status, search, rowsPerPage]);

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
          // setStatus={setStatus}
          removeArchive
        />

        {isPriceModeItemsFetching ? (
          <CommonTableSkeleton />
        ) : (
          <CommonTable
            mapData={priceModeItemsData?.priceModeItems}
            editable
            // onArchive={onArchiveOpen}
            onDelete={onDeleteOpen}
            onPriceChange={onPriceChangeOpen}
            onViewMoreConstant={onPriceDetailsOpen}
            status={status}
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
        drawerHeader="Tag Product to Price Mode"
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
          options={isProductFetching ? [] : productData?.items || []}
          getOptionLabel={(option) => option.itemCode || ""}
          disabled={!watch("priceModeId")}
          disableClearable
          loading={isProductFetching}
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
              disabled={!watch("itemId")}
              thousandSeparator=","
              allowNegative={false}
              allowLeadingZeros={false}
              prefix="₱"
            />
          )}
        />
      </CommonDrawer>

      <PriceChangeDrawer
        open={isPriceChangeOpen}
        onClose={onPriceChangeClose}
      />

      <PriceDetailsModal
        data={priceModeItemsData?.priceModeItems}
        isFetching={isPriceModeItemsFetching}
        open={isPriceDetailsOpen}
        onClose={onPriceDetailsClose}
      />

      <CommonDialog
        open={isDeleteOpen}
        onClose={onDeleteClose}
        noIcon={!status}
        onYes={handleDelete}
        isLoading={isDeleteLoading}
      >
        Are you sure you want to delete this item?
      </CommonDialog>

      {/* <CommonDialog
        open={isArchiveOpen}
        onClose={onArchiveClose}
        noIcon={!status}
        onYes={handleArchive}
        isLoading={isArchiveLoading}
      >
        Are you sure you want to {status ? "archive" : "restore"} this item?
      </CommonDialog> */}
    </>
  );
}

export default PriceModeManagement;
