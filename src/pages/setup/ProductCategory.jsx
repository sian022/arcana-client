import { Box, TextField } from "@mui/material";
import React, { useState } from "react";
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

function ProductCategory() {
  const [drawerMode, setDrawerMode] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [status, setStatus] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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
    isOpen: isSnackbarOpen,
    onOpen: onSnackbarOpen,
    onClose: onSnackbarClose,
  } = useDisclosure();

  const excludeKeys = [
    "createdAt",
    "updatedAt",
    "isActive",
    "addedBy",
    "productSubCategory",
  ];

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

  const { data, isLoading } = useGetAllProductCategoryQuery({
    Search: search,
    Status: status,
    PageNumber: page,
    PageSize: rowsPerPage,
  });

  console.log(data);
  const [postProductCategory] = usePostProductCategoryMutation();
  const [putProductCategory] = usePutProductCategoryMutation();
  const [patchProductCategoryStatus] = usePatchProductCategoryStatusMutation();

  const onAddSubmit = async (data) => {
    await postProductCategory(data);
    onDrawerClose();
    alert("Success");
  };

  const onEditSubmit = async (data) => {
    await putProductCategory(data);
    onDrawerClose();
    alert("Success");
  };

  const onArchiveSubmit = async () => {
    await patchProductCategoryStatus(selectedId);
    onArchiveClose();
    alert("Success");
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

  const handleEditClose = () => {
    onDrawerClose();
    setSelectedId("");
    reset();
  };

  return (
    <Box className="commonPageLayout">
      <PageHeaderAdd
        pageTitle="Product Category"
        onOpen={handleAddOpen}
        setSearch={setSearch}
        setStatus={setStatus}
      />

      <CommonTable
        mapData={data?.result}
        excludeKeys={excludeKeys}
        editable
        archivable
        onEdit={handleEditOpen}
        onArchive={handleArchiveOpen}
        setRowsPerPage={setRowsPerPage}
        setPage={setPage}
      />

      <CommonDrawer
        open={isDrawerOpen}
        onClose={drawerMode === "edit" ? handleEditClose : onDrawerClose}
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

      {/* <SuccessSnackbar
        open={true}
        onClose={onSnackbarClose}
        message="Hi Mom!"
        disableWindowBlurListener
      /> */}

      {/* <ErrorSnackbar
        open={true}
        onClose={onSnackbarClose}
        message="Hi Mom!"
        disableWindowBlurListener
      /> */}
    </Box>
  );
}

export default ProductCategory;
