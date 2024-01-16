import {
  Autocomplete,
  Box,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import PageHeaderAdd from "../../components/PageHeaderAdd";
import CommonTable from "../../components/CommonTable";
import CommonDrawer from "../../components/CommonDrawer";
import useDisclosure from "../../hooks/useDisclosure";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { approversSchema, companySchema } from "../../schema/schema";
import CommonDialog from "../../components/CommonDialog";
import SuccessSnackbar from "../../components/SuccessSnackbar";
import ErrorSnackbar from "../../components/ErrorSnackbar";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import { useSelector } from "react-redux";
import PageHeaderSearch from "../../components/PageHeaderSearch";
import ControlledAutocomplete from "../../components/ControlledAutocomplete";
import {
  Cancel,
  HowToVote,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import {
  useAddApproversPerModuleMutation,
  useGetAllApproversQuery,
  useGetApproversPerModuleQuery,
  usePutUpdateApproversPerModuleMutation,
} from "../../features/user-management/api/approverApi";
import SecondaryButton from "../../components/SecondaryButton";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { navigationData } from "../../navigation/navigationData";

function Approver() {
  const [drawerMode, setDrawerMode] = useState("add");
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

  // Constants
  const excludeKeysDisplay = [
    "approvers",
    // "id",
    // "createdAt",
    // "addedBy",
    // "updatedAt",
    // "modifiedBy",
    // "isActive",
    // "users",
  ];

  // const tableMap = [
  //   {
  //     moduleName: "Freebie Approval",
  //   },
  //   {
  //     moduleName: "Registration Approval",
  //   },
  //   {
  //     moduleName: "Listing Fee Approval",
  //   },
  //   {
  //     moduleName: "Sp. Discount Approval",
  //   },
  // ];

  const approvalItem = navigationData.find((item) => item.name === "Approval");

  //React Hook Form
  const {
    handleSubmit,
    formState: { errors, isValid },
    register,
    setValue,
    reset,
    control,
    watch,
    getValues,
  } = useForm({
    resolver: yupResolver(approversSchema.schema),
    mode: "onChange",
    defaultValues: approversSchema.defaultValues,
  });

  const { fields, append, remove, swap } = useFieldArray({
    control,
    name: "approvers",
  });

  const [parent] = useAutoAnimate();

  //RTK Query
  const { data, isLoading, isFetching } = useGetAllApproversQuery();

  const [addApproversPerModule, { isLoading: isAddApproversLoading }] =
    useAddApproversPerModuleMutation();
  const {
    data: approversPerModuleData,
    isLoading: isApproversPerModuleLoading,
    isFetching: isApproversPerModuleFetching,
  } = useGetApproversPerModuleQuery();
  const [putUpdateApproversPerModule, { isLoading: isUpdateApproversLoading }] =
    usePutUpdateApproversPerModuleMutation();

  // const [postApprover, { isLoading: isAddLoading }] = usePostApproverMutation();
  // const { data, isLoading, isFetching } = useGetAllCompaniesQuery({
  //   Search: search,
  //   Status: status,
  //   PageNumber: page + 1,
  //   PageSize: rowsPerPage,
  // });
  // const [putApprover, { isLoading: isUpdateLoading }] =
  //   usePutApproverMutation();
  // const [patchApproverStatus, { isLoading: isArchiveLoading }] =
  //   usePatchApproverStatusMutation();

  //Drawer Functions
  const onDrawerSubmit = async (data) => {
    const { moduleName, ...restData } = data;
    try {
      if (drawerMode === "add") {
        await addApproversPerModule({
          moduleName: moduleName.name,
          approvers: data.approvers.map((approver) => ({
            userId: approver.userId.userId,
            // moduleName: approver.moduleName,
            level: approver.level,
          })),
        }).unwrap();
        setSnackbarMessage("Approvers added successfully");
      } else if (drawerMode === "edit") {
        await putUpdateApproversPerModule({
          moduleName: moduleName.name,
          approvers: restData.approvers.map((approver) => ({
            userId: approver.userId.userId,
            level: approver.level,
          })),
          // ...restData,
        }).unwrap();
        setSnackbarMessage("Approver updated successfully");
      }

      onDrawerClose();
      reset();
      onSuccessOpen();
    } catch (error) {
      if (error?.data?.error?.message) {
        setSnackbarMessage(error?.data?.error?.message);
      } else {
        setSnackbarMessage(
          `Error ${drawerMode === "add" ? "adding" : "updating"} approver`
        );
      }
      onErrorOpen();
    }
  };

  const onArchiveSubmit = async () => {
    try {
      await patchApproverStatus(selectedId).unwrap();
      onArchiveClose();
      setSnackbarMessage(
        `Approver ${status ? "archived" : "restored"} successfully`
      );
      onSuccessOpen();
    } catch (error) {
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

  const handleEditOpen = () => {
    setDrawerMode("edit");
    onDrawerOpen();
  };

  const handleDrawerClose = () => {
    reset();
    onDrawerClose();
    setSelectedId("");
  };

  const handleApproverError = () => {
    if (fields.length === 1) {
      setSnackbarMessage("Must have at least 1 approver");
    }

    onErrorOpen();
  };

  useEffect(() => {
    setPage(0);
  }, [search, status, rowsPerPage]);

  useEffect(() => {
    // if(!watch("approvers")?.[0]?.moduleName){}
    if (isDrawerOpen) {
      setValue("approvers[0].moduleName", selectedRowData?.moduleName);
    }
  }, [isDrawerOpen]);

  useEffect(() => {
    if (isDrawerOpen && drawerMode === "edit") {
      const foundModule = approvalItem?.sub?.find(
        (item) => item?.name === selectedRowData?.moduleName
      );
      setValue("moduleName", foundModule);
      // selectedRowData?.approvers?.forEach((item) => {
      //   append({
      //     // userId: item?.userId,
      //     userId: data?.find((user) => user.userId === item.userId),
      //     moduleName: item?.moduleName,
      //     level: item?.level,
      //   });
      // });
      const editFields = selectedRowData?.approvers?.map((item, index) => ({
        // userId: item?.userId,
        userId: data?.find((user) => user.userId === item.userId),
        // moduleName:
        // level: item?.level,
        level: index + 1,
      }));

      setValue("approvers", editFields);
    }
  }, [isDrawerOpen]);

  return (
    <Box className="commonPageLayout">
      {/* <PageHeaderSearch
        pageTitle="Approver"
        onOpen={handleAddOpen}
        setSearch={setSearch}
        setStatus={setStatus}
      /> */}
      <PageHeaderAdd
        pageTitle={
          <>
            Approver <HowToVote />
          </>
        }
        onOpen={handleAddOpen}
        setSearch={setSearch}
        setStatus={setStatus}
      />
      {isApproversPerModuleFetching ? (
        <CommonTableSkeleton />
      ) : (
        <CommonTable
          mapData={approversPerModuleData}
          excludeKeysDisplay={excludeKeysDisplay}
          editable
          onManageApprovers={handleEditOpen}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          count={approversPerModuleData?.length}
          status={status}
        />
      )}

      <CommonDrawer
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        drawerHeader={
          drawerMode === "edit"
            ? `Approver - ${selectedRowData?.moduleName}`
            : "Add Approvers"
        }
        onSubmit={handleSubmit(onDrawerSubmit)}
        disableSubmit={!isValid}
        width="600px"
        isLoading={
          drawerMode === "add"
            ? isAddApproversLoading
            : isUpdateApproversLoading
        }
      >
        <Typography sx={{ fontWeight: "bold", fontSize: "20px" }}>
          Module Name
        </Typography>
        <ControlledAutocomplete
          name={"moduleName"}
          control={control}
          options={approvalItem?.sub || []}
          getOptionLabel={(option) => option.name || ""}
          getOptionDisabled={(option) => {
            return approversPerModuleData.some(
              (item) => item?.moduleName === option.name
            );
          }}
          disableClearable
          loading={isLoading}
          isOptionEqualToValue={(option, value) => true}
          renderInput={(params) => (
            <TextField
              {...params}
              size="small"
              label="Module Name"
              helperText={errors?.userId?.message}
              error={errors?.userId}
            />
          )}
        />

        <Box
          sx={{ display: "flex", flexDirection: "column", gap: "10px" }}
          ref={parent}
        >
          <Typography sx={{ fontWeight: "bold", fontSize: "20px" }}>
            List of Approvers
          </Typography>
          {fields.map((item, index) => (
            <Box
              key={item.id}
              sx={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                width: "100%",
              }}
            >
              <ControlledAutocomplete
                name={`approvers[${index}].userId`}
                control={control}
                options={data || []}
                getOptionLabel={(option) => option.fullname || ""}
                getOptionDisabled={(option) => {
                  const approvers = watch("approvers");
                  return approvers.some(
                    (item) => item?.userId?.userId === option.userId
                  );
                }}
                sx={{ flex: 1 }}
                disableClearable
                disabled={!watch("moduleName")}
                loading={isLoading}
                isOptionEqualToValue={(option, value) => true}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    label="Approver Name"
                    helperText={errors?.userId?.message}
                    error={errors?.userId}
                  />
                )}
              />

              <IconButton
                sx={{ color: "secondary.main" }}
                onClick={() => {
                  setValue(`approvers[${index}].level`, index);
                  setValue(`approvers[${index - 1}].level`, index + 1);
                  swap(index, index - 1);
                }}
                disabled={index === 0}
              >
                <KeyboardArrowUp sx={{ fontSize: "30px" }} />
              </IconButton>

              <IconButton
                sx={{ color: "secondary.main" }}
                onClick={() => {
                  setValue(`approvers[${index}].level`, index + 2);
                  setValue(`approvers[${index + 1}].level`, index + 1);
                  swap(index, index + 1);
                }}
                disabled={index === fields.length - 1}
              >
                <KeyboardArrowDown sx={{ fontSize: "30px" }} />
              </IconButton>

              <IconButton
                sx={{ color: "error.main" }}
                onClick={() => {
                  fields.length <= 1
                    ? handleApproverError()
                    : // : remove(fields[index]);
                      remove(index);
                }}
              >
                <Cancel sx={{ fontSize: "30px" }} />
              </IconButton>
            </Box>
          ))}
        </Box>

        <SecondaryButton
          sx={{ width: "150px" }}
          onClick={() => {
            // fields.length < 5
            //   ? append({ itemId: null, unitCost: null })
            //   : handleListingFeeError();
            append({
              userId: null,
              // moduleName: "",
              moduleName: selectedRowData?.moduleName,
              level: fields.length + 1,
            });
          }}
          disabled={
            !watch("approvers")[watch("approvers")?.length - 1]?.userId ||
            !watch("moduleName")
          }
        >
          Add Approver
        </SecondaryButton>
      </CommonDrawer>
      <CommonDialog
        open={isArchiveOpen}
        onClose={onArchiveClose}
        onYes={onArchiveSubmit}
        // isLoading={isArchiveLoading}
        noIcon={!status}
      >
        Are you sure you want to {status ? "archive" : "restore"}{" "}
        <span style={{ fontWeight: "bold", textTransform: "uppercase" }}>
          {selectedRowData?.companyName}
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

export default Approver;
