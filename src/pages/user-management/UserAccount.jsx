import {
  Autocomplete,
  Box,
  InputAdornment,
  TextField,
  createFilterOptions,
} from "@mui/material";
import { useEffect, useState } from "react";
import CommonTable from "../../components/CommonTable";
import CommonDrawer from "../../components/CommonDrawer";
import useDisclosure from "../../hooks/useDisclosure";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userAccountSchema } from "../../schema/schema";
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
import { useSelector } from "react-redux";
import { useGetAllClustersQuery } from "../../features/setup/api/clusterApi";
import ControlledAutocompleteMultiple from "../../components/ControlledAutocompleteMultiple";
import PageHeaderFilterAdd from "../../components/PageHeaderFilterAdd";
import useSnackbar from "../../hooks/useSnackbar";
import useConfirm from "../../hooks/useConfirm";
import { handleCatchErrorMessage } from "../../utils/CustomFunctions";
import { PatternFormat } from "react-number-format";

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

  // React Hook Form
  const {
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    reset,
    control,
    clearErrors,
  } = useForm({
    resolver: yupResolver(userAccountSchema.schema),
    mode: "onChange",
    defaultValues: userAccountSchema.defaultValues,
  });

  // React Hook Form: Watch
  const watchUserRole = watch("userRoleId");

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
  const [patchUserStatus] = usePatchUserStatusMutation();

  // RTK Query: Others
  const [patchResetPassword] = usePatchResetPasswordMutation();

  // RTK Query: Autocomplete Datas
  const { data: userRoleData } = useGetAllUserRolesQuery({ Status: true });
  const { data: sedarData = [], isLoading: isSedarLoading } =
    useGetAllEmployeesQuery();
  const { data: clusterData, isLoading: isClusterLoading } =
    useGetAllClustersQuery({ Status: true });

  // Functions: Submit
  const onSubmit = async (data) => {
    const {
      userRoleId: { id },
      clusterId,
      ...restData
    } = data;

    try {
      if (!editMode) {
        await postUser({
          ...restData,
          userRoleId: id,
          clusterId: clusterId?.id,
        }).unwrap();

        snackbar({
          message: "User Account added successfully",
          variant: "success",
        });
      } else if (editMode) {
        await putUser({
          ...restData,
          userRoleId: id,
          clusterId: clusterId?.id,
        }).unwrap();
        snackbar({
          message: "User Account updated successfully",
          variant: "success",
        });
      }

      onDrawerClose();
      reset();
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

  const handleEditOpen = (editData) => {
    setEditMode(true);
    onDrawerOpen();
    clearErrors();

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
    setValue("mobileNumber", editData.mobileNumber);
  };

  const handleDrawerClose = () => {
    reset();
    onDrawerClose();
  };

  // Other Functions
  const filterOptions = createFilterOptions({
    matchFrom: "any",
    limit: 50,
  });

  // useEffect: Pagination
  useEffect(() => {
    setCount(data?.totalCount);
  }, [data]);

  useEffect(() => {
    setPage(0);
  }, [search, status, rowsPerPage, roleFilter]);

  // useEffect: Others
  useEffect(() => {
    if (watchUserRole?.roleName !== "CDO") {
      setValue("clusterId", null);
    }
  }, [watchUserRole, setValue]);

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
      <CommonDrawer
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        drawerHeader={(!editMode ? "Add" : "Edit") + " User Account"}
        onSubmit={handleSubmit(onSubmit)}
        disableSubmit={
          watch("userRoleId")?.roleName === "CDO"
            ? !isValid || !watch("clusterId")
            : !isValid
        }
        isLoading={!editMode ? isAddUserLoading : isEditUserLoading}
      >
        {!editMode ? (
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

        <Controller
          control={control}
          name={"username"}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <TextField
              size="small"
              label="Username"
              disabled={editMode}
              autoComplete="off"
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              inputRef={ref}
            />
          )}
        />

        <Controller
          control={control}
          name="mobileNumber"
          render={({ field: { onChange, onBlur, value, ref } }) => {
            const formattedValue = value?.replace(/-/g, "");
            // let format = "###-###-####";
            let format;

            if (formattedValue.length <= 3) {
              format = "####";
            } else if (formattedValue.length <= 6) {
              format = "###-####";
            } else if (formattedValue.length <= 10) {
              format = "###-###-####";
            }

            return (
              <PatternFormat
                format={format}
                label="Phone Number"
                type="text"
                size="small"
                customInput={TextField}
                autoComplete="off"
                allowNegative={false}
                decimalScale={0}
                valueIsNumericString
                inputRef={ref}
                onValueChange={(e) => {
                  onChange(e.value);
                }}
                onBlur={onBlur}
                value={value || ""}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">+63</InputAdornment>
                  ),
                }}
                helperText={errors?.mobileNumber?.message}
                error={!!errors?.mobileNumber}
              />
            );
          }}
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
            isLoading={isClusterLoading}
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
    </>
  );
}

export default UserAccount;
