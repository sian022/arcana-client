import { Controller } from "react-hook-form";
import CommonDrawer from "../../../CommonDrawer";
import useSnackbar from "../../../../hooks/useSnackbar";
import {
  Autocomplete,
  InputAdornment,
  TextField,
  createFilterOptions,
} from "@mui/material";
import ControlledAutocompleteMultiple from "../../../ControlledAutocompleteMultiple";
import ControlledAutocomplete from "../../../ControlledAutocomplete";
import { PatternFormat } from "react-number-format";
import { useGetAllUserRolesQuery } from "../../../../features/user-management/api/userRoleApi";
import { useGetAllEmployeesQuery } from "../../../../features/user-management/api/sedarApi";
import { useGetAllClustersQuery } from "../../../../features/setup/api/clusterApi";
import { useSelector } from "react-redux";
import useUserForm from "./useUserForm.hooks";

const UserDrawer = ({ ...props }) => {
  const { editMode, onClose, open } = props;

  // States
  const selectedRowData = useSelector((state) => state.selectedRow.value);

  // Hooks
  const snackbar = useSnackbar();

  // RTK Query: Autocomplete Datas
  const { data: userRoleData } = useGetAllUserRolesQuery({
    Status: true,
    PageSize: 1000,
  });
  const { data: sedarData = [], isLoading: isSedarLoading } =
    useGetAllEmployeesQuery();
  const { data: clusterData, isLoading: isClusterLoading } =
    useGetAllClustersQuery({ Status: true, PageSize: 1000 });

  // Form Hook
  const {
    handleSubmit,
    control,
    errors,
    isValid,
    watch,
    onSubmit,
    setValue,
    isAddUserLoading,
    isEditUserLoading,
  } = useUserForm({
    editMode,
    selectedRowData,
    userRoleData,
    clusterData,
    onClose,
    snackbar,
    open,
  });

  const filterOptions = createFilterOptions({
    matchFrom: "any",
    limit: 50,
  });

  return (
    <CommonDrawer
      {...props}
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
  );
};

export default UserDrawer;
