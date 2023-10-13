import { Box, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import PageHeaderAdd from "../../components/PageHeaderAdd";
import CommonTable from "../../components/CommonTable";
import CommonDrawer from "../../components/CommonDrawer";
import useDisclosure from "../../hooks/useDisclosure";
import { useForm } from "react-hook-form";
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

function Products() {
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
  const excludeKeys = ["isActive", "addedBy", "modifiedBy"];

  //React Hook Form
  const {
    handleSubmit,
    formState: { errors },
    register,
    setValue,
    reset,
    getValues,
  } = useForm({
    resolver: yupResolver(productSchema.schema),
    mode: "onChange",
    defaultValues: productSchema.defaultValues,
  });

  console.log(getValues());

  //RTK Query
  const [postProduct] = usePostProductMutation();
  const { data, isLoading } = useGetAllProductsQuery({
    Search: search,
    Status: status,
    PageNumber: page + 1,
    PageSize: rowsPerPage,
  });
  const [putProduct] = usePutProductMutation();
  const [patchProductStatus] = usePatchProductStatusMutation();

  const onAddSubmit = async (data) => {
    try {
      await postProduct(data).unwrap();
      onDrawerClose();
      reset();
      setSnackbarMessage("Product added successfully");
      onSuccessOpen();
    } catch (error) {
      setSnackbarMessage(error.data.messages[0]);
      onErrorOpen();
    }
  };

  const onEditSubmit = async (data) => {
    try {
      await putProduct(data).unwrap();
      onDrawerClose();
      reset();
      setSnackbarMessage("Product updated successfully");
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

  const handleEditOpen = (data) => {
    setDrawerMode("edit");
    onDrawerOpen();
    console.log(data);
    Object.keys(data).forEach((key) => {
      setValue(key, data[key]);
    });
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
          status={status}
        />
      )}

      <CommonDrawer
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        drawerHeader={(drawerMode === "add" ? "Add" : "Edit") + " Product"}
        onSubmit={
          drawerMode === "add"
            ? handleSubmit(onAddSubmit)
            : handleSubmit(onEditSubmit)
        }
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
        <TextField
          label="Unit of Measurement"
          size="small"
          autoComplete="off"
          {...register("uomId")}
        />
        <TextField
          label="Product Sub Category"
          size="small"
          autoComplete="off"
          {...register("productSubCategoryId")}
        />
        <TextField
          label="Meat Type"
          size="small"
          autoComplete="off"
          {...register("meatTypeId")}
        />
      </CommonDrawer>

      <CommonDialog
        open={isArchiveOpen}
        onClose={onArchiveClose}
        onYes={onArchiveSubmit}
      >
        Are you sure you want to {status ? "archive" : "restore"}?
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
