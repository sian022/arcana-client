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
import { clusterSchema } from "../../schema/schema";
import { useSelector } from "react-redux";
import {
  useGetAllClustersQuery,
  usePatchClusterStatusMutation,
  usePostClusterMutation,
  usePutClusterMutation,
} from "../../features/setup/api/clusterApi";
import TagCDODrawer from "../../components/drawers/TagCDODrawer";
import ViewCDOModal from "../../components/modals/ViewCDOModal";
import { PinDrop } from "@mui/icons-material";

function Cluster() {
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
  const excludeKeysDisplay = [
    "id",
    "createdAt",
    "addedBy",
    "updatedAt",
    "modifiedBy",
    "isActive",
    // "users",
    "userId",
  ];

  // const tableHeads = ["Cluster", "CDO Details"];
  const tableHeads = ["Cluster", "Users Tagged"];

  //React Hook Form
  const {
    handleSubmit,
    formState: { errors, isValid },
    register,
    setValue,
    reset,
    getValues,
  } = useForm({
    resolver: yupResolver(clusterSchema.schema),
    mode: "onChange",
    defaultValues: clusterSchema.defaultValues,
  });

  //RTK Query
  const [postCluster, { isLoading: isAddLoading }] = usePostClusterMutation();
  const { data, isLoading, isFetching } = useGetAllClustersQuery({
    Search: search,
    Status: status,
    PageNumber: page + 1,
    PageSize: rowsPerPage,
  });
  const [putCluster, { isLoading: isUpdateLoading }] = usePutClusterMutation();
  const [patchClusterStatus, { isLoading: isArchiveLoading }] =
    usePatchClusterStatusMutation();

  // const [postUom, { isLoading: isAddLoading }] = usePostUomMutation();
  // const { data, isLoading, isFetching } = useGetAllUomsQuery({
  //   Search: search,
  //   Status: status,
  //   PageNumber: page + 1,
  //   PageSize: rowsPerPage,
  // });
  // const [putUom, { isLoading: isUpdateLoading }] = usePutUomMutation();
  // const [patchUomStatus, { isLoading: isArchiveLoading }] =
  //   usePatchUomStatusMutation();

  //Drawer Functions
  const onDrawerSubmit = async (data) => {
    try {
      if (drawerMode === "add") {
        await postCluster(data).unwrap();
        setSnackbarMessage("Cluster added successfully");
      } else if (drawerMode === "edit") {
        await putCluster(data).unwrap();
        setSnackbarMessage("Cluster updated successfully");
      }

      onDrawerClose();
      reset();
      onSuccessOpen();
    } catch (error) {
      if (error?.data?.error?.message) {
        setSnackbarMessage(error?.data?.error?.message);
      } else {
        setSnackbarMessage(
          `Error ${drawerMode === "add" ? "adding" : "updating"} cluster`
        );
      }

      onErrorOpen();
    }
  };

  const onArchiveSubmit = async () => {
    try {
      await patchClusterStatus(selectedId).unwrap();
      setSnackbarMessage(
        `Cluster ${status ? "archived" : "restored"} successfully`
      );
      onSuccessOpen();
    } catch (error) {
      if (error?.data?.error?.message) {
        setSnackbarMessage(error?.data?.error?.message);
      } else {
        setSnackbarMessage("Error archiving Cluster");
      }

      onErrorOpen();
    }

    onArchiveClose();
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
          <CommonTableSkeleton />
        ) : (
          <CommonTable
            mapData={data?.cluster}
            excludeKeysDisplay={excludeKeysDisplay}
            editable
            archivable
            onEdit={handleEditOpen}
            onArchive={handleArchiveOpen}
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

        <CommonDialog
          open={isArchiveOpen}
          onClose={onArchiveClose}
          onYes={onArchiveSubmit}
          isLoading={isArchiveLoading}
          noIcon={!status}
        >
          Are you sure you want to {status ? "archive" : "restore"}{" "}
          <span style={{ fontWeight: "bold", textTransform: "uppercase" }}>
            {selectedRowData?.cluster}
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

      {/* <TagCDODrawer open={isTagOpen} onClose={onTagClose} /> */}

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
