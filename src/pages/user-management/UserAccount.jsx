import {
  Autocomplete,
  Box,
  TextField,
  createFilterOptions,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CommonTable from "../../components/CommonTable";
import CommonDrawer from "../../components/CommonDrawer";
import useDisclosure from "../../hooks/useDisclosure";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userAccountSchema } from "../../schema/schema";
import CommonDialog from "../../components/CommonDialog";
import SuccessSnackbar from "../../components/SuccessSnackbar";
import ErrorSnackbar from "../../components/ErrorSnackbar";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import {
  usePatchUserStatusMutation,
  useGetAllUsersQuery,
  usePostUserMutation,
  usePutUserMutation,
  usePatchResetPasswordMutation,
} from "../../features/user-management/api/userAccountApi";
import { useGetAllEmployeesQuery } from "../../features/user-management/api/sedarApi";
import { Person } from "@mui/icons-material";
import { useGetAllUserRolesQuery } from "../../features/user-management/api/userRoleApi";
import ControlledAutocomplete from "../../components/ControlledAutocomplete";
import { useDispatch, useSelector } from "react-redux";
import {
  clusterApi,
  useGetAllClustersQuery,
} from "../../features/setup/api/clusterApi";
import ControlledAutocompleteMultiple from "../../components/ControlledAutocompleteMultiple";
import PageHeaderFilterAdd from "../../components/PageHeaderFilterAdd";
import useSnackbar from "../../hooks/useSnackbar";
import { handleCatchErrorMessage } from "../../utils/CustomFunctions";

function UserAccount() {
  const [drawerMode, setDrawerMode] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [status, setStatus] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(null);
  const [roleFilter, setRoleFilter] = useState("");

  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
  const selectedRowData = useSelector((state) => state.selectedRow.value);

  // Disclosures
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
    isOpen: isResetOpen,
    onOpen: onResetOpen,
    onClose: onResetClose,
  } = useDisclosure();
  // Disclosures End

  // Constants
  const tableHeads = ["Full ID Number", "Full Name", "Username", "Role Name"];
  const customOrderKeys = ["fullIdNo", "fullname", "username", "roleName"];
  const disableActions = ["edit", "archive", "resetPassword"];
  // Constants End

  // React Hook Form
  const {
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    reset,
    control,
  } = useForm({
    resolver: yupResolver(userAccountSchema.schema),
    mode: "onChange",
    defaultValues: userAccountSchema.defaultValues,
  });
  // React Hook Form End

  // RTK Query: Main CRUD
  const [postUser, { isLoading: isAddUserLoading }] = usePostUserMutation();
  const { data, isFetching } = useGetAllUsersQuery({
    Search: search,
    Status: status,
    PageNumber: page + 1,
    PageSize: rowsPerPage,
    ...(roleFilter ? { UserRoleId: roleFilter } : {}),
  });
  const [putUser, { isLoading: isEditUserLoading }] = usePutUserMutation();
  const [patchUserStatus, { isLoading: isArchiveUserLoading }] =
    usePatchUserStatusMutation();
  // RTK Query: Main CRUD End

  // RTK Query: Others
  const [patchResetPassword, { isLoading: isResetLoading }] =
    usePatchResetPasswordMutation();
  // RTK Query: Others End

  // RTK Query: Autocomplete Datas
  const { data: userRoleData } = useGetAllUserRolesQuery({ Status: true });
  const { data: sedarData = [], isLoading: isSedarLoading } =
    useGetAllEmployeesQuery();
  const { data: clusterData, isLoading: isClusterLoading } =
    useGetAllClustersQuery({ Status: true });
  // RTK Query: Autocomplete Datas End

  // Functions: Submit
  const onDrawerSubmit = async (data) => {
    const {
      userRoleId: { id },
      clusterId,
      ...restData
    } = data;

    try {
      if (drawerMode === "add") {
        await postUser({
          ...restData,
          userRoleId: id,
          clusterId: clusterId?.id,
        }).unwrap();

        showSnackbar("User Account added successfully", "success");
      } else if (drawerMode === "edit") {
        await putUser({
          ...restData,
          userRoleId: id,
          clusterId: clusterId?.id,
        }).unwrap();
        showSnackbar("User Account updated successfully", "success");
      }

      onDrawerClose();
      reset();
      dispatch(clusterApi.util.invalidateTags(["Cluster"]));
    } catch (error) {
      console.log(error);
      showSnackbar(handleCatchErrorMessage(error), "error");
    }
  };

  const onArchiveSubmit = async () => {
    try {
      await patchUserStatus(selectedId).unwrap();
      onArchiveClose();
      showSnackbar(
        `User Account ${status ? "archived" : "restored"} successfully`,
        "success"
      );
    } catch (error) {
      console.log(error);
      showSnackbar(handleCatchErrorMessage(error), "error");
    }
  };

  const onResetSubmit = async () => {
    try {
      await patchResetPassword(selectedRowData?.id).unwrap();
      showSnackbar("Password reset successfully", "success");
    } catch (error) {
      showSnackbar(handleCatchErrorMessage(error), "error");
    }
    onResetClose();
  };
  // Functions: Submit End

  // Functions: Open & Close
  const handleAddOpen = () => {
    setDrawerMode("add");
    onDrawerOpen();
  };

  const handleEditOpen = (editData) => {
    setDrawerMode("edit");
    onDrawerOpen();
    setValue("id", editData.id);
    setValue("fullIdNo", editData.fullIdNo);
    setValue("fullname", editData.fullname);
    setValue("username", editData.username);
    setValue(
      "userRoleId",
      userRoleData?.userRoles?.find(
        (item) => item.roleName === editData.roleName
      )
    );
    setValue(
      "clusterId",
      clusterData?.cluster?.find((item) => item.cluster === editData.cluster)
    );
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
  // Functions: Open & Close End

  // Other Functions
  const filterOptions = createFilterOptions({
    matchFrom: "any",
    limit: 50,
  });
  // Other Functions End

  // useEffect
  useEffect(() => {
    setCount(data?.totalCount);
  }, [data]);

  useEffect(() => {
    setPage(0);
  }, [search, status, rowsPerPage, roleFilter]);

  useEffect(() => {
    if (watch("userRoleId")?.roleName !== "CDO") {
      setValue("clusterId", null);
    }
  }, [watch("userRoleId")]);
  // useEffect End

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
        {/* Page Header End*/}

        {/* Main Table */}
        {isFetching ? (
          <CommonTableSkeleton />
        ) : (
          <CommonTable
            //Data Props
            mapData={data?.users}
            tableHeads={tableHeads}
            customOrderKeys={customOrderKeys}
            //Data Props End

            //Action Props
            includeActions
            onEdit={handleEditOpen}
            onArchive={handleArchiveOpen}
            onResetPassword={onResetOpen}
            disableActions={
              selectedRowData?.fullname === "Admin" && disableActions
            }
            //Action Props End

            //Pagination Props
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            count={count}
            //Pagination Props End

            //Other Props
            status={status}
            //Other Props End
          />
        )}
        {/* Main Table End */}
      </Box>

      {/* Drawer Form */}
      <CommonDrawer
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        drawerHeader={(drawerMode === "add" ? "Add" : "Edit") + " User Account"}
        onSubmit={handleSubmit(onDrawerSubmit)}
        disableSubmit={
          watch("userRoleId")?.roleName === "CDO"
            ? !isValid || !watch("clusterId")
            : !isValid
        }
        isLoading={drawerMode === "add" ? isAddUserLoading : isEditUserLoading}
      >
        {drawerMode === "add" ? (
          <Autocomplete
            clearOnBlur
            options={sedarData}
            loading={isSedarLoading}
            disableClearable
            filterOptions={filterOptions}
            getOptionLabel={(option) =>
              option.general_info.full_id_number_full_name
            }
            renderInput={(params) => (
              <TextField {...params} size="small" label="Employee ID" />
            )}
            onChange={(_, value) => {
              //Auto generate username based on first name and last name
              const generateUsername = (firstName, lastName) => {
                var part1 = firstName
                  .split(" ")
                  .map((i) => i.charAt(0))
                  .join("")
                  .toLowerCase();
                var part2 = lastName.replace(/\s/g, "").toLowerCase();
                return part1 + part2;
              };

              //Autofill values based on selected employee data
              setValue("fullIdNo", value.general_info.full_id_number);
              setValue("fullname", value.general_info.full_name);
              setValue("location", value.unit_info.location_name);
              setValue("department", value.unit_info.department_name);
              setValue("company", value.unit_info.company_name);
              setValue(
                "username",
                generateUsername(
                  value.general_info.first_name,
                  value.general_info.last_name
                )
              );

              //Initial password is same as the username
              setValue(
                "password",
                generateUsername(
                  value.general_info.first_name,
                  value.general_info.last_name
                )
              );
            }}
          />
        ) : (
          //For viewing only in edit mode
          <TextField
            label="Employee ID"
            size="small"
            disabled
            value={watch("fullIdNo")}
          />
        )}
        <Controller
          control={control}
          name={"fullname"}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <TextField
              disabled
              size="small"
              label="Full Name"
              autoComplete="off"
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              inputRef={ref}
            />
          )}
        />

        {/* FISTO Account Title */}
        {/* <Controller
         control={control}
         name={"location"}
         render={({ field: { onChange, onBlur, value, ref } }) => (
           <TextField
             size="small"
             label="Location"
             autoComplete="off"
             onChange={onChange}
             onBlur={onBlur}
             value={value}
             inputRef={ref}
             disabled
           />
         )}
       />

       <Controller
         control={control}
         name={"department"}
         render={({ field: { onChange, onBlur, value, ref } }) => (
           <TextField
             size="small"
             label="Department"
             autoComplete="off"
             onChange={onChange}
             onBlur={onBlur}
             value={value}
             inputRef={ref}
             disabled
           />
         )}
       />

       <Controller
         control={control}
         name={"company"}
         render={({ field: { onChange, onBlur, value, ref } }) => (
           <TextField
             size="small"
             label="Company"
             autoComplete="off"
             onChange={onChange}
             onBlur={onBlur}
             value={value}
             inputRef={ref}
             disabled
           />
         )}
       /> */}
        {/* FISTO Account Title End*/}

        <Controller
          control={control}
          name={"username"}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <TextField
              size="small"
              label="Username"
              disabled={drawerMode === "edit"}
              autoComplete="off"
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              inputRef={ref}
            />
          )}
        />

        <ControlledAutocomplete
          name={"userRoleId"}
          control={control}
          options={userRoleData?.userRoles || []}
          getOptionLabel={(option) => option.roleName}
          disableClearable
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              label="User Role"
              helperText={errors?.userRoleId?.message}
              error={errors?.userRoleId}
            />
          )}
        />

        {/* If role is CDO, require cluster selection */}
        {watch("userRoleId")?.roleName === "CDO" && (
          <ControlledAutocompleteMultiple
            name={"clusterId"}
            control={control}
            options={clusterData?.cluster || []}
            getOptionLabel={(option) => option.cluster}
            disableClearable
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                label="Cluster"
                helperText={errors?.clusterId?.message}
                error={errors?.clusterId}
              />
            )}
          />
        )}
      </CommonDrawer>
      {/* Drawer Form End */}

      <CommonDialog
        open={isArchiveOpen}
        onClose={onArchiveClose}
        onYes={onArchiveSubmit}
        isLoading={isArchiveUserLoading}
        question={!status}
      >
        Are you sure you want to {status ? "archive" : "restore"}{" "}
        <span style={{ fontWeight: "bold", textTransform: "uppercase" }}>
          {selectedRowData?.username}
        </span>
        ?
      </CommonDialog>

      <CommonDialog
        open={isResetOpen}
        onClose={onResetClose}
        onYes={onResetSubmit}
        isLoading={isResetLoading}
        question
      >
        Are you sure you want to reset password for{" "}
        <span style={{ fontWeight: "bold", textTransform: "uppercase" }}>
          {selectedRowData?.username}
        </span>
        ?
      </CommonDialog>
    </>
  );
}

export default UserAccount;
