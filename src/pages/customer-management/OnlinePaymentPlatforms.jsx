import { Box, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import PageHeaderAdd from "../../components/PageHeaderAdd";
import CommonTable from "../../components/CommonTable";
import CommonDrawer from "../../components/CommonDrawer";
import useDisclosure from "../../hooks/useDisclosure";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CommonDialog from "../../components/CommonDialog";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import {
  useGetAllTermDaysQuery,
  usePatchTermDaysStatusMutation,
  usePostTermDaysMutation,
  usePutTermDaysMutation,
} from "../../features/setup/api/termDaysApi";
import { onlinePaymentPlatformsSchema } from "../../schema/schema";
import { useSelector } from "react-redux";
import { CreditCard } from "@mui/icons-material";
import { dummyOnlinePaymentPlatformsData } from "../../utils/DummyData";
import useSnackbar from "../../hooks/useSnackbar";
import useConfirm from "../../hooks/useConfirm";
import { handleCatchErrorMessage } from "../../utils/CustomFunctions";

function OnlinePaymentPlatforms() {
  const [drawerMode, setDrawerMode] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [status, setStatus] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(null);

  //Hooks
  const snackbar = useSnackbar();
  const confirm = useConfirm();
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

  // Constants
  const customOrderKeys = ["name"];

  //React Hook Form
  const {
    handleSubmit,
    formState: { errors, isValid },
    register,
    setValue,
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(onlinePaymentPlatformsSchema.schema),
    mode: "onChange",
    defaultValues: onlinePaymentPlatformsSchema.defaultValues,
  });

  console.log(watch());
  //RTK Query
  const [postTermDays, { isLoading: isAddLoading }] = usePostTermDaysMutation();
  const { data, isFetching } = useGetAllTermDaysQuery({
    Search: search,
    Status: status,
    PageNumber: page + 1,
    PageSize: rowsPerPage,
  });
  const [putTermDays, { isLoading: isUpdateLoading }] =
    usePutTermDaysMutation();
  const [patchTermDaysStatus, { isLoading: isArchiveLoading }] =
    usePatchTermDaysStatusMutation();

  //Drawer Functions
  const onDrawerSubmit = async (data) => {
    try {
      if (drawerMode === "add") {
        await postTermDays(data).unwrap();
      } else if (drawerMode === "edit") {
        await putTermDays(data).unwrap();
      }

      const snackbarMessage = `Online Payment Platform ${
        drawerMode === "add" ? "added" : "updated"
      } successfully`;
      snackbar({ message: snackbarMessage, variant: "success" });
      onDrawerClose();
      reset();
    } catch (error) {
      snackbar({ message: handleCatchErrorMessage(error), variant: "error" });
    }
  };

  const onArchiveSubmit = async () => {
    try {
      await patchTermDaysStatus(selectedId).unwrap();
      onArchiveClose();

      const snackbarMessage = `Online Payment Platform ${
        status ? "archived" : "restored"
      } successfully`;

      snackbar({ message: snackbarMessage, variant: "success" });
    } catch (error) {
      snackbar({ message: handleCatchErrorMessage(error), variant: "error" });
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
            Online Payment Platforms <CreditCard />
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
          mapData={dummyOnlinePaymentPlatformsData}
          customOrderKeys={customOrderKeys}
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
          (drawerMode === "add" ? "Add" : "Edit") + " Online Payment Platform"
        }
        onSubmit={handleSubmit(onDrawerSubmit)}
        disableSubmit={!isValid}
        isLoading={drawerMode === "add" ? isAddLoading : isUpdateLoading}
      >
        <TextField
          label="Online Payment Platform"
          size="small"
          autoComplete="off"
          {...register("name")}
          helperText={errors?.name?.message}
          error={errors?.name}
        />
      </CommonDrawer>

      <CommonDialog
        open={isArchiveOpen}
        onClose={onArchiveClose}
        onYes={onArchiveSubmit}
        isLoading={isArchiveLoading}
        question={!status}
      >
        Are you sure you want to {status ? "archive" : "restore"}{" "}
        <span style={{ fontWeight: "bold", textTransform: "uppercase" }}>
          {selectedRowData?.days}
        </span>
        ?
      </CommonDialog>
    </Box>
  );
}

export default OnlinePaymentPlatforms;
