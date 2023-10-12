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

function ProductSubCategory() {
  const [drawerMode, setDrawerMode] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [status, setStatus] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");

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
  const excludeKeys = [
    "createdAt",
    "addedBy",
    "updatedAt",
    "modifiedBy",
    "isActive",
  ];

  //React Hook Form
  const {
    handleSubmit,
    formState: { errors },
    register,
    setValue,
    reset,
    watch,
    control,
  } = useForm({
    resolver: yupResolver(productSubCategorySchema.schema),
    mode: "onChange",
    defaultValues: productSubCategorySchema.defaultValues,
  });

  //RTK Query
  const [postProductSubCategory] = usePostProductSubCategoryMutation();
  const { data, isLoading } = useGetAllProductSubCategoriesQuery({
    Search: search,
    Status: status,
    PageNumber: page + 1,
    PageSize: rowsPerPage,
  });
  const [putProductSubCategory] = usePutProductSubCategoryMutation();
  const [patchProductSubCategoryStatus] =
    usePatchProductSubCategoryStatusMutation();

  const { data: productCategoriesData } = useGetAllProductCategoryQuery({
    Status: true,
  });

  const onAddSubmit = async (data) => {
    try {
      await postProductSubCategory(data).unwrap();
      onDrawerClose();
      reset();
      setSnackbarMessage("Product Category added successfully");
      onSuccessOpen();
    } catch (error) {
      setSnackbarMessage(error.data.messages[0]);
      onErrorOpen();
    }
  };

  const onEditSubmit = async (data) => {
    try {
      await putProductSubCategory(data).unwrap();
      onDrawerClose();
      reset();
      setSnackbarMessage("Product Category updated successfully");
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
      setSnackbarMessage("Product Category archived successfully");
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

    Object.keys(editData).forEach((key) => {
      setValue(key, editData[key]);
    });

    setValue(
      "productCategoryId",
      data?.productSubCategories.find(
        (item) => item.productCategoryName === editData.productCategoryName
      )?.id
    );
  };

  console.log(watch("productCategoryId"));
  // console.log(data?.productSubCategories);

  const handleArchiveOpen = (id) => {
    onArchiveOpen();
    setSelectedId(id);
  };

  const handleDrawerClose = () => {
    reset();
    onDrawerClose();
    setSelectedId("");
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
        pageTitle="Product Sub Category"
        onOpen={handleAddOpen}
        setSearch={setSearch}
        setStatus={setStatus}
      />

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <CommonTable
          mapData={data?.productSubCategories}
          excludeKeys={excludeKeys}
          editable
          archivable
          onEdit={handleEditOpen}
          onArchive={handleArchiveOpen}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          count={count}
        />
      )}

      <CommonDrawer
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        drawerHeader={
          (drawerMode === "add" ? "Add" : "Edit") + " Product Sub Category"
        }
        onSubmit={
          drawerMode === "add"
            ? handleSubmit(onAddSubmit)
            : handleSubmit(onEditSubmit)
        }
      >
        <TextField
          label="Product Sub Category Name"
          size="small"
          autoComplete="off"
          {...register("productSubCategoryName")}
          helperText={errors?.productSubCategoryName?.message}
          error={errors?.productSubCategoryName}
        />

        <Autocomplete
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          options={productCategoriesData?.result}
          getOptionLabel={(option) => option.productCategoryName}
          disableClearable
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              label="Product Category"
              helperText={errors?.productCategoryId?.message}
              error={errors?.productCategoryId}
            />
          )}
          onChange={(_, value) => {
            setValue("productCategoryId", value.id);
          }}
        />

        <ControlledAutocomplete
          name={"productCategoryId"}
          control={control}
          options={productCategoriesData?.result}
          getOptionLabel={(option) => option.productCategoryName}
          disableClearable
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              label="Product Category"
              helperText={errors?.productCategoryId?.message}
              error={errors?.productCategoryId}
            />
          )}
          onChange={(_, value) => {
            setValue("productCategoryId", value.id);
          }}
        />
      </CommonDrawer>

      <CommonDialog
        open={isArchiveOpen}
        onClose={onArchiveClose}
        onYes={onArchiveSubmit}
      >
        Are you sure you want to archive?
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
