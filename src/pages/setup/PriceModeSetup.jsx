import { Autocomplete, Box, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import PageHeaderAdd from "../../components/PageHeaderAdd";
import CommonTable from "../../components/CommonTable";
import CommonDrawer from "../../components/CommonDrawer";
import useDisclosure from "../../hooks/useDisclosure";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CommonDialog from "../../components/CommonDialog";
import SuccessSnackbar from "../../components/SuccessSnackbar";
import ErrorSnackbar from "../../components/ErrorSnackbar";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import { priceModeSetupSchema } from "../../schema/schema";
import { useSelector } from "react-redux";
import { Settings } from "@mui/icons-material";
import {
  usePutPriceModeMutation,
  useGetAllPriceModeQuery,
  usePostPriceModeMutation,
  usePatchPriceModeStatusMutation,
} from "../../features/setup/api/priceModeSetupApi";

function UnitOfMeasurements() {
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
    "updatedAt",
    "modifiedBy",
    "isActive",
  ];

  const tableHeads = ["Price Mode Code", "Price Mode Description"];

  const customOrderKeys = ["priceModeCode", "priceModeDescription"];

  //React Hook Form
  const {
    handleSubmit,
    formState: { errors, isValid },
    register,
    setValue,
    reset,
    getValues,
  } = useForm({
    resolver: yupResolver(priceModeSetupSchema.schema),
    mode: "onChange",
    defaultValues: priceModeSetupSchema.defaultValues,
  });

  //RTK Query
  const [postPriceMode, { isLoading: isAddLoading }] =
    usePostPriceModeMutation();
  const { data, isLoading, isFetching } = useGetAllPriceModeQuery({
    Search: search,
    Status: status,
    PageNumber: page + 1,
    PageSize: rowsPerPage,
  });
  const [putPriceMode, { isLoading: isUpdateLoading }] =
    usePutPriceModeMutation();
  const [patchPrideModeStatus, { isLoading: isArchiveLoading }] =
    usePatchPriceModeStatusMutation();

  //Drawer Functions
  const onDrawerSubmit = async (data) => {
    try {
      if (drawerMode === "add") {
        await postPriceMode(data).unwrap();
        setSnackbarMessage("Price Mode added successfully");
      } else if (drawerMode === "edit") {
        await putPriceMode(data).unwrap();
        setSnackbarMessage("Price Mode updated successfully");
      }

      onDrawerClose();
      reset();
      onSuccessOpen();
    } catch (error) {
      if (error?.data?.error?.message) {
        setSnackbarMessage(error?.data?.error?.message);
      } else {
        setSnackbarMessage(
          `Error ${drawerMode === "add" ? "adding" : "updating"} Price Mode`
        );
      }

      onErrorOpen();
    }
  };

  const onArchiveSubmit = async () => {
    try {
      await patchPrideModeStatus(selectedId).unwrap();
      onArchiveClose();
      setSnackbarMessage(
        `Price Mode ${status ? "archived" : "restored"} successfully`
      );
      onSuccessOpen();
    } catch (error) {
      if (error?.data?.error?.message) {
        setSnackbarMessage(error?.data?.error?.message);
      } else {
        setSnackbarMessage("Error archiving Price Mode");
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
        pageTitle={
          <>
            Price Mode Setup <Settings />
          </>
        }
        onOpen={handleAddOpen}
        setSearch={setSearch}
        setStatus={setStatus}
      />
      {isFetching ? (
        <CommonTableSkeleton />
      ) : (
        <CommonTable
          mapData={data?.priceMode}
          editable
          archivable
          onEdit={handleEditOpen}
          onArchive={handleArchiveOpen}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          tableHeads={tableHeads}
          customOrderKeys={customOrderKeys}
          count={count}
          status={status}
        />
      )}

      <CommonDrawer
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        drawerHeader={(drawerMode === "add" ? "Add" : "Edit") + " Price Mode"}
        onSubmit={handleSubmit(onDrawerSubmit)}
        disableSubmit={!isValid}
        isLoading={drawerMode === "add" ? isAddLoading : isUpdateLoading}
      >
        <TextField
          label="Price Mode Code"
          size="small"
          autoComplete="off"
          {...register("priceMode")}
          helperText={errors?.priceMode?.message}
          error={errors?.priceMode}
        />
        <TextField
          label="Price Mode Description"
          size="small"
          autoComplete="off"
          {...register("priceModeDescription")}
          helperText={errors?.priceModeDescription?.message}
          error={errors?.priceModeDescription}
        />
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
          {selectedRowData?.priceModeCode}
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

export default UnitOfMeasurements;
