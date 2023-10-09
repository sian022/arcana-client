import { Box, TextField } from "@mui/material";
import React, { useState } from "react";
import PageHeaderAdd from "../../components/PageHeaderAdd";
import CommonTable from "../../components/CommonTable";
import {
  useGetAllProductCategoryQuery,
  usePostProductCategoryMutation,
  usePutProductCategoryMutation,
} from "../../features/setup/api/productCategoryApi";
import CommonDrawer from "../../components/CommonDrawer";
import useDisclosure from "../../hooks/useDisclosure";
import { set, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { productCategorySchema } from "../../schema/schema";
import { Watch } from "@mui/icons-material";

function ProductCategory() {
  const [drawerMode, setDrawerMode] = useState("");

  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();

  const excludeKeys = [
    "createdAt",
    "updatedAt",
    "isActive",
    "addedBy",
    "productSubCategory",
  ];

  const { data, isLoading } = useGetAllProductCategoryQuery();
  const [postProductCategory] = usePostProductCategoryMutation();
  const [putProductCategory] = usePutProductCategoryMutation();

  const {
    handleSubmit,
    formState: { errors },
    register,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(productCategorySchema.schema),
    mode: "onChange",
    defaultValues: productCategorySchema.defaultValues,
  });

  const onAddSubmit = async (data) => {
    await postProductCategory(data);
    onDrawerClose();
    alert("Success");
  };

  const onEditSubmit = async (data, id) => {
    await putProductCategory(data, id);
    onDrawerClose();
    alert("Success");
  };

  const handleAddOpen = () => {
    setDrawerMode("add");
    onDrawerOpen();
  };

  const handleEditOpen = (data, id) => {
    setDrawerMode("edit");
    onDrawerOpen();

    Object.keys(data).forEach((key) => {
      setValue(key, data[key]);
    });
  };

  return (
    <Box className="commonPageLayout">
      <PageHeaderAdd pageTitle="Product Category" onOpen={handleAddOpen} />
      {data && (
        <CommonTable
          mapData={data.result}
          excludeKeys={excludeKeys}
          editable
          archivable
          onEdit={handleEditOpen}
        />
      )}

      <CommonDrawer
        open={isDrawerOpen}
        onClose={onDrawerClose}
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
    </Box>
  );
}

export default ProductCategory;
