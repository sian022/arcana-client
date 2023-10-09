import { Box, TextField } from "@mui/material";
import React from "react";
import PageHeaderAdd from "../../components/PageHeaderAdd";
import CommonTable from "../../components/CommonTable";
import { useGetAllProductsQuery } from "../../features/setup/api/productsApi";
import CommonDrawer from "../../components/CommonDrawer";
import useDisclosure from "../../hooks/useDisclosure";
import { productSchema } from "../../schema/schema";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

function Products() {
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm({
    resolver: yupResolver(productSchema.schema),
    mode: "onChange",
    defaultValues: productSchema.defaultValues,
  });

  const { data, error, isSuccess, isError, isLoading } =
    useGetAllProductsQuery();

  const excludeKeys = ["id", "isActive", "addedBy", "modifiedBy"];

  return (
    <Box className="commonPageLayout">
      <PageHeaderAdd onOpen={onDrawerOpen} pageTitle="Products" />
      {data && (
        <CommonTable
          mapData={data.items}
          excludeKeys={excludeKeys}
          editable
          deletable
        />
      )}
      <CommonDrawer
        open={isDrawerOpen}
        onClose={onDrawerClose}
        drawerHeader={"Add User Account"}
      >
        <TextField label="Item Code" size="small" />
        <TextField label="Item Description" size="small" />
        <TextField label="Unit of Measurement" size="small" />
        <TextField label="Product Sub Category" size="small" />
        <TextField label="Meat Type" size="small" />
      </CommonDrawer>
    </Box>
  );
}

export default Products;
