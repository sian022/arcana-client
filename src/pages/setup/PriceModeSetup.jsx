import { Box, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import PageHeaderAdd from "../../components/PageHeaderAdd";
import CommonTable from "../../components/CommonTable";
import CommonDrawer from "../../components/CommonDrawer";
import useDisclosure from "../../hooks/useDisclosure";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
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
import ViewProductsByPriceModeModal from "../../components/modals/ViewProductsByPriceModeModal";
import useSnackbar from "../../hooks/useSnackbar";
import useConfirm from "../../hooks/useConfirm";
import { handleCatchErrorMessage } from "../../utils/CustomFunctions";

function PriceModeSetup() {
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
  } = useForm({
    resolver: yupResolver(priceModeSetupSchema.schema),
    mode: "onChange",
    defaultValues: priceModeSetupSchema.defaultValues,
  });

  //RTK Query
  const [postPriceMode, { isLoading: isAddLoading }] =
    usePostPriceModeMutation();
  const { data, isFetching } = useGetAllPriceModeQuery({
    Search: search,
    Status: status,
    PageNumber: page + 1,
    PageSize: rowsPerPage,
  });
  const [putPriceMode, { isLoading: isUpdateLoading }] =
    usePutPriceModeMutation();
  const [patchPrideModeStatus] = usePatchPriceModeStatusMutation();

  //Drawer Functions
  const onDrawerSubmit = async (data) => {
    try {
      if (drawerMode === "add") {
        await postPriceMode(data).unwrap();
        snackbar({
          message: "Price Mode added successfully",
          variant: "success",
        });
      } else if (drawerMode === "edit") {
        await putPriceMode({ id: selectedRowData?.id, ...data }).unwrap();
        snackbar({
          message: "Price Mode updated successfully",
          variant: "success",
        });
      }

      onDrawerClose();
      reset();
    } catch (error) {
      if (error?.data?.error?.message) {
        snackbar({ message: error?.data?.error?.message, variant: "error" });
      } else {
        snackbar({
          message: `Error ${
            drawerMode === "add" ? "adding" : "updating"
          } Price Mode`,
          variant: "error",
        });
      }
    }
  };

  const onArchive = async () => {
    try {
      await confirm({
        children: (
          <>
            Are you sure you want to {status ? "archive" : "restore"}{" "}
            <span style={{ fontWeight: "bold", textTransform: "uppercase" }}>
              {selectedRowData?.priceModeCode}
            </span>
            ?
          </>
        ),
        question: !status,
        callback: () => patchPrideModeStatus(selectedRowData?.id).unwrap(),
      });

      snackbar({
        message: `Price Mode ${status ? "archived" : "restored"} successfully`,
        variant: "success",
      });
    } catch (error) {
      if (error.isConfirmed) {
        snackbar({
          message: handleCatchErrorMessage(error),
          variant: "error",
        });
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
            Price Mode Setup <Settings />
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
          mapData={data?.priceMode}
          onEdit={handleEditOpen}
          onArchive={onArchive}
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
    </Box>
  );
}

export default PriceModeSetup;
