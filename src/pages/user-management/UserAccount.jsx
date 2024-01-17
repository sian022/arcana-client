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
  usePatchResetPasswordMutation,
} from "../../features/user-management/api/userAccountApi";
import { useGetAllEmployeesQuery } from "../../features/user-management/api/sedarApi";
import { Person, Visibility, VisibilityOff } from "@mui/icons-material";
import { useGetAllUserRolesQuery } from "../../features/user-management/api/userRoleApi";
import ControlledAutocomplete from "../../components/ControlledAutocomplete";
import { useDispatch, useSelector } from "react-redux";
import {
  clusterApi,
  useGetAllClustersQuery,
} from "../../features/setup/api/clusterApi";
import ControlledAutocompleteMultiple from "../../components/ControlledAutocompleteMultiple";
import PageHeaderFilterAdd from "../../components/PageHeaderFilterAdd";

function UserAccount() {
  const [drawerMode, setDrawerMode] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [status, setStatus] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const dispatch = useDispatch();
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
    isOpen: isResetOpen,
    onOpen: onResetOpen,
    onClose: onResetClose,
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
    "cluster",
    "clusterId",
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
  const { data, isLoading, isFetching } = useGetAllUsersQuery({
    Search: search,
    Status: status,
    PageNumber: page + 1,
    PageSize: rowsPerPage,
    ...(roleFilter ? { UserRoleId: roleFilter } : {}),
  });
  const [putUser, { isLoading: isEditUserLoading }] = usePutUserMutation();
  const [patchUserStatus, { isLoading: isArchiveUserLoading }] =
    usePatchUserStatusMutation();
  const [patchResetPassword, { isLoading: isResetLoading }] =
    usePatchResetPasswordMutation();

  const { data: userRoleData } = useGetAllUserRolesQuery({ Status: true });
  const { data: sedarData = [], isLoading: isSedarLoading } =
    useGetAllEmployeesQuery();
  const { data: clusterData, isLoading: isClusterLoading } =
    useGetAllClustersQuery({ Status: true });

  //Drawer Functions
  const onDrawerSubmit = async (data) => {
    const {
      userRoleId: { id },
      // clusters,
      clusterId,
      ...restData
    } = data;

    try {
      if (drawerMode === "add") {
        await postUser({
          ...restData,
          userRoleId: id,
          clusterId: clusterId?.id,
          // clusters: clusters?.map((item) => ({
          //   clusterId: item.id,
          // })),
        }).unwrap();
        setSnackbarMessage("User Account added successfully");
      } else if (drawerMode === "edit") {
        await putUser({
          ...restData,
          userRoleId: id,
          clusterId: clusterId?.id,
          // clusters: clusters?.map((item) => ({
          //   clusterId: item.clusterId || item.id,
          // })),
        }).unwrap();
        setSnackbarMessage("User Account updated successfully");
      }

      onDrawerClose();
      reset();
      onSuccessOpen();
      dispatch(clusterApi.util.invalidateTags(["Cluster"]));
    } catch (error) {
      if (error?.data?.error?.message) {
        setSnackbarMessage(error?.data?.error?.message);
      } else {
        setSnackbarMessage(
          `Error ${drawerMode === "add" ? "adding" : "updating"} user account`
        );
      }

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
      console.log(error);
      if (error?.data?.error?.message) {
        setSnackbarMessage(error?.data?.error?.message);
      } else {
        setSnackbarMessage("Error archiving user account");
      }

      onErrorOpen();
    }
  };

  const handleAddOpen = () => {
    setDrawerMode("add");
    onDrawerOpen();
  };

  const handleEditOpen = (editData) => {
    console.log(editData);
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
    setValue(
      "clusterId",
      clusterData?.cluster?.find((item) => item.cluster === editData.cluster)
    );
    // setValue(
    //   "clusters",
    //   editData.clusters?.map((item) => item)
    // );
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

  const onResetSubmit = async () => {
    try {
      await patchResetPassword(selectedRowData?.id).unwrap();
      setSnackbarMessage("Password reset successfully");
      onSuccessOpen();
    } catch (error) {
      if (error?.data?.error?.message) {
        setSnackbarMessage(error?.data?.error?.message);
      } else {
        setSnackbarMessage("Error resetting password");
      }

      onErrorOpen();
    }

    onResetClose();
  };

  //UseEffect
  useEffect(() => {
    setCount(data?.totalCount);
  }, [data]);

  useEffect(() => {
    setPage(0);
  }, [search, status, rowsPerPage, roleFilter]);

  useEffect(() => {
    if (watch("userRoleId")?.roleName !== "CDO") {
      // setValue("clusters", []);
      setValue("clusterId", null);
    }
  }, [watch("userRoleId")]);

  return (
    <Box className="commonPageLayout">
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
      {isFetching ? (
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
          onResetPassword={onResetOpen}
          // onViewCluster={true}
          // disableActions={
          //   selectedRowData?.roleName !== "CDO" && ["viewCluster"]
          // }
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
        disableSubmit={
          watch("userRoleId")?.roleName === "CDO"
            ? !isValid || !watch("clusterId")
            : !isValid
          // watch("userRoleId")?.roleName === "CDO"
          //   ? !isValid || watch("clusters")?.length === 0
          //   : !isValid
        }
        isLoading={drawerMode === "add" ? isAddUserLoading : isEditUserLoading}
      >
        {drawerMode === "add" ? (
          <Autocomplete
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            options={sedarData}
            loading={isSedarLoading}
            disableClearable
            filterOptions={filterOptions}
            getOptionLabel={(option) =>
              option.general_info.full_id_number_full_name
            }
            // getOptionDisabled={(option) =>
            //   data?.users?.some(
            //     (item) => item?.itemId?.itemCode === option.itemCode
            //   )
            // }
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

        {watch("userRoleId")?.roleName === "CDO" && (
          <ControlledAutocompleteMultiple
            name={"clusterId"}
            // multiple
            // filterSelectedOptions
            control={control}
            options={clusterData?.cluster || []}
            getOptionLabel={(option) => option.cluster}
            disableClearable
            // getOptionDisabled={(option) => {
            //   const clusters = watch("clusters");
            //   const isClusterRepeating = Array.isArray(clusters)
            //     ? clusters.some((item) => item.cluster === option.cluster)
            //     : false;

            //   return isClusterRepeating;
            // }}
            // getOptionDisabled={(option) => option?.userId !== null}
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

      <CommonDialog
        open={isArchiveOpen}
        onClose={onArchiveClose}
        onYes={onArchiveSubmit}
        isLoading={isArchiveUserLoading}
        noIcon={!status}
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
        noIcon
      >
        Are you sure you want to reset password for{" "}
        <span style={{ fontWeight: "bold", textTransform: "uppercase" }}>
          {selectedRowData?.username}
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
  );
}

export default UserAccount;
