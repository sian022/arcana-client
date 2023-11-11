import { Box, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import PageHeaderAdd from "../../components/PageHeaderAdd";
import CommonTable from "../../components/CommonTable";
import CommonDrawer from "../../components/CommonDrawer";
import useDisclosure from "../../hooks/useDisclosure";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { productSchema } from "../../schema/schema";
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

function Products() {
  const [drawerMode, setDrawerMode] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [status, setStatus] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");

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

  // Constants
  const excludeKeysDisplay = [
    "id",
    "itemId",
    "isActive",
    "addedBy",
    "modifiedBy",
  ];

  const tableHeads = [
    "Item Code",
    "Item Description",
    "UOM",
    "Product Category",
    "Product Sub Category",
    "Meat Type",
  ];

  //React Hook Form
  const {
    handleSubmit,
    formState: { errors },
    register,
    setValue,
    reset,
    getValues,
    control,
  } = useForm({
    resolver: yupResolver(productSchema.schema),
    mode: "onChange",
    defaultValues: productSchema.defaultValues,
  });

  //RTK Query
  const [postProduct, { isLoading: isAddLoading }] = usePostProductMutation();
  const { data, isLoading } = useGetAllProductsQuery({
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
        await putProduct({
          ...restData,
          uomId,
          productSubCategoryId,
          meatTypeId,
        }).unwrap();
        setSnackbarMessage("Product updated successfully");
      }

      onDrawerClose();
      reset();
      onSuccessOpen();
    } catch (error) {
      setSnackbarMessage(error.data.messages[0]);
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
      setSnackbarMessage(error.data.messages[0]);
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
    reset();
  };

  useEffect(() => {
    setCount(data?.totalCount);
  }, [data]);

  useEffect(() => {
    setPage(0);
  }, [search, status, rowsPerPage]);

  return (
    <Box className="commonPageLayout">
      <PageHeaderAdd
        pageTitle="Products"
        onOpen={handleAddOpen}
        setSearch={setSearch}
        setStatus={setStatus}
      />

      {isLoading ? (
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
        />
      )}

      <CommonDrawer
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        drawerHeader={(drawerMode === "add" ? "Add" : "Edit") + " Product"}
        onSubmit={handleSubmit(onDrawerSubmit)}
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
            console.log(value);
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
    </Box>
  );
}

export default Products;
