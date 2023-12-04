import { Box, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import PageHeaderAdd from "../../components/PageHeaderAdd";
import CommonTable from "../../components/CommonTable";
import CommonDrawer from "../../components/CommonDrawer";
import useDisclosure from "../../hooks/useDisclosure";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { variableDiscountSchema } from "../../schema/schema";
import CommonDialog from "../../components/CommonDialog";
import SuccessSnackbar from "../../components/SuccessSnackbar";
import ErrorSnackbar from "../../components/ErrorSnackbar";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import {
  useGetAllDiscountTypesQuery,
  usePatchDiscountTypeStatusMutation,
  usePostDiscountTypeMutation,
  usePutDiscountTypeMutation,
} from "../../features/setup/api/discountTypeApi";
import { useSelector } from "react-redux";
import { NumericFormat } from "react-number-format";

function VariableDiscount() {
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
    "updateAt",
    "modifiedBy",
    "isActive",
    "totalActives",
    "currentAmount",
  ];

  const pesoArray = ["minimumAmount", "maximumAmount"];
  const percentageArray = ["minimumPercentage", "maximumPercentage"];

  //React Hook Form
  const {
    handleSubmit,
    formState: { errors, isValid },
    register,
    setValue,
    reset,
    control,
    getValues,
  } = useForm({
    resolver: yupResolver(variableDiscountSchema.schema),
    mode: "onChange",
    defaultValues: variableDiscountSchema.defaultValues,
  });

  //RTK Query
  const [postDiscountType, { isLoading: isAddLoading }] =
    usePostDiscountTypeMutation();
  const { data, isLoading, isFetching } = useGetAllDiscountTypesQuery({
    Search: search,
    Status: status,
    PageNumber: page + 1,
    PageSize: rowsPerPage,
  });
  const [putDiscountType, { isLoading: isUpdateLoading }] =
    usePutDiscountTypeMutation();
  const [patchDiscountTypeStatus, { isLoading: isArchiveLoading }] =
    usePatchDiscountTypeStatusMutation();

  //Drawer Functions
  const onDrawerSubmit = async (data) => {
    try {
      if (drawerMode === "add") {
        await postDiscountType(data).unwrap();
        setSnackbarMessage("Variable Discount added successfully");
      } else if (drawerMode === "edit") {
        await putDiscountType(data).unwrap();
        setSnackbarMessage("Variable Discount updated successfully");
      }

      onDrawerClose();
      reset();
      onSuccessOpen();
    } catch (error) {
      if (error?.data?.error?.message) {
        setSnackbarMessage(error?.data?.error?.message);
      } else {
        setSnackbarMessage(
          `Error ${
            drawerMode === "add" ? "adding" : "updating"
          } variable discount`
        );
      }

      onErrorOpen();
    }
  };

  const onArchiveSubmit = async () => {
    try {
      await patchDiscountTypeStatus(selectedId).unwrap();
      onArchiveClose();
      setSnackbarMessage(
        `Variable Discount ${status ? "archived" : "restored"} successfully`
      );
      onSuccessOpen();
    } catch (error) {
      if (error?.data?.error?.message) {
        setSnackbarMessage(error?.data?.error?.message);
      } else {
        setSnackbarMessage("Error archiving variable discount");
      }

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

    // Object.keys(editData).forEach((key) => {
    //   setValue(key, editData[key]);
    //   console.log(typeof editData[key]);
    // });

    setValue("id", editData.id);
    setValue("minimumAmount", editData.minimumAmount);
    setValue("maximumAmount", editData.maximumAmount);
    setValue("minimumPercentage", editData.minimumPercentage * 100);
    setValue("maximumPercentage", editData.maximumPercentage * 100);
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

  useEffect(() => {
    if (isDrawerOpen && drawerMode === "add") {
      setValue(
        "minimumAmount",
        // data?.discount[data?.discount?.length - 1]?.maximumAmount + 0.000001
        Math.ceil(data?.discount[data?.discount?.length - 1]?.maximumAmount) + 1
      );
    }
  }, [isDrawerOpen]);

  return (
    <Box className="commonPageLayout">
      <PageHeaderAdd
        pageTitle="Variable Discount"
        onOpen={handleAddOpen}
        setSearch={setSearch}
        setStatus={setStatus}
      />
      {isFetching ? (
        <CommonTableSkeleton />
      ) : (
        <CommonTable
          mapData={data?.discount}
          excludeKeysDisplay={excludeKeysDisplay}
          pesoArray={pesoArray}
          percentageArray={percentageArray}
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
        drawerHeader={
          (drawerMode === "add" ? "Add" : "Edit") + " Variable Discount"
        }
        onSubmit={handleSubmit(onDrawerSubmit)}
        disableSubmit={!isValid}
        isLoading={drawerMode === "add" ? isAddLoading : isUpdateLoading}
      >
        <Controller
          control={control}
          name={"minimumAmount"}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <NumericFormat
              label="Minimum Amount (₱)"
              type="text"
              size="small"
              customInput={TextField}
              autoComplete="off"
              onValueChange={(e) => {
                onChange(Number(e.value));
              }}
              onBlur={onBlur}
              value={value || ""}
              ref={ref}
              required
              thousandSeparator=","
              disabled={data?.discount?.length > 0 && drawerMode === "add"}
            />
          )}
        />
        {/* <TextField
          label="Minimum Amount (₱)"
          size="small"
          autoComplete="off"
          {...register("minimumAmount")}
          helperText={errors?.minimumAmount?.message}
          error={errors?.minimumAmount}
          type="number"
          inputProps={{ min: 0 }}
          disabled={data?.discount?.length > 0}
          // value={data?.discount[data?.discount?.length - 1]?.minimumAmount + 1}
        /> */}

        <Controller
          control={control}
          name={"maximumAmount"}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <NumericFormat
              label="Maximum Amount (₱)"
              type="text"
              size="small"
              customInput={TextField}
              autoComplete="off"
              onValueChange={(e) => {
                onChange(Number(e.value));
              }}
              onBlur={onBlur}
              value={value || ""}
              ref={ref}
              required
              thousandSeparator=","
            />
          )}
        />
        {/* <TextField
          label="Maximum Amount (₱)"
          size="small"
          autoComplete="off"
          {...register("maximumAmount")}
          helperText={errors?.maximumAmount?.message}
          error={errors?.maximumAmount}
          type="number"
          inputProps={{ min: 0 }}
        /> */}

        <Controller
          control={control}
          name={"minimumPercentage"}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <NumericFormat
              label="Minimum Percentage"
              type="text"
              size="small"
              customInput={TextField}
              autoComplete="off"
              onValueChange={(e) => {
                onChange(Number(e.value));
              }}
              onBlur={onBlur}
              value={value || ""}
              ref={ref}
              required
              thousandSeparator=","
              inputProps={{ min: 0 }}
            />
          )}
        />
        {/* <TextField
          label="Minimum Percentage"
          size="small"
          autoComplete="off"
          {...register("minimumPercentage")}
          helperText={errors?.minimumPercentage?.message}
          error={errors?.minimumPercentage}
          type="number"
          inputProps={{ min: 0 }}
        /> */}

        <Controller
          control={control}
          name={"maximumPercentage"}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <NumericFormat
              label="Maximum Percentage"
              type="text"
              size="small"
              customInput={TextField}
              autoComplete="off"
              onValueChange={(e) => {
                onChange(Number(e.value));
              }}
              onBlur={onBlur}
              value={value || ""}
              ref={ref}
              required
              thousandSeparator=","
              inputProps={{ min: 0 }}
            />
          )}
        />
        {/* <TextField
          label="Maximum Percentage"
          size="small"
          autoComplete="off"
          {...register("maximumPercentage")}
          helperText={errors?.maximumPercentage?.message}
          error={errors?.maximumPercentage}
          type="number"
          inputProps={{ min: 0 }}
        /> */}
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
          variable discount range
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

export default VariableDiscount;
