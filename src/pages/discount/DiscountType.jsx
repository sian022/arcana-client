import { Box, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import PageHeaderAdd from "../../components/PageHeaderAdd";
import CommonTable from "../../components/CommonTable";
import CommonDrawer from "../../components/CommonDrawer";
import useDisclosure from "../../hooks/useDisclosure";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { discountTypeSchema } from "../../schema/schema";
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

function DiscountType() {
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
  const excludeKeysDisplay = [
    "id",
    "createdAt",
    "addedBy",
    "updateAt",
    "modifiedBy",
    "isActive",
  ];

  //React Hook Form
  const {
    handleSubmit,
    formState: { errors, isValid },
    register,
    setValue,
    reset,
    control,
  } = useForm({
    resolver: yupResolver(discountTypeSchema.schema),
    mode: "onChange",
    defaultValues: discountTypeSchema.defaultValues,
  });

  //RTK Query
  const [postDiscountType] = usePostDiscountTypeMutation();
  const { data, isLoading } = useGetAllDiscountTypesQuery({
    Search: search,
    Status: status,
    PageNumber: page + 1,
    PageSize: rowsPerPage,
  });
  const [putDiscountType] = usePutDiscountTypeMutation();
  const [patchDiscountTypeStatus] = usePatchDiscountTypeStatusMutation();

  //Drawer Functions
  const onDrawerSubmit = async (data) => {
    try {
      if (drawerMode === "add") {
        await postDiscountType(data).unwrap();
        setSnackbarMessage("Discount Type added successfully");
      } else if (drawerMode === "edit") {
        await putDiscountType(data).unwrap();
        setSnackbarMessage("Discount Type updated successfully");
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
      await patchDiscountTypeStatus(selectedId).unwrap();
      onArchiveClose();
      setSnackbarMessage(
        `Discount Type ${status ? "archived" : "restored"} successfully`
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

    Object.keys(editData).forEach((key) => {
      setValue(key, editData[key]);
    });
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
        pageTitle="Discount Type"
        onOpen={handleAddOpen}
        setSearch={setSearch}
        setStatus={setStatus}
      />
      {isLoading ? (
        <CommonTableSkeleton />
      ) : (
        <CommonTable
          mapData={data?.discount}
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
        />
      )}

      <CommonDrawer
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        drawerHeader={
          (drawerMode === "add" ? "Add" : "Edit") + " Discount Type"
        }
        onSubmit={handleSubmit(onDrawerSubmit)}
        disableSubmit={!isValid}
      >
        <TextField
          label="Lower Boundary"
          size="small"
          autoComplete="off"
          {...register("lowerBound")}
          helperText={errors?.lowerBound?.message}
          error={errors?.lowerBound}
          type="number"
          inputProps={{ min: 0 }}
        />

        <TextField
          label="Upper Boundary"
          size="small"
          autoComplete="off"
          {...register("upperBound")}
          helperText={errors?.upperBound?.message}
          error={errors?.upperBound}
          type="number"
          inputProps={{ min: 0 }}
        />

        <TextField
          label="Commission Rate Lower"
          size="small"
          autoComplete="off"
          {...register("commissionRateLower")}
          helperText={errors?.commissionRateLower?.message}
          error={errors?.commissionRateLower}
          type="number"
          inputProps={{ min: 0 }}
        />

        <TextField
          label="Commission Rate Upper"
          size="small"
          autoComplete="off"
          {...register("commissionRateUpper")}
          helperText={errors?.commissionRateUpper?.message}
          error={errors?.commissionRateUpper}
          type="number"
          inputProps={{ min: 0 }}
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

export default DiscountType;
