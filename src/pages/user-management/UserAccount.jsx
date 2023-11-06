import {
  Autocomplete,
  Box,
  TextField,
  createFilterOptions,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import PageHeaderAdd from "../../components/PageHeaderAdd";
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
} from "../../features/user-management/api/userAccountApi";
import { useGetAllEmployeesQuery } from "../../features/user-management/api/sedarApi";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useGetAllUserRolesQuery } from "../../features/user-management/api/userRoleApi";
import ControlledAutocomplete from "../../components/ControlledAutocomplete";

function UserAccount() {
  const [drawerMode, setDrawerMode] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [status, setStatus] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

  // Constants
  const excludeKeysDisplay = [
    "id",
    "createdAt",
    "addedBy",
    "updatedAt",
    "modifiedBy",
    "isActive",
    "users",
    "password",
    "permission",
    "companyName",
    "departmentName",
    "locationName",
  ];

  const tableHeads = ["Full ID Number", "Full Name", "Username", "Role Name"];

  //React Hook Form
  const {
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    reset,
    control,
    getValues,
  } = useForm({
    resolver: yupResolver(userAccountSchema.schema),
    mode: "onChange",
    defaultValues: userAccountSchema.defaultValues,
  });

  //RTK Query
  const [postUser, { isLoading: isAddUserLoading }] = usePostUserMutation();
  const { data, isLoading } = useGetAllUsersQuery({
    Search: search,
    Status: status,
    PageNumber: page + 1,
    PageSize: rowsPerPage,
  });
  const [putUser, { isLoading: isEditUserLoading }] = usePutUserMutation();
  const [patchUserStatus, { isLoading: isArchiveUserLoading }] =
    usePatchUserStatusMutation();

  const { data: userRoleData } = useGetAllUserRolesQuery();
  const { data: sedarData = [], isLoading: isSedarLoading } =
    useGetAllEmployeesQuery();

  //Drawer Functions
  const onDrawerSubmit = async (data) => {
    const {
      userRoleId: { id },
      ...restData
    } = data;

    try {
      if (drawerMode === "add") {
        await postUser({
          ...restData,
          userRoleId: id,
        }).unwrap();
        setSnackbarMessage("User Account added successfully");
      } else if (drawerMode === "edit") {
        await putUser({
          ...restData,
          userRoleId: id,
        }).unwrap();
        setSnackbarMessage("User Account updated successfully");
      }

      onDrawerClose();
      reset();
      onSuccessOpen();
    } catch (error) {
      setSnackbarMessage(error.data.messages[0]);
      onErrorOpen();
    }
  };

  const onArchiveSubmit = async () => {
    try {
      await patchUserStatus(selectedId).unwrap();
      onArchiveClose();
      setSnackbarMessage(
        `User Account ${status ? "archived" : "restored"} successfully`
      );
      onSuccessOpen();
    } catch (error) {
      setSnackbarMessage(error.data.messages[0]);
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

    // Object.keys(editData).forEach((key) => {
    //   setValue(key, editData[key]);
    // });
    setValue("id", editData.id);
    setValue("fullIdNo", editData.fullIdNo);
    setValue("fullname", editData.fullname);
    setValue("username", editData.username);
    // setValue("password", editData.password);
    setValue(
      "userRoleId",
      userRoleData?.userRoles?.find(
        (item) => item.roleName === editData.roleName
      )
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

  //Misc Functions
  const filterOptions = createFilterOptions({
    matchFrom: "any",
    limit: 50,
  });

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
        pageTitle="User Account"
        onOpen={handleAddOpen}
        setSearch={setSearch}
        setStatus={setStatus}
      />
      {isLoading ? (
        <CommonTableSkeleton />
      ) : (
        <CommonTable
          mapData={data?.users}
          excludeKeysDisplay={excludeKeysDisplay}
          tableHeads={tableHeads}
          editable
          archivable
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
        drawerHeader={(drawerMode === "add" ? "Add" : "Edit") + " User Account"}
        onSubmit={handleSubmit(onDrawerSubmit)}
        disableSubmit={!isValid}
        isLoading={drawerMode === "add" ? isAddUserLoading : isEditUserLoading}
      >
        {/* <ControlledAutocomplete
          name={"fullIdNo"}
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          control={control}
          options={sedarData}
          loading={isSedarLoading}
          disableClearable
          filterOptions={filterOptions}
          getOptionLabel={(option) => option.general_info.full_id_number}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => (
            <TextField {...params} size="small" label="Employee ID" />
          )}
          onChange={(_, value) => {
            const generateUsername = (firstName, lastName) => {
              var part1 = firstName
                .split(" ")
                .map((i) => i.charAt(0))
                .join("")
                .toLowerCase();
              var part2 = lastName.replace(/\s/g, "").toLowerCase();
              return part1 + part2;
            };
            setValue()
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
            setValue(
              "password",
              `${generateUsername(
                value.general_info.first_name,
                value.general_info.last_name
              )}1234`
            );
          }}
        /> */}
        {drawerMode === "add" ? (
          <Autocomplete
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            options={sedarData}
            loading={isSedarLoading}
            disableClearable
            filterOptions={filterOptions}
            getOptionLabel={(option) => option.general_info.full_id_number}
            renderInput={(params) => (
              <TextField {...params} size="small" label="Employee ID" />
            )}
            onChange={(_, value) => {
              const generateUsername = (firstName, lastName) => {
                var part1 = firstName
                  .split(" ")
                  .map((i) => i.charAt(0))
                  .join("")
                  .toLowerCase();
                var part2 = lastName.replace(/\s/g, "").toLowerCase();
                return part1 + part2;
              };
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

        {/* <Controller
          control={control}
          name={"password"}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <TextField
              size="small"
              label="Password"
              autoComplete="off"
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              inputRef={ref}
              type={showPassword ? "string" : "password"}
              helperText={errors?.password?.message}
              error={errors?.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => {
                        setShowPassword(!showPassword);
                      }}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        /> */}

        <ControlledAutocomplete
          name={"userRoleId"}
          control={control}
          options={userRoleData?.userRoles}
          getOptionLabel={(option) => option.roleName}
          disableClearable
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              label="User Role"
              required
              helperText={errors?.userRoleId?.message}
              error={errors?.userRoleId}
            />
          )}
        />
      </CommonDrawer>
      <CommonDialog
        open={isArchiveOpen}
        onClose={onArchiveClose}
        onYes={onArchiveSubmit}
      >
        Are you sure you want to {status ? "archive" : "restore"}?
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
  );
}

export default UserAccount;
