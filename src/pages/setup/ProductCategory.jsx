import { Box, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import PageHeaderAdd from "../../components/PageHeaderAdd";
import CommonTable from "../../components/CommonTable";
import {
  useGetAllProductCategoryQuery,
  usePatchProductCategoryStatusMutation,
  usePostProductCategoryMutation,
  usePutProductCategoryMutation,
} from "../../features/setup/api/productCategoryApi";
import CommonDrawer from "../../components/CommonDrawer";
import useDisclosure from "../../hooks/useDisclosure";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { productCategorySchema } from "../../schema/schema";
import CommonDialog from "../../components/CommonDialog";
import SuccessSnackbar from "../../components/SuccessSnackbar";
import ErrorSnackbar from "../../components/ErrorSnackbar";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";

function ProductCategory() {
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
    "updatedAt",
    "isActive",
    "addedBy",
    "productSubCategory",
  ];

  //React Hook Form
  const {
    handleSubmit,
    formState: { errors },
    register,
    setValue,
    reset,
    getValues,
  } = useForm({
    resolver: yupResolver(productCategorySchema.schema),
    mode: "onChange",
    defaultValues: productCategorySchema.defaultValues,
  });

  //RTK Query
  const [postProductCategory] = usePostProductCategoryMutation();
  const { data, isLoading } = useGetAllProductCategoryQuery({
    Search: search,
    Status: status,
    PageNumber: page + 1,
    PageSize: rowsPerPage,
  });
  const [putProductCategory] = usePutProductCategoryMutation();
  const [patchProductCategoryStatus] = usePatchProductCategoryStatusMutation();

  const onAddSubmit = async (data) => {
    try {
      await postProductCategory(data).unwrap();
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
      await putProductCategory(data).unwrap();
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
      await patchProductCategoryStatus(selectedId).unwrap();
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

  const handleEditOpen = (data) => {
    setDrawerMode("edit");
    onDrawerOpen();

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
        pageTitle="Product Category"
        onOpen={handleAddOpen}
        setSearch={setSearch}
        setStatus={setStatus}
      />

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <CommonTable
          mapData={data?.result}
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
          (drawerMode === "add" ? "Add" : "Edit") + " Product Category"
        }
        onSubmit={
          drawerMode === "add"
            ? handleSubmit(onAddSubmit)
            : handleSubmit(onEditSubmit)
        }
      >
        <TextField
          label="Product Category Name"
          size="small"
          autoComplete="off"
          {...register("productCategoryName")}
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

export default ProductCategory;
