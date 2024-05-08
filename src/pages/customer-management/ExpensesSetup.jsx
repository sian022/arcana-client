import { Box, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import PageHeaderAdd from "../../components/PageHeaderAdd";
import CommonTable from "../../components/CommonTable";
import CommonDrawer from "../../components/CommonDrawer";
import useDisclosure from "../../hooks/useDisclosure";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import { useSelector } from "react-redux";
import { otherExpensesSchema } from "../../schema/schema";
import {
  useGetAllOtherExpensesQuery,
  usePatchOtherExpensesStatusMutation,
  usePostOtherExpensesMutation,
  usePutOtherExpensesMutation,
} from "../../features/setup/api/otherExpensesApi";
import { AttachMoney } from "@mui/icons-material";
import useConfirm from "../../hooks/useConfirm";
import useSnackbar from "../../hooks/useSnackbar";
import { handleCatchErrorMessage } from "../../utils/CustomFunctions";

function ExpensesSetup() {
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
  const tableHeads = ["Other Expenses"];
  const customOrderKeys = ["expenseType"];

  //React Hook Form
  const {
    handleSubmit,
    formState: { errors, isValid },
    register,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(otherExpensesSchema.schema),
    mode: "onChange",
    defaultValues: otherExpensesSchema.defaultValues,
  });

  //RTK Query
  const [postOtherExpenses, { isLoading: isAddLoading }] =
    usePostOtherExpensesMutation();
  const { data, isFetching } = useGetAllOtherExpensesQuery({
    Search: search,
    Status: status,
    PageNumber: page + 1,
    PageSize: rowsPerPage,
  });
  const [putOtherExpenses, { isLoading: isUpdateLoading }] =
    usePutOtherExpensesMutation();
  const [patchOtherExpensesStatus] = usePatchOtherExpensesStatusMutation();

  const onDrawerSubmit = async (data) => {
    try {
      if (drawerMode === "add") {
        await postOtherExpenses(data).unwrap();
      } else if (drawerMode === "edit") {
        await putOtherExpenses(data).unwrap();
      }

      onDrawerClose();
      reset();
      snackbar({
        message: `Other Expenses ${
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
            {" "}
            Are you sure you want to {status ? "archive" : "restore"}{" "}
            <span style={{ fontWeight: "bold", textTransform: "uppercase" }}>
              {selectedRowData?.expenseType}
            </span>
            ?
          </>
        ),
        question: !status,
        callback: () => patchOtherExpensesStatus(selectedRowData?.id).unwrap(),
      });
      snackbar({
        message: `Other Expenses ${
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

    // Object.keys(editData).forEach((key) => {
    //   setValue(key, editData[key]);
    // });
    setValue("id", editData.id);
    setValue("expenseType", editData.expenseType);
  };

  const handleDrawerClose = () => {
    onDrawerClose();
    reset();
  };

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
            Expenses Setup <AttachMoney />
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
          mapData={data?.otherExpenses}
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
        drawerHeader={
          (drawerMode === "add" ? "Add" : "Edit") + " Other Expenses"
        }
        onSubmit={handleSubmit(onDrawerSubmit)}
        disableSubmit={!isValid}
        isLoading={drawerMode === "add" ? isAddLoading : isUpdateLoading}
      >
        <TextField
          label="Expense Type"
          size="small"
          autoComplete="off"
          {...register("expenseType")}
          error={errors?.expenseType}
          helperText={errors?.expenseType?.message}
        />
      </CommonDrawer>
    </Box>
  );
}

export default ExpensesSetup;
