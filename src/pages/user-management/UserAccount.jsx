import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import CommonTable from "../../components/CommonTable";
import useDisclosure from "../../hooks/useDisclosure";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import {
  usePatchUserStatusMutation,
  useGetAllUsersQuery,
  usePatchResetPasswordMutation,
} from "../../features/user-management/api/userAccountApi";
import { Person } from "@mui/icons-material";
import { useGetAllUserRolesQuery } from "../../features/user-management/api/userRoleApi";
import { useSelector } from "react-redux";
import PageHeaderFilterAdd from "../../components/PageHeaderFilterAdd";
import useSnackbar from "../../hooks/useSnackbar";
import useConfirm from "../../hooks/useConfirm";
import { handleCatchErrorMessage } from "../../utils/CustomFunctions";
import UserDrawer from "../../components/page-components/user-management/user-account/UserDrawer";

function UserAccount() {
  const [editMode, setEditMode] = useState(false);
  const [status, setStatus] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(null);
  const [roleFilter, setRoleFilter] = useState("");

  // Hooks
  const snackbar = useSnackbar();
  const selectedRowData = useSelector((state) => state.selectedRow.value);
  const confirm = useConfirm();

  // Disclosures
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();

  // Constants
  const tableHeads = ["Full ID Number", "Full Name", "Username", "Role Name"];
  const customOrderKeys = ["fullIdNo", "fullname", "username", "roleName"];
  const disableActions = ["edit", "archive", "resetPassword"];

  // RTK Query
  const { data, isFetching } = useGetAllUsersQuery({
    Search: search,
    Status: status,
    PageNumber: page + 1,
    PageSize: rowsPerPage,
    ...(roleFilter ? { UserRoleId: roleFilter } : {}),
  });
  const [patchUserStatus] = usePatchUserStatusMutation();
  const [patchResetPassword] = usePatchResetPasswordMutation();
  const { data: userRoleData } = useGetAllUserRolesQuery({
    Status: true,
    PageSize: 1000,
  });

  const onArchive = async () => {
    try {
      await confirm({
        children: (
          <>
            Are you sure you want to {status ? "archive" : "restore"}{" "}
            <span style={{ fontWeight: "bold", textTransform: "uppercase" }}>
              {selectedRowData?.username}
            </span>
            ?
          </>
        ),
        question: !status,
        callback: () => patchUserStatus(selectedRowData?.id).unwrap(),
      });

      snackbar({
        message: `User Account ${
          status ? "archived" : "restored"
        } successfully`,
        variant: "success",
      });
    } catch (error) {
      if (error?.isConfirmed) {
        snackbar({ message: handleCatchErrorMessage(error), variant: "error" });
      }
    }
  };

  const onReset = async () => {
    try {
      await confirm({
        children: (
          <>
            Are you sure you want to reset password for{" "}
            <span style={{ fontWeight: "bold", textTransform: "uppercase" }}>
              {selectedRowData?.username}
            </span>
            ?
          </>
        ),
        question: true,
        callback: () => patchResetPassword(selectedRowData?.id).unwrap(),
      });

      snackbar({ message: "Password reset successfully", variant: "success" });
    } catch (error) {
      if (error?.isConfirmed) {
        snackbar({ message: handleCatchErrorMessage(error), variant: "error" });
      }
    }
  };

  // Functions: Open & Close
  const handleAddOpen = () => {
    setEditMode(false);
    onDrawerOpen();
  };

  const handleEditOpen = () => {
    setEditMode(true);
    onDrawerOpen();
  };

  // useEffect: Pagination
  useEffect(() => {
    setCount(data?.totalCount);
  }, [data]);

  useEffect(() => {
    setPage(0);
  }, [search, status, rowsPerPage, roleFilter]);

  return (
    <>
      <Box className="commonPageLayout">
        {/* Page Header */}
        <PageHeaderFilterAdd
          pageTitle={
            <>
              User Account <Person />
            </>
          }
          onOpen={handleAddOpen}
          setSearch={setSearch}
          setStatus={setStatus}
          filterChoices={userRoleData?.userRoles || []}
          choiceLabel="roleName"
          choiceValue="id"
          setFilter={setRoleFilter}
        />

        {/* Main Table */}
        {isFetching ? (
          <CommonTableSkeleton evenLesserCompact />
        ) : (
          <CommonTable
            evenLesserCompact
            //Data Props
            mapData={data?.users}
            tableHeads={tableHeads}
            customOrderKeys={customOrderKeys}
            //Action Props
            onEdit={handleEditOpen}
            onArchive={onArchive}
            onResetPassword={onReset}
            disableActions={
              selectedRowData?.fullname === "Admin" && disableActions
            }
            //Pagination Props
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            count={count}
            //Other Props
            status={status}
          />
        )}
      </Box>

      {/* Drawer Form */}
      <UserDrawer
        open={isDrawerOpen}
        onClose={onDrawerClose}
        editMode={editMode}
      />
    </>
  );
}

export default UserAccount;
