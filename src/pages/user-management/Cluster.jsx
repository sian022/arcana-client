import { Box, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import PageHeaderAdd from "../../components/PageHeaderAdd";
import CommonTable from "../../components/CommonTable";
import CommonDrawer from "../../components/CommonDrawer";
import useDisclosure from "../../hooks/useDisclosure";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import { clusterSchema } from "../../schema/schema";
import { useSelector } from "react-redux";
import {
  useGetAllClustersQuery,
  usePatchClusterStatusMutation,
  usePostClusterMutation,
  usePutClusterMutation,
} from "../../features/setup/api/clusterApi";
import ViewCDOModal from "../../components/modals/ViewCDOModal";
import { PinDrop } from "@mui/icons-material";
import useConfirm from "../../hooks/useConfirm";
import useSnackbar from "../../hooks/useSnackbar";
import { handleCatchErrorMessage } from "../../utils/CustomFunctions";

function Cluster() {
  const [drawerMode, setDrawerMode] = useState("");
  const [status, setStatus] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(null);

  const confirm = useConfirm();
  const snackbar = useSnackbar();
  const selectedRowData = useSelector((state) => state.selectedRow.value);

  // Drawer Disclosures
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();

  // const {
  //   isOpen: isTagOpen,
  //   onOpen: onTagOpen,
  //   onClose: onTagClose,
  // } = useDisclosure();

  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();

  // Constants
  const tableHeads = ["Cluster", "Users Tagged"];
  const customOrderKeys = ["cluster", "users"];

  //React Hook Form
  const {
    handleSubmit,
    formState: { errors, isValid },
    register,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(clusterSchema.schema),
    mode: "onChange",
    defaultValues: clusterSchema.defaultValues,
  });

  //RTK Query
  const [postCluster, { isLoading: isAddLoading }] = usePostClusterMutation();
  const { data, isFetching } = useGetAllClustersQuery({
    Search: search,
    Status: status,
    PageNumber: page + 1,
    PageSize: rowsPerPage,
  });
  const [putCluster, { isLoading: isUpdateLoading }] = usePutClusterMutation();
  const [patchClusterStatus] = usePatchClusterStatusMutation();

  //Drawer Functions
  const onDrawerSubmit = async (data) => {
    try {
      if (drawerMode === "add") {
        await postCluster(data).unwrap();
      } else if (drawerMode === "edit") {
        await putCluster(data).unwrap();
      }

      onDrawerClose();
      reset();

      snackbar({
        message: `Cluster ${
          drawerMode === "add" ? "added" : "updated"
        } successfully`,
        type: "success",
      });
    } catch (error) {
      snackbar({ message: handleCatchErrorMessage(error), type: "error" });
    }
  };

  const onArchive = async () => {
    try {
      await confirm({
        children: (
          <>
            Are you sure you want to {status ? "archive" : "restore"}{" "}
            <span style={{ fontWeight: "bold", textTransform: "uppercase" }}>
              {selectedRowData?.cluster}
            </span>
            ?
          </>
        ),
        question: !status,
        callback: () => patchClusterStatus(selectedRowData?.id).unwrap(),
      });

      snackbar({
        message: `Cluster ${status ? "archived" : "restored"} successfully`,
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
    <>
      <Box className="commonPageLayout">
        <PageHeaderAdd
          pageTitle={
            <>
              Cluster <PinDrop />
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
            mapData={data?.cluster}
            customOrderKeys={customOrderKeys}
            onEdit={handleEditOpen}
            onArchive={onArchive}
            viewMoreKey={"users"}
            onViewMoreClick={onViewOpen}
            // onTagUserInCluster={onTagOpen}
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
          drawerHeader={(drawerMode === "add" ? "Add" : "Edit") + " Cluster"}
          onSubmit={handleSubmit(onDrawerSubmit)}
          disableSubmit={!isValid}
          isLoading={drawerMode === "add" ? isAddLoading : isUpdateLoading}
        >
          <TextField
            label="Cluster Name"
            size="small"
            autoComplete="off"
            {...register("cluster")}
            helperText={errors?.cluster?.message}
            error={errors?.cluster}
          />
        </CommonDrawer>
      </Box>

      <ViewCDOModal
        open={isViewOpen}
        onClose={onViewClose}
        isFetching={isFetching}
        data={data?.cluster}
      />
    </>
  );
}

export default Cluster;
