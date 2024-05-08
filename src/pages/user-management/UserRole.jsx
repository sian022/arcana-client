import { Box, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import PageHeaderAdd from "../../components/PageHeaderAdd";
import CommonDrawer from "../../components/CommonDrawer";
import useDisclosure from "../../hooks/useDisclosure";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userRoleSchema } from "../../schema/schema";
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
import useConfirm from "../../hooks/useConfirm";
import { SupervisorAccount } from "@mui/icons-material";
import { handleCatchErrorMessage } from "../../utils/CustomFunctions";

function UserRole() {
  const snackbar = useSnackbar();
  const confirm = useConfirm();
  const selectedRowData = useSelector((state) => state.selectedRow.value);

  const [drawerMode, setDrawerMode] = useState("");
  const [status, setStatus] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(null);
  const [checkedModules, setCheckedModules] = useState(["Dashboard"]);
  // const [checkedModules, setCheckedModules] = useState([]);

  // Drawer Disclosures
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
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
  const { data, isFetching } = useGetAllUserRolesQuery({
    Search: search,
    Status: status,
    PageNumber: page + 1,
    PageSize: rowsPerPage,
  });
  const [putUserRole, { isLoading: isUpdateLoading }] =
    usePutUserRoleMutation();
  const [patchUserRoleStatus] = usePatchUserRoleStatusMutation();
  const [putTagUserRole, { isLoading: isTagLoading }] =
    usePutTagUserRoleMutation();

  //Drawer Functions
  const onDrawerSubmit = async (data) => {
    try {
      if (drawerMode === "add") {
        await postUserRole(data).unwrap();
      } else if (drawerMode === "edit") {
        await putUserRole(data).unwrap();
      }

      onDrawerClose();
      reset();
      snackbar({
        message: `User Role ${
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
              {selectedRowData?.roleName}
            </span>
            ?
          </>
        ),
        question: !status,
        callback: () => patchUserRoleStatus(selectedRowData?.id).unwrap(),
      });

      snackbar({
        message: `User Role ${status ? "archived" : "restored"} successfully`,
        variant: "success",
      });
    } catch (error) {
      if (error.isConfirmed) {
        snackbar({ message: handleCatchErrorMessage(error), variant: "error" });
      }
    }
  };

  const onTaggingSubmit = async () => {
    try {
      await putTagUserRole({
        id: selectedRowData?.id,
        permissions: checkedModules,
      }).unwrap();
      onTaggingClose();

      snackbar({
        message: `User Role tagged successfully`,
        variant: "success",
      });
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
            User Role <SupervisorAccount />
          </>
        }
        onOpen={handleAddOpen}
        setSearch={setSearch}
        setStatus={setStatus}
      />
      {isFetching ? (
        <CommonTableSkeleton evenLesserCompact />
      ) : (
        <RoleTable
          evenLesserCompact
          mapData={data?.userRoles}
          excludeKeys={excludeKeys}
          onEdit={handleEditOpen}
          onArchive={onArchive}
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
