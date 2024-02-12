import { Box, TextField } from "@mui/material";
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
import { useDispatch, useSelector } from "react-redux";
import { Settings } from "@mui/icons-material";
import {
  usePutPriceModeMutation,
  useGetAllPriceModeQuery,
  usePostPriceModeMutation,
  usePatchPriceModeStatusMutation,
} from "../../features/setup/api/priceModeSetupApi";
import ViewProductsByPriceModeModal from "../../components/modals/ViewProductsByPriceModeModal";
import useSnackbar from "../../hooks/useSnackbar";
import { priceModeItemsApi } from "../../features/setup/api/priceModeItemsApi";

function PriceModeSetup() {
  const [drawerMode, setDrawerMode] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [status, setStatus] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(null);

  const { showSnackbar } = useSnackbar();

  const selectedRowData = useSelector((state) => state.selectedRow.value);
  const dispatch = useDispatch();

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
    isOpen: isViewProductsByPriceModeModalOpen,
    onOpen: onViewProductsByPriceModeModalOpen,
    onClose: onViewProductsByPriceModeModalClose,
  } = useDisclosure();

  // Constants
  const tableHeads = [
    "Price Mode Code",
    "Price Mode Description",
    "Tagged Products",
  ];

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
        showSnackbar("Price Mode added successfully", "success");
      } else if (drawerMode === "edit") {
        await putPriceMode({ id: selectedRowData?.id, ...data }).unwrap();
        showSnackbar("Price Mode updated successfully", "success");
      }

      onDrawerClose();
      reset();
    } catch (error) {
      if (error?.data?.error?.message) {
        showSnackbar(error?.data?.error?.message, "error");
      } else {
        showSnackbar(
          `Error ${drawerMode === "add" ? "adding" : "updating"} Price Mode`,
          "error"
        );
      }
    }
  };

  const onArchiveSubmit = async () => {
    try {
      await patchPrideModeStatus(selectedId).unwrap();
      onArchiveClose();
      showSnackbar(
        `Price Mode ${status ? "archived" : "restored"} successfully`,
        "success"
      );
      dispatch(priceModeItemsApi.util.invalidateTags(["Price Mode Items"]));
    } catch (error) {
      if (error?.data?.error?.message) {
        showSnackbar(error?.data?.error?.message, "error");
      } else {
        showSnackbar("Error archiving Price Mode", "error");
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

    setValue("priceMode", editData.priceModeCode);
    setValue("priceModeDescription", editData.priceModeDescription);
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
          onViewMoreConstant={onViewProductsByPriceModeModalOpen}
          onViewMoreConstantDisabled={!status}
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
          disabled={drawerMode === "edit"}
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

      <ViewProductsByPriceModeModal
        open={isViewProductsByPriceModeModalOpen}
        onClose={onViewProductsByPriceModeModalClose}
      />

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
    </Box>
  );
}

export default PriceModeSetup;
