import { Box, TextField } from "@mui/material";
import { useEffect, useState } from "react";
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
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import { useSelector } from "react-redux";
import { Category } from "@mui/icons-material";
import useConfirm from "../../hooks/useConfirm";
import useSnackbar from "../../hooks/useSnackbar";
import { handleCatchErrorMessage } from "../../utils/CustomFunctions";

function ProductCategory() {
  const [drawerMode, setDrawerMode] = useState("");
  const [status, setStatus] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(null);

  //Hooks
  const confirm = useConfirm();
  const snackbar = useSnackbar();
  const selectedRowData = useSelector((state) => state.selectedRow.value);

  // Drawer Disclosures
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();

  // Constants
  const tableHeads = ["Product Category"];
  const customOrderKeys = ["productCategoryName"];

  //React Hook Form
  const {
    handleSubmit,
    formState: { errors, isValid },
    register,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(productCategorySchema.schema),
    mode: "onChange",
    defaultValues: productCategorySchema.defaultValues,
  });

  //RTK Query
  const [postProductCategory, { isLoading: isAddLoading }] =
    usePostProductCategoryMutation();
  const { data, isFetching } = useGetAllProductCategoryQuery({
    Search: search,
    Status: status,
    PageNumber: page + 1,
    PageSize: rowsPerPage,
  });
  const [putProductCategory, { isLoading: isUpdateLoading }] =
    usePutProductCategoryMutation();
  const [patchProductCategoryStatus] = usePatchProductCategoryStatusMutation();

  const onDrawerSubmit = async (data) => {
    try {
      if (drawerMode === "add") {
        await postProductCategory(data).unwrap();
      } else if (drawerMode === "edit") {
        await putProductCategory(data).unwrap();
      }

      onDrawerClose();
      reset();

      snackbar({
        message: `Product Category ${
          drawerMode === "add" ? "added" : "updated"
        } successfully`,
        variant: "success",
      });
    } catch (error) {
      snackbar({ message: handleCatchErrorMessage(error), variant: "error" });
    }
  };

  const onArchive = async () => {
    try {
      await confirm({
        children: (
          <>
            Are you sure you want to {status ? "archive" : "restore"}{" "}
            <span style={{ fontWeight: "bold", textTransform: "uppercase" }}>
              {selectedRowData?.productCategoryName}
            </span>
            ?
          </>
        ),
        question: !status,
        callback: () =>
          patchProductCategoryStatus(selectedRowData?.id).unwrap(),
      });

      snackbar({
        message: `Product Category ${
          status ? "archived" : "restored"
        } successfully`,
        variant: "success",
      });
    } catch (error) {
      if (error.isConfirmed) {
        snackbar({ message: handleCatchErrorMessage(error), variant: "error" });
      }
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
  };

  const handleDrawerClose = () => {
    onDrawerClose();
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
        pageTitle={
          <>
            Product Category <Category />
          </>
        }
        onOpen={handleAddOpen}
        setSearch={setSearch}
        setStatus={setStatus}
      />

      {isFetching ? (
        <CommonTableSkeleton evenLesserCompact />
      ) : (
        <CommonTable
          evenLesserCompact
          mapData={data?.result}
          customOrderKeys={customOrderKeys}
          onEdit={handleEditOpen}
          onArchive={onArchive}
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
          (drawerMode === "add" ? "Add" : "Edit") + " Product Category"
        }
        onSubmit={handleSubmit(onDrawerSubmit)}
        disableSubmit={!isValid}
        isLoading={drawerMode === "add" ? isAddLoading : isUpdateLoading}
      >
        <TextField
          label="Product Category Name"
          size="small"
          autoComplete="off"
          {...register("productCategoryName")}
          error={errors?.productCategoryName}
          helperText={errors?.productCategoryName?.message}
        />
      </CommonDrawer>
    </Box>
  );
}

export default ProductCategory;
