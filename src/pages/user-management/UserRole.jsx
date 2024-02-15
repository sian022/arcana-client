import { Box, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import PageHeaderAdd from "../../components/PageHeaderAdd";
import CommonDrawer from "../../components/CommonDrawer";
import useDisclosure from "../../hooks/useDisclosure";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userRoleSchema } from "../../schema/schema";
import CommonDialog from "../../components/CommonDialog";
import SuccessSnackbar from "../../components/SuccessSnackbar";
import ErrorSnackbar from "../../components/ErrorSnackbar";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import {
  usePatchUserRoleStatusMutation,
  useGetAllUserRolesQuery,
  usePostUserRoleMutation,
  usePutUserRoleMutation,
  usePutTagUserRoleMutation,
} from "../../features/user-management/api/userRoleApi";
import RoleTable from "../../components/RoleTable";
import RoleTaggingModal from "../../components/modals/RoleTaggingModal";
import { useSelector } from "react-redux";
import useSnackbar from "../../hooks/useSnackbar";
import { SupervisorAccount } from "@mui/icons-material";

function UserRole() {
  const { showSnackbar, closeSnackbar } = useSnackbar();

  const selectedRowData = useSelector((state) => state.selectedRow.value);

  const [drawerMode, setDrawerMode] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [status, setStatus] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [checkedModules, setCheckedModules] = useState(["Dashboard"]);
  // const [checkedModules, setCheckedModules] = useState([]);

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

  const {
    isOpen: isTaggingOpen,
    onOpen: onTaggingOpen,
    onClose: onTaggingClose,
  } = useDisclosure();

  // Constants
  const excludeKeys = [
    "createdAt",
    "addedBy",
    "updatedAt",
    "modifiedBy",
    "isActive",
    "user",
    // "permissions",
    "isTagged",
  ];

  const tableHeads = ["Role"];

  //React Hook Form
  const {
    handleSubmit,
    formState: { errors, isValid },
    register,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(userRoleSchema.schema),
    mode: "onChange",
    defaultValues: userRoleSchema.defaultValues,
  });

  //RTK Query
  const [postUserRole, { isLoading: isAddLoading }] = usePostUserRoleMutation();
  const { data, isLoading, isFetching } = useGetAllUserRolesQuery({
    Search: search,
    Status: status,
    PageNumber: page + 1,
    PageSize: rowsPerPage,
  });
  const [putUserRole, { isLoading: isUpdateLoading }] =
    usePutUserRoleMutation();
  const [patchUserRoleStatus, { isLoading: isArchiveLoading }] =
    usePatchUserRoleStatusMutation();
  const [putTagUserRole, { isLoading: isTagLoading }] =
    usePutTagUserRoleMutation();

  //Drawer Functions
  const onDrawerSubmit = async (data) => {
    try {
      if (drawerMode === "add") {
        await postUserRole(data).unwrap();
        setSnackbarMessage("User Role added successfully");
      } else if (drawerMode === "edit") {
        await putUserRole(data).unwrap();
        setSnackbarMessage("User Role updated successfully");
      }

      onDrawerClose();
      reset();
      onSuccessOpen();
    } catch (error) {
      if (error?.data?.error?.message) {
        setSnackbarMessage(error?.data?.error?.message);
      } else {
        setSnackbarMessage(
          `Error ${drawerMode === "add" ? "adding" : "updating"} user role`
        );
      }

      onErrorOpen();
    }
  };

  const onArchiveSubmit = async () => {
    try {
      await patchUserRoleStatus(selectedId).unwrap();
      onArchiveClose();
      setSnackbarMessage(
        `User Role ${status ? "archived" : "restored"} successfully`
      );
      // onSuccessOpen();
      showSnackbar(
        `User Role ${status ? "archived" : "restored"} successfully`,
        "success"
      );
    } catch (error) {
      if (error?.data?.error?.message) {
        setSnackbarMessage(error?.data?.error?.message);
      } else {
        setSnackbarMessage("Error archiving user role");
      }
      onErrorOpen();
    }
  };

  const onTaggingSubmit = async () => {
    try {
      await putTagUserRole({
        id: selectedRowData?.id,
        permissions: checkedModules,
      }).unwrap();
      onTaggingClose();
      setSnackbarMessage("User Role tagged successfully");
      onSuccessOpen();
    } catch (error) {
      if (error?.data?.error?.message) {
        setSnackbarMessage(error?.data?.error?.message);
      } else {
        setSnackbarMessage("Error tagging user role");
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
            User Role <SupervisorAccount />
          </>
        }
        onOpen={handleAddOpen}
        setSearch={setSearch}
        setStatus={setStatus}
      />
      {isFetching ? (
        <CommonTableSkeleton />
      ) : (
        <RoleTable
          mapData={data?.userRoles}
          excludeKeys={excludeKeys}
          onEdit={handleEditOpen}
          onArchive={handleArchiveOpen}
          onTag={onTaggingOpen}
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
        drawerHeader={(drawerMode === "add" ? "Add" : "Edit") + " User Role"}
        onSubmit={handleSubmit(onDrawerSubmit)}
        disableSubmit={!isValid}
        isLoading={drawerMode === "add" ? isAddLoading : isUpdateLoading}
      >
        <TextField
          label="User Role Name"
          size="small"
          autoComplete="off"
          {...register("roleName")}
          helperText={errors?.roleName?.message}
          error={errors?.roleName}
        />
      </CommonDrawer>
      <CommonDialog
        open={isArchiveOpen}
        onClose={onArchiveClose}
        onYes={onArchiveSubmit}
        isLoading={isArchiveLoading}
      >
        Are you sure you want to {status ? "archive" : "restore"}{" "}
        <span style={{ fontWeight: "bold", textTransform: "uppercase" }}>
          {selectedRowData?.roleName}
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
      <RoleTaggingModal
        checkedModules={checkedModules}
        setCheckedModules={setCheckedModules}
        onSubmit={onTaggingSubmit}
        open={isTaggingOpen}
        onClose={onTaggingClose}
        isLoading={isTagLoading}
      />
    </Box>
  );
}

export default UserRole;
