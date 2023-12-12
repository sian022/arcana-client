import { Box, Checkbox, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import PageHeaderAdd from "../../components/PageHeaderAdd";
import CommonTable from "../../components/CommonTable";
import CommonDrawer from "../../components/CommonDrawer";
import useDisclosure from "../../hooks/useDisclosure";
import { Controller, get, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { productEditSchema, productSchema } from "../../schema/schema";
import CommonDialog from "../../components/CommonDialog";
import SuccessSnackbar from "../../components/SuccessSnackbar";
import ErrorSnackbar from "../../components/ErrorSnackbar";
import {
  useGetAllProductsQuery,
  usePatchProductStatusMutation,
  usePostProductMutation,
  usePutProductMutation,
} from "../../features/setup/api/productsApi";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import ControlledAutocomplete from "../../components/ControlledAutocomplete";
import { useGetAllUomsQuery } from "../../features/setup/api/uomApi";
import { useGetAllProductSubCategoriesQuery } from "../../features/setup/api/productSubCategoryApi";
import { useGetAllMeatTypesQuery } from "../../features/setup/api/meatTypeApi";
import { useSelector } from "react-redux";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { NumericFormat } from "react-number-format";
import ProductsTable from "../../components/customTables/ProductsTable";
import PriceDetailsModal from "../../components/modals/PriceDetailsModal";
import PriceChangeDrawer from "../../components/drawers/PriceChangeDrawer";

function Products() {
  const [drawerMode, setDrawerMode] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [status, setStatus] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [changePrice, setChangePrice] = useState(false);

  const selectedRowData = useSelector((state) => state.selectedRow.value);

  // Drawer Disclosures
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();

  const {
    isOpen: isArchiveOpen,
    onOpen: onArchiveOpen,
    onClose: onArchiveClose,
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
    isOpen: isPriceOpen,
    onOpen: onPriceOpen,
    onClose: onPriceClose,
  } = useDisclosure();

  const {
    isOpen: isAddPriceOpen,
    onOpen: onAddPriceOpen,
    onClose: onAddPriceClose,
  } = useDisclosure();

  // Constants
  const excludeKeysDisplay = [
    "id",
    "itemId",
    "isActive",
    "addedBy",
    "modifiedBy",
    "latestPriceChange",
    // "priceChangeHistories",
    "futurePriceChanges",
    // "itemPriceChanges",
  ];

  const tableHeads = [
    "Item Code",
    "Item Description",
    "UOM",
    "Product Category",
    "Product Sub Category",
    "Meat Type",
    "Price Details",
  ];

  //React Hook Form
  const {
    handleSubmit,
    formState: { errors, isValid },
    register,
    setValue,
    reset,
    getValues,
    control,
  } = useForm({
    resolver: yupResolver(
      drawerMode === "add" ? productSchema.schema : productEditSchema.schema
    ),
    mode: "onChange",
    defaultValues:
      drawerMode === "add"
        ? productSchema.defaultValues
        : productEditSchema.defaultValues,
  });

  //RTK Query
  const [postProduct, { isLoading: isAddLoading }] = usePostProductMutation();
  const { data, isLoading, isFetching, refetch } = useGetAllProductsQuery({
    Search: search,
    Status: status,
    PageNumber: page + 1,
    PageSize: rowsPerPage,
  });
  const [putProduct, { isLoading: isUpdateLoading }] = usePutProductMutation();
  const [patchProductStatus, { isLoading: isArchiveLoading }] =
    usePatchProductStatusMutation();

  const { data: uomData } = useGetAllUomsQuery({ Status: true });
  const { data: productSubcategoriesData } = useGetAllProductSubCategoriesQuery(
    { Status: true }
  );
  const { data: meatTypeData } = useGetAllMeatTypesQuery({ Status: true });

  const onDrawerSubmit = async (data) => {
    try {
      const {
        uomId: { id: uomId },
        productSubCategoryId: { id: productSubCategoryId },
        meatTypeId: { id: meatTypeId },
        priceChange,
        ...restData
      } = data;

      if (drawerMode === "add") {
        await postProduct({
          ...restData,
          uomId,
          productSubCategoryId,
          meatTypeId,
        }).unwrap();
        setSnackbarMessage("Product added successfully");
      } else if (drawerMode === "edit") {
        if (changePrice) {
          await putProduct({
            ...restData,
            uomId,
            productSubCategoryId,
            meatTypeId,
            price: priceChange,
          }).unwrap();
          setSnackbarMessage("Product updated successfully");
        } else if (!changePrice) {
          await putProduct({
            ...restData,
            uomId,
            productSubCategoryId,
            meatTypeId,
          }).unwrap();
          setSnackbarMessage("Product updated successfully");
        }
      }

      onDrawerClose();
      setChangePrice(false);
      reset();
      onSuccessOpen();
    } catch (error) {
      if (error?.data?.error?.message) {
        setSnackbarMessage(error?.data?.error?.message);
      } else {
        setSnackbarMessage(
          `Error ${drawerMode === "add" ? "adding" : "updating"} product`
        );
      }

      onErrorOpen();
    }
  };

  const onArchiveSubmit = async () => {
    try {
      await patchProductStatus(selectedId).unwrap();
      onArchiveClose();
      setSnackbarMessage(
        `Product ${status ? "archived" : "restored"} successfully`
      );
      onSuccessOpen();
    } catch (error) {
      if (error?.data?.error?.message) {
        setSnackbarMessage(error?.data?.error?.message);
      } else {
        setSnackbarMessage("Error archiving product");
      }

      onErrorOpen();
    }
  };

  const handleAddOpen = () => {
    setDrawerMode("add");
    onDrawerOpen();
  };

  const handleEditOpen = (editData) => {
    setDrawerMode("edit");
    onDrawerOpen();
    setValue("id", editData.id);
    setValue("itemCode", editData.itemCode);
    setValue("itemDescription", editData.itemDescription);
    setValue("productCategory", editData?.productCategory);
    setValue("price", editData?.latestPriceChange?.price);

    const foundUom = data?.items.find((item) => item.uom === editData.uom);
    if (foundUom) {
      const updatedItem = { ...foundUom, uomCode: foundUom.uom };
      delete updatedItem.uom;
      setValue("uomId", updatedItem);
    }

    // setValue(
    //   "uomId",
    //   data?.items.find((item) => item.uom === editData.uom)
    // );

    setValue(
      "productSubCategoryId",
      data?.items.find(
        (item) =>
          item.productSubCategoryName === editData.productSubCategoryName
      )
    );

    const foundMeatType = data?.items.find(
      (item) => item.meatType === editData.meatType
    );
    if (foundMeatType) {
      const updatedItem = {
        ...foundMeatType,
        meatTypeName: foundMeatType.meatType,
      };
      delete updatedItem.meatType;
      setValue("meatTypeId", updatedItem);
    }

    // setValue(
    //   "meatTypeId",
    //   data?.items.find((item) => item.meatType === editData.meatType)
    // );
  };

  const handleArchiveOpen = (id) => {
    onArchiveOpen();
    setSelectedId(id);
  };

  const handleDrawerClose = () => {
    onDrawerClose();
    setSelectedId("");
    setChangePrice(false);
    reset();
  };

  useEffect(() => {
    setCount(data?.totalCount);
  }, [data]);

  useEffect(() => {
    setPage(0);
  }, [search, status, rowsPerPage]);

  useEffect(() => {
    if (!changePrice) {
      setValue("priceChange", null);
      setValue("effectivityDate", null);
    }
  }, [changePrice]);

  return (
    <Box className="commonPageLayout">
      <PageHeaderAdd
        pageTitle="Products"
        onOpen={handleAddOpen}
        setSearch={setSearch}
        setStatus={setStatus}
      />

      {isFetching ? (
        <CommonTableSkeleton />
      ) : (
        <CommonTable
          mapData={data?.items}
          excludeKeysDisplay={excludeKeysDisplay}
          editable
          archivable
          onEdit={handleEditOpen}
          onArchive={handleArchiveOpen}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          count={count}
          status={status}
          tableHeads={tableHeads}
          viewMoreKey={"priceChangeHistories"}
          onViewMoreClick={onPriceOpen}
          onAddPriceChange={onAddPriceOpen}
        />
      )}

      <CommonDrawer
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        drawerHeader={(drawerMode === "add" ? "Add" : "Edit") + " Product"}
        onSubmit={handleSubmit(onDrawerSubmit)}
        disableSubmit={!isValid}
        isLoading={drawerMode === "add" ? isAddLoading : isUpdateLoading}
      >
        <TextField
          label="Item Code"
          size="small"
          autoComplete="off"
          {...register("itemCode")}
        />
        <TextField
          label="Item Description"
          size="small"
          autoComplete="off"
          {...register("itemDescription")}
        />

        <ControlledAutocomplete
          name={"uomId"}
          control={control}
          options={uomData?.uom || []}
          getOptionLabel={(option) => option.uomCode}
          disableClearable
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              label="Unit of Measurement"
              helperText={errors?.uomId?.message}
              error={errors?.uomId}
            />
          )}
        />

        <ControlledAutocomplete
          name={"productSubCategoryId"}
          control={control}
          options={productSubcategoriesData?.productSubCategories || []}
          getOptionLabel={(option) => option.productSubCategoryName}
          disableClearable
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              label="Product Sub Category"
              helperText={errors?.productSubCategoryId?.message}
              error={errors?.productSubCategoryId}
            />
          )}
          onChange={(_, value) => {
            setValue("productCategory", value?.productCategoryName);
            return value;
          }}
        />

        <Controller
          control={control}
          name={"productCategory"}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <TextField
              label="Product Category"
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

        <ControlledAutocomplete
          name={"meatTypeId"}
          control={control}
          options={meatTypeData?.meatTypes || []}
          getOptionLabel={(option) => option.meatTypeName}
          disableClearable
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              label="Meat Type"
              helperText={errors?.meatTypeId?.message}
              error={errors?.meatTypeId}
            />
          )}
        />

        {drawerMode === "add" && (
          <Controller
            control={control}
            name={"price"}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <NumericFormat
                label="Price (₱)"
                type="text"
                size="small"
                customInput={TextField}
                autoComplete="off"
                onValueChange={(e) => {
                  onChange(Number(e.value));
                }}
                onBlur={onBlur}
                value={value || ""}
                ref={ref}
                required
                thousandSeparator=","
                helperText={errors?.price?.message}
                error={errors?.price}
              />
            )}
          />
        )}

        {/* {drawerMode === "edit" && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
              gap: "5px",
            }}
          >
            <Checkbox
              checked={changePrice}
              onChange={() => {
                setChangePrice((prev) => !prev);
              }}
            />
            <Typography>Change price</Typography>
          </Box>
        )}

        {drawerMode === "edit" && changePrice && (
          <>
            <Controller
              control={control}
              name={"priceChange"}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <NumericFormat
                  label="Price Change (₱)"
                  type="text"
                  size="small"
                  customInput={TextField}
                  autoComplete="off"
                  onValueChange={(e) => {
                    onChange(Number(e.value));
                  }}
                  onBlur={onBlur}
                  value={value || ""}
                  ref={ref}
                  required
                  thousandSeparator=","
                  helperText={errors?.price?.message}
                  error={errors?.price}
                />
              )}
            />

            <Controller
              name="effectivityDate"
              control={control}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    {...field}
                    label="Price Effectivity Date"
                    slotProps={{
                      textField: { size: "small", required: true },
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        helperText={errors?.effectivityDate?.message}
                        error={errors?.effectivityDate}
                      />
                    )}
                    minDate={moment()}
                    // maxDate={moment().subtract(18, "years")}
                  />
                </LocalizationProvider>
              )}
            />
          </>
        )} */}
      </CommonDrawer>

      <CommonDialog
        open={isArchiveOpen}
        onClose={onArchiveClose}
        onYes={onArchiveSubmit}
        isLoading={isArchiveLoading}
        noIcon={!status}
      >
        Are you sure you want to {status ? "archive" : "restore"}{" "}
        <span style={{ fontWeight: "bold", textTransform: "uppercase" }}>
          {selectedRowData?.itemCode}
        </span>
        ?
      </CommonDialog>

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

      <PriceDetailsModal
        data={data?.items}
        isFetching={isFetching}
        open={isPriceOpen}
        // open={true}
        onClose={onPriceClose}
      />

      <PriceChangeDrawer open={isAddPriceOpen} onClose={onAddPriceClose} />
    </Box>
  );
}

export default Products;
