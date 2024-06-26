import { Box, IconButton, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import PageHeaderAdd from "../../components/PageHeaderAdd";
import CommonTable from "../../components/CommonTable";
import CommonDrawer from "../../components/CommonDrawer";
import useDisclosure from "../../hooks/useDisclosure";
import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { approversSchema } from "../../schema/schema";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import { useSelector } from "react-redux";
import ControlledAutocomplete from "../../components/ControlledAutocomplete";
import {
  Add,
  HowToVote,
  KeyboardArrowDown,
  KeyboardArrowUp,
  RemoveCircleOutline,
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
import useSnackbar from "../../hooks/useSnackbar";
import { handleCatchErrorMessage } from "../../utils/CustomFunctions";

function Approver() {
  const [drawerMode, setDrawerMode] = useState("add");
  const [status, setStatus] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  //Hooks
  const snackbar = useSnackbar();
  const selectedRowData = useSelector((state) => state.selectedRow.value);

  // Drawer Disclosures
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();

  // Constants
  const customOrderKeys = ["moduleName"];

  const approvalItem = navigationData.find((item) => item.name === "Approval");

  //React Hook Form
  const {
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    reset,
    control,
    watch,
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
  const { data, isLoading } = useGetAllApproversQuery();

  const [addApproversPerModule, { isLoading: isAddApproversLoading }] =
    useAddApproversPerModuleMutation();
  const {
    data: approversPerModuleData,
    isFetching: isApproversPerModuleFetching,
  } = useGetApproversPerModuleQuery();
  const [putUpdateApproversPerModule, { isLoading: isUpdateApproversLoading }] =
    usePutUpdateApproversPerModuleMutation();

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
      } else if (drawerMode === "edit") {
        await putUpdateApproversPerModule({
          moduleName: moduleName.name,
          approvers: restData.approvers.map((approver) => ({
            userId: approver.userId.userId,
            level: approver.level,
          })),
          // ...restData,
        }).unwrap();
      }

      onDrawerClose();
      reset();
      snackbar({
        message: `Approver ${
          drawerMode === "add" ? "added" : "updated"
        } successfully`,
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

  const handleEditOpen = () => {
    setDrawerMode("edit");
    onDrawerOpen();
  };

  const handleDrawerClose = () => {
    reset();
    onDrawerClose();
  };

  const handleApproverError = () => {
    if (fields.length === 1) {
      snackbar({
        message: "At least one approver is required",
        variant: "error",
      });
    }
  };

  useEffect(() => {
    setPage(0);
  }, [search, status, rowsPerPage]);

  useEffect(() => {
    if (isDrawerOpen) {
      setValue("approvers[0].moduleName", selectedRowData?.moduleName);
    }
  }, [isDrawerOpen, selectedRowData?.moduleName, setValue]);

  useEffect(() => {
    if (isDrawerOpen && drawerMode === "edit") {
      const foundModule = approvalItem?.sub?.find(
        (item) => item?.name === selectedRowData?.moduleName
      );
      setValue("moduleName", foundModule);

      const editFields = selectedRowData?.approvers?.map((item, index) => ({
        userId: data?.find((user) => user.userId === item.userId),
        level: index + 1,
      }));

      setValue("approvers", editFields);
    }
  }, [isDrawerOpen, approvalItem, data, drawerMode, selectedRowData, setValue]);

  return (
    <Box className="commonPageLayout">
      <PageHeaderAdd
        pageTitle={
          <>
            Approver <HowToVote />
          </>
        }
        onOpen={handleAddOpen}
        setSearch={setSearch}
        setStatus={setStatus}
        removeArchive
      />
      {isApproversPerModuleFetching ? (
        <CommonTableSkeleton evenLesserCompact />
      ) : (
        <CommonTable
          evenLesserCompact
          mapData={approversPerModuleData}
          customOrderKeys={customOrderKeys}
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
          isOptionEqualToValue={() => true}
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

        <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Typography sx={{ fontWeight: "bold", fontSize: "20px" }}>
            List of Approvers
          </Typography>

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
                  disabled={!watch("moduleName")}
                  loading={isLoading}
                  isOptionEqualToValue={() => true}
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
                  <RemoveCircleOutline sx={{ fontSize: "30px" }} />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>

        <SecondaryButton
          sx={{ width: "150px" }}
          onClick={() => {
            append({
              userId: null,
              moduleName: selectedRowData?.moduleName,
              level: fields.length + 1,
            });
          }}
          disabled={!isValid}
          endIcon={<Add />}
        >
          Add Approver
        </SecondaryButton>
      </CommonDrawer>
    </Box>
  );
}

export default Approver;
