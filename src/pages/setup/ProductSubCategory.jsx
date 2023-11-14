import { Autocomplete, Box, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import PageHeaderAdd from "../../components/PageHeaderAdd";
import CommonTable from "../../components/CommonTable";
import CommonDrawer from "../../components/CommonDrawer";
import useDisclosure from "../../hooks/useDisclosure";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { productSubCategorySchema } from "../../schema/schema";
import CommonDialog from "../../components/CommonDialog";
import SuccessSnackbar from "../../components/SuccessSnackbar";
import ErrorSnackbar from "../../components/ErrorSnackbar";
import {
  usePatchProductSubCategoryStatusMutation,
  usePostProductSubCategoryMutation,
  usePutProductSubCategoryMutation,
  useGetAllProductSubCategoriesQuery,
} from "../../features/setup/api/productSubCategoryApi";
import { useGetAllProductCategoryQuery } from "../../features/setup/api/productCategoryApi";
import ControlledAutocomplete from "../../components/ControlledAutocomplete";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import { useSelector } from "react-redux";

function ProductSubCategory() {
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
    "createdAt",
    "addedBy",
    "updatedAt",
    "modifiedBy",
    "isActive",
  ];

  const tableHeads = ["Product Category", "Product Sub Category"];

  //React Hook Form
  const {
    handleSubmit,
    formState: { errors, isValid },
    register,
    setValue,
    reset,
    control,
  } = useForm({
    resolver: yupResolver(productSubCategorySchema.schema),
    mode: "onChange",
    defaultValues: productSubCategorySchema.defaultValues,
  });

  //RTK Query
  const [postProductSubCategory, { isLoading: isAddLoading }] =
    usePostProductSubCategoryMutation();
  const { data, isLoading, isFetching } = useGetAllProductSubCategoriesQuery({
    Search: search,
    Status: status,
    PageNumber: page + 1,
    PageSize: rowsPerPage,
  });
  const [putProductSubCategory, { isLoading: isUpdateLoading }] =
    usePutProductSubCategoryMutation();
  const [patchProductSubCategoryStatus, { isLoading: isArchiveLoading }] =
    usePatchProductSubCategoryStatusMutation();

  const { data: productCategoriesData } = useGetAllProductCategoryQuery({
    Status: true,
  });

  //Drawer Functions
  const onDrawerSubmit = async (data) => {
    try {
      const {
        productCategoryId: { id },
        ...restData
      } = data;

      if (drawerMode === "add") {
        await postProductSubCategory({
          ...restData,
          productCategoryId: id,
        }).unwrap();
        setSnackbarMessage("Product Sub Category added successfully");
      } else if (drawerMode === "edit") {
        await putProductSubCategory({
          ...restData,
          productCategoryId: id,
        }).unwrap();
        setSnackbarMessage("Product Sub Category updated successfully");
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
      await patchProductSubCategoryStatus(selectedId).unwrap();
      onArchiveClose();
      setSnackbarMessage(
        `Product Sub Category ${status ? "archived" : "restored"} successfully`
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
    setValue("productSubCategoryName", editData.productSubCategoryName);
    setValue(
      "productCategoryId",
      data?.productSubCategories.find(
        (item) => item.productCategoryName === editData.productCategoryName
      )
    );
  };

  const handleArchiveOpen = (id) => {
    onArchiveOpen();
    setSelectedId(id);
  };

  const handleDrawerClose = () => {
    reset();
    onDrawerClose();
    setSelectedId("");
  };

  //UseEffect
  useEffect(() => {
    setCount(data?.totalCount);
  }, [data]);

  useEffect(() => {
    setPage(0);
  }, [search, status, rowsPerPage]);

  return (
    <Box className="commonPageLayout">
      <PageHeaderAdd
        pageTitle="Product Sub Category"
        onOpen={handleAddOpen}
        setSearch={setSearch}
        setStatus={setStatus}
      />
      {isFetching ? (
        <CommonTableSkeleton />
      ) : (
        <CommonTable
          mapData={data?.productSubCategories}
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
        drawerHeader={
          (drawerMode === "add" ? "Add" : "Edit") + " Product Sub Category"
        }
        onSubmit={handleSubmit(onDrawerSubmit)}
        disableSubmit={!isValid}
        isLoading={drawerMode === "add" ? isAddLoading : isUpdateLoading}
      >
        <TextField
          label="Product Sub Category Name"
          size="small"
          autoComplete="off"
          {...register("productSubCategoryName")}
          helperText={errors?.productSubCategoryName?.message}
          error={errors?.productSubCategoryName}
        />

        <ControlledAutocomplete
          name={"productCategoryId"}
          control={control}
          options={productCategoriesData?.result || []}
          getOptionLabel={(option) => option.productCategoryName}
          disableClearable
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              label="Product Category"
              helperText={errors?.productCategoryId?.message}
              error={errors?.productCategoryId}
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
          {selectedRowData?.productSubCategoryName}
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

export default ProductSubCategory;
