import { Box, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import PageHeaderAdd from "../../components/PageHeaderAdd";
import CommonTable from "../../components/CommonTable";
import CommonDrawer from "../../components/CommonDrawer";
import useDisclosure from "../../hooks/useDisclosure";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { meatTypeSchema } from "../../schema/schema";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import {
  useGetAllMeatTypesQuery,
  usePatchMeatTypeStatusMutation,
  usePostMeatTypeMutation,
  usePutMeatTypeMutation,
} from "../../features/setup/api/meatTypeApi";
import { useSelector } from "react-redux";
import { RestaurantMenu } from "@mui/icons-material";
import useConfirm from "../../hooks/useConfirm";
import useSnackbar from "../../hooks/useSnackbar";
import { handleCatchErrorMessage } from "../../utils/CustomFunctions";

function MeatType() {
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
  const tableHeads = ["Meat Type"];
  const customOrderKeys = ["meatTypeName"];

  //React Hook Form
  const {
    handleSubmit,
    formState: { errors, isValid },
    register,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(meatTypeSchema.schema),
    mode: "onChange",
    defaultValues: meatTypeSchema.defaultValues,
  });

  //RTK Query
  const [postMeatType, { isLoading: isAddLoading }] = usePostMeatTypeMutation();
  const { data, isFetching } = useGetAllMeatTypesQuery({
    Search: search,
    Status: status,
    PageNumber: page + 1,
    PageSize: rowsPerPage,
  });
  const [putMeatType, { isLoading: isUpdateLoading }] =
    usePutMeatTypeMutation();
  const [patchMeatTypeStatus] = usePatchMeatTypeStatusMutation();

  //Drawer Functions
  const onDrawerSubmit = async (data) => {
    try {
      if (drawerMode === "add") {
        await postMeatType(data).unwrap();
      } else if (drawerMode === "edit") {
        await putMeatType(data).unwrap();
      }

      onDrawerClose();
      reset();
      snackbar({
        message: `Meat Type ${
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
            Are you sure you want to {status ? "archive" : "restore"}{" "}
            <span style={{ fontWeight: "bold", textTransform: "uppercase" }}>
              {selectedRowData?.meatTypeName}
            </span>
            ?
          </>
        ),
        question: !status,
        callback: () => patchMeatTypeStatus(selectedRowData?.id).unwrap(),
      });

      snackbar({
        message: `Meat Type ${status ? "archived" : "restored"} successfully`,
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
            Meat Type <RestaurantMenu />
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
          mapData={data?.meatTypes}
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
        drawerHeader={(drawerMode === "add" ? "Add" : "Edit") + " Meat Type"}
        onSubmit={handleSubmit(onDrawerSubmit)}
        disableSubmit={!isValid}
        isLoading={drawerMode === "add" ? isAddLoading : isUpdateLoading}
      >
        <TextField
          label="Meat Type Name"
          size="small"
          autoComplete="off"
          {...register("meatTypeName")}
          helperText={errors?.meatTypeName?.message}
          error={errors?.meatTypeName}
        />
      </CommonDrawer>
    </Box>
  );
}

export default MeatType;
