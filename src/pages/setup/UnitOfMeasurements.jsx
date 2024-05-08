import { Box, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import PageHeaderAdd from "../../components/PageHeaderAdd";
import CommonTable from "../../components/CommonTable";
import CommonDrawer from "../../components/CommonDrawer";
import useDisclosure from "../../hooks/useDisclosure";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import {
  useGetAllUomsQuery,
  usePatchUomStatusMutation,
  usePostUomMutation,
  usePutUomMutation,
} from "../../features/setup/api/uomApi";
import { uomSchema } from "../../schema/schema";
import { useSelector } from "react-redux";
import { SquareFoot } from "@mui/icons-material";
import useConfirm from "../../hooks/useConfirm";
import useSnackbar from "../../hooks/useSnackbar";
import { handleCatchErrorMessage } from "../../utils/CustomFunctions";

function UnitOfMeasurements() {
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
  const tableHeads = ["UOM Code", "UOM Description"];
  const customOrderKeys = ["uomCode", "uomDescription"];

  //React Hook Form
  const {
    handleSubmit,
    formState: { errors, isValid },
    register,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(uomSchema.schema),
    mode: "onChange",
    defaultValues: uomSchema.defaultValues,
  });

  //RTK Query
  const [postUom, { isLoading: isAddLoading }] = usePostUomMutation();
  const { data, isFetching } = useGetAllUomsQuery({
    Search: search,
    Status: status,
    PageNumber: page + 1,
    PageSize: rowsPerPage,
  });
  const [putUom, { isLoading: isUpdateLoading }] = usePutUomMutation();
  const [patchUomStatus] = usePatchUomStatusMutation();

  //Drawer Functions
  const onDrawerSubmit = async (data) => {
    try {
      if (drawerMode === "add") {
        await postUom(data).unwrap();
      } else if (drawerMode === "edit") {
        await putUom(data).unwrap();
      }

      onDrawerClose();
      reset();
      snackbar({
        message: `UOM ${
          drawerMode === "add" ? "added" : "updated"
        } successfully`,
        variant: "success",
      });
    } catch (error) {
      if (error.isConfirmed) {
        snackbar({ message: handleCatchErrorMessage(error), variant: "error" });
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
              {selectedRowData?.uomCode}
            </span>
            ?
          </>
        ),
        question: !status,
        callback: () => patchUomStatus(selectedRowData?.id).unwrap(),
      });

      snackbar({
        message: `UOM ${status ? "archived" : "restored"} successfully`,
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
            Unit of Measurements <SquareFoot />
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
          mapData={data?.uom}
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
        drawerHeader={(drawerMode === "add" ? "Add" : "Edit") + " UOM"}
        onSubmit={handleSubmit(onDrawerSubmit)}
        disableSubmit={!isValid}
        isLoading={drawerMode === "add" ? isAddLoading : isUpdateLoading}
      >
        <TextField
          label="UOM Code"
          size="small"
          autoComplete="off"
          {...register("uomCode")}
          helperText={errors?.uomCode?.message}
          error={errors?.uomCode}
        />
        <TextField
          label="UOM Description"
          size="small"
          autoComplete="off"
          {...register("uomDescription")}
          helperText={errors?.uomDescription?.message}
          error={errors?.uomDescription}
        />
      </CommonDrawer>
    </Box>
  );
}

export default UnitOfMeasurements;
