import { Box, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import PageHeaderAdd from "../../components/PageHeaderAdd";
import CommonTable from "../../components/CommonTable";
import CommonDrawer from "../../components/CommonDrawer";
import useDisclosure from "../../hooks/useDisclosure";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { productSubCategorySchema } from "../../schema/schema";
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
import { SubdirectoryArrowRight } from "@mui/icons-material";
import useConfirm from "../../hooks/useConfirm";
import useSnackbar from "../../hooks/useSnackbar";
import { handleCatchErrorMessage } from "../../utils/CustomFunctions";

function ProductSubCategory() {
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
  const tableHeads = ["Product Sub Category", "Product Category"];
  const customOrderKeys = ["productSubCategoryName", "productCategoryName"];

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
  const { data, isFetching } = useGetAllProductSubCategoriesQuery({
    Search: search,
    Status: status,
    PageNumber: page + 1,
    PageSize: rowsPerPage,
  });
  const [putProductSubCategory, { isLoading: isUpdateLoading }] =
    usePutProductSubCategoryMutation();
  const [patchProductSubCategoryStatus] =
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
      } else if (drawerMode === "edit") {
        await putProductSubCategory({
          ...restData,
          productCategoryId: id,
        }).unwrap();
      }

      onDrawerClose();
      reset();
      snackbar({
        message: `Product Sub Category ${
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
              {selectedRowData?.productSubCategoryName}
            </span>
            ?
          </>
        ),
        question: !status,
        callback: () =>
          patchProductSubCategoryStatus(selectedRowData?.id).unwrap(),
      });

      snackbar({
        message: `Product Sub Category ${
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

    setValue("id", editData.id);
    setValue("productSubCategoryName", editData.productSubCategoryName);
    setValue(
      "productCategoryId",
      data?.productSubCategories.find(
        (item) => item.productCategoryName === editData.productCategoryName
      )
    );
  };

  const handleDrawerClose = () => {
    reset();
    onDrawerClose();
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
        pageTitle={
          <>
            Product Sub Category <SubdirectoryArrowRight />
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
          mapData={data?.productSubCategories}
          onEdit={handleEditOpen}
          onArchive={onArchive}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          count={count}
          status={status}
          tableHeads={tableHeads}
          customOrderKeys={customOrderKeys}
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
    </Box>
  );
}

export default ProductSubCategory;
