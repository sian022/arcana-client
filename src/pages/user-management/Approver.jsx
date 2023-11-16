import { Box, IconButton, TextField } from "@mui/material";
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
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import { useGetAllApproversQuery } from "../../features/user-management/api/approverApi";
import SecondaryButton from "../../components/SecondaryButton";
import { useAutoAnimate } from "@formkit/auto-animate/react";

function Approver() {
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

  // Constants
  const excludeKeysDisplay = [
    "id",
    "createdAt",
    "addedBy",
    "updatedAt",
    "modifiedBy",
    "isActive",
    "users",
  ];

  const tableMap = [
    {
      moduleName: "Freebie Approval",
    },
    {
      moduleName: "Registration Approval",
    },
    {
      moduleName: "Listing Fee Approval",
    },
    {
      moduleName: "Sp. Discount Approval",
    },
  ];

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
    try {
      if (drawerMode === "add") {
        await postApprover(data).unwrap();
        setSnackbarMessage("Approver added successfully");
      } else if (drawerMode === "edit") {
        await putApprover(data).unwrap();
        setSnackbarMessage("Approver updated successfully");
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
      await patchApproverStatus(selectedId).unwrap();
      onArchiveClose();
      setSnackbarMessage(
        `Approver ${status ? "archived" : "restored"} successfully`
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

  const handleEditOpen = () => {
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

  useEffect(() => {}, watch("approvers"));
  return (
    <Box className="commonPageLayout">
      <PageHeaderSearch
        pageTitle="Approver"
        onOpen={handleAddOpen}
        setSearch={setSearch}
        setStatus={setStatus}
      />
      {false ? (
        <CommonTableSkeleton />
      ) : (
        <CommonTable
          mapData={tableMap}
          excludeKeysDisplay={excludeKeysDisplay}
          editable
          onManageApprovers={handleEditOpen}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          count={tableMap.length}
          status={status}
        />
      )}

      <CommonDrawer
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        drawerHeader={`Approver - ${selectedRowData?.moduleName}`}
        onSubmit={handleSubmit(onDrawerSubmit)}
        disableSubmit={!isValid}
        width="600px"
        // isLoading={drawerMode === "add" ? isAddLoading : isUpdateLoading}
      >
        <Box
          sx={{ display: "flex", flexDirection: "column", gap: "10px" }}
          ref={parent}
        >
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
                loading={isLoading}
                isOptionEqualToValue={(option, value) => true}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    label="Approver Name"
                    required
                    helperText={errors?.userId?.message}
                    error={errors?.userId}
                  />
                )}
              />

              <IconButton
                sx={{ color: "secondary.main" }}
                onClick={() => {
                  swap(index, index - 1);
                }}
                disabled={index === 0}
              >
                <KeyboardArrowUp sx={{ fontSize: "30px" }} />
              </IconButton>

              <IconButton
                sx={{ color: "secondary.main" }}
                onClick={() => {
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
              level: null,
            });
          }}
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
