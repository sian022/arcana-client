import { Box, Checkbox, TextField, Typography } from "@mui/material";
import { useContext, useEffect, useMemo, useState } from "react";
import PageHeaderTabs from "../../components/PageHeaderTabs";
import { AppContext } from "../../context/AppContext";
import AddVoidSearchMixin from "../../components/mixins/AddVoidSearchMixin";
import useDisclosure from "../../hooks/useDisclosure";
import CommonTable from "../../components/CommonTable";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import ControlledAutocomplete from "../../components/ControlledAutocomplete";
import { useGetAllClientsQuery } from "../../features/registration/api/registrationApi";
import { specialDiscountSchema } from "../../schema/schema";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CommonModalForm from "../../components/CommonModalForm";
import { NumericFormat } from "react-number-format";
import useSnackbar from "../../hooks/useSnackbar";
import { useSelector } from "react-redux";
import ApprovalHistoryModal from "../../components/modals/ApprovalHistoryModal";
import {
  useCancelSpecialDiscountMutation,
  useCreateSpecialDiscountMutation,
  useGetAllSpecialDiscountQuery,
  useUpdateSpecialDiscountMutation,
  useVoidSpecialDiscountMutation,
} from "../../features/special-discount/api/specialDiscountApi";
import { handleCatchErrorMessage } from "../../utils/CustomFunctions";
import useConfirm from "../../hooks/useConfirm";
import { useSendMessageMutation } from "../../features/misc/api/rdfSmsApi";
import { usePatchReadNotificationMutation } from "../../features/notification/api/notificationApi";

function SpecialDiscount() {
  const [tabViewing, setTabViewing] = useState(1);
  const [search, setSearch] = useState("");
  const [approvalStatus, setApprovalStatus] = useState("Under review");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);
  const [editMode, setEditMode] = useState(false);

  // Hooks
  const { notifications, isNotificationFetching } = useContext(AppContext);
  const snackbar = useSnackbar();
  const confirm = useConfirm();
  const selectedRowData = useSelector((state) => state.selectedRow.value);
  const userDetails = useSelector((state) => state.login.userDetails);

  //React Hook Form
  const {
    handleSubmit,
    formState: { errors, isValid, isDirty },
    setValue,
    reset,
    control,
    watch,
  } = useForm({
    resolver: yupResolver(specialDiscountSchema.schema),
    mode: "onChange",
    defaultValues: specialDiscountSchema.defaultValues,
  });

  //Disclosures
  const {
    isOpen: isFormOpen,
    onOpen: onFormOpen,
    onClose: onFormClose,
  } = useDisclosure();

  const {
    isOpen: isHistoryOpen,
    onOpen: onHistoryOpen,
    onClose: onHistoryClose,
  } = useDisclosure();

  //Constants
  const spDiscountNavigation = useMemo(() => {
    return [
      {
        case: 1,
        name: "Pending Sp. Discount",
        approvalStatus: "Under review",
        badge: notifications["pendingSpDisocunt"],
      },
      {
        case: 2,
        name: "Approved Sp. Discount",
        approvalStatus: "Approved",
        badge: notifications["approvedSpDisocunt"],
      },
      {
        case: 3,
        name: "Rejected Sp. Discount",
        approvalStatus: "Rejected",
        badge: notifications["rejectedSpDisocunt"],
      },
    ];
  }, [notifications]);

  //RTK Query
  const [createSpecialDiscount] = useCreateSpecialDiscountMutation();
  const { data: specialDiscountData, isFetching: isSpecialDiscountFetching } =
    useGetAllSpecialDiscountQuery({
      Search: search,
      Status: true,
      SpDiscountStatus: approvalStatus,
      PageNumber: page + 1,
      PageSize: rowsPerPage,
    });
  const [updateSpecialDiscount] = useUpdateSpecialDiscountMutation();
  const [voidSpecialDiscount] = useVoidSpecialDiscountMutation();
  const [cancelSpecialDiscount] = useCancelSpecialDiscountMutation();
  const [sendMessage] = useSendMessageMutation();

  const { data: clientData, isLoading: isClientLoading } =
    useGetAllClientsQuery({
      RegistrationStatus: "Approved",
    });
  const [patchReadNotification] = usePatchReadNotificationMutation();

  //Constants
  const customOrderKeys = [
    // "id",
    "businessName",
    "clientName",
    "discount",
    "isOneTime",
  ];
  const tableHeads = [
    // "Request No.",
    "Business Name",
    "Owner's Name",
    "Discount",
    "One Time Only",
  ];
  const percentageArray = ["discount"];

  //Functions: API
  const onSubmit = async (data) => {
    try {
      await confirm({
        children: (
          <>
            Confirm {editMode ? "update" : "adding"} of{" "}
            <span style={{ fontWeight: "700" }}>
              {watch("discount")?.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionsDigits: 2,
              })}
              %
            </span>{" "}
            special discount for <br />
            <span style={{ fontWeight: "700" }}>
              {watch("clientId")?.businessName}
            </span>
            ?
          </>
        ),
        question: true,
        callback: async () => {
          if (editMode) {
            await updateSpecialDiscount({
              id: selectedRowData?.id,
              ...data,
              clientId: data?.clientId.id,
            }).unwrap();

            if (approvalStatus === "Rejected") {
              await sendMessage({
                message: `Fresh morning ${
                  selectedRowData?.currentApprover || "approver"
                }! You have a new sp. discount approval.`,
                mobile_number: `+63${selectedRowData?.currentApproverPhoneNumber}`,
              }).unwrap();
            }
          } else {
            const response = await createSpecialDiscount({
              ...data,
              clientId: data?.clientId.id,
            }).unwrap();

            await sendMessage({
              message: `Fresh morning ${
                response?.approver || "approver"
              }! You have a new sp. discount approval.`,
              mobile_number: `+63${response?.approverMobileNumber}`,
            }).unwrap();
          }
        },
      });
      handleFormClose();

      snackbar({
        message: "Special discount added successfully",
        variant: "success",
      });
    } catch (error) {
      if (error?.isConfirmed) {
        snackbar({
          message: handleCatchErrorMessage(error),
          variant: "error",
        });
      }

      if (error.function && error.function === "sendMessage") {
        snackbar({
          message:
            "Special Discount requested successfully but failed to send message to approver.",
          variant: "warning",
        });
        handleFormClose();
      }
    }
  };

  const onCancel = async () => {
    try {
      await confirm({
        children: (
          <>
            Confirm cancel of{" "}
            <span style={{ fontWeight: "700" }}>
              {(selectedRowData?.discount * 100)?.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionsDigits: 2,
              })}
              %
            </span>{" "}
            special discount for <br />
            <span style={{ fontWeight: "700" }}>
              {selectedRowData?.businessName}
            </span>
            ?
          </>
        ),
        question: false,
        callback: () =>
          cancelSpecialDiscount({ id: selectedRowData?.id }).unwrap(),
      });

      snackbar({
        message: "Special discount cancelled successfully",
        variant: "success",
      });
    } catch (error) {
      if (error.isConfirmed) {
        snackbar({ message: handleCatchErrorMessage(error), variant: "error" });
      }
    }
  };

  const onVoid = async () => {
    try {
      await confirm({
        children: (
          <>
            Confirm void of{" "}
            <span style={{ fontWeight: "700" }}>
              {(selectedRowData?.discount * 100)?.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionsDigits: 2,
              })}
              %
            </span>{" "}
            special discount for <br />
            <span style={{ fontWeight: "700" }}>
              {selectedRowData?.businessName}
            </span>
            ?
          </>
        ),
        question: false,
        callback: () =>
          voidSpecialDiscount({ id: selectedRowData?.id }).unwrap(),
      });

      snackbar({
        message: "Special discount voided successfully",
        variant: "success",
      });
    } catch (error) {
      if (error.isConfirmed) {
        snackbar({ message: handleCatchErrorMessage(error), variant: "error" });
      }
    }
  };

  // Functions: Form Open
  const handleFormClose = () => {
    reset();
    onFormClose();
  };

  const handleAddOpen = () => {
    setEditMode(false);
    onFormOpen();
  };

  const handleEditOpen = () => {
    //Autofilling
    setValue(
      "clientId",
      clientData?.regularClient?.find(
        (client) => client.id === selectedRowData?.clientId
      )
    );
    setValue(
      "discount",
      selectedRowData?.discount
        ? parseFloat(selectedRowData?.discount) * 100
        : null
    );
    setValue("isOnetime", selectedRowData?.isOneTime);

    setEditMode(true);
    onFormOpen();
  };

  // UseEffect
  useEffect(() => {
    const foundItem = spDiscountNavigation.find(
      (item) => item.case === tabViewing
    );

    setApprovalStatus(foundItem?.approvalStatus);
  }, [tabViewing, spDiscountNavigation]);

  useEffect(() => {
    if (specialDiscountData) {
      setCount(specialDiscountData.totalCount);
    }
  }, [specialDiscountData]);

  useEffect(() => {
    if (
      notifications["rejectedSpDisocunt"] > 0 &&
      approvalStatus === "Rejected"
    ) {
      patchReadNotification({ Tab: "Rejected Sp. Discount" });
    }

    if (
      notifications["approvedSpDisocunt"] > 0 &&
      approvalStatus === "Approved"
    ) {
      patchReadNotification({ Tab: "Approved Sp. Discount" });
    }
  }, [approvalStatus, patchReadNotification, notifications]);

  useEffect(() => {
    setPage(0);
  }, [search, rowsPerPage, tabViewing]);

  return (
    <>
      <Box className="commonPageLayout">
        <PageHeaderTabs
          wide
          pageTitle="Special Discount"
          tabsList={spDiscountNavigation}
          tabViewing={tabViewing}
          setTabViewing={setTabViewing}
          isNotificationFetching={isNotificationFetching}
        />

        <AddVoidSearchMixin
          addTitle="Special Discount"
          onAddOpen={handleAddOpen}
          setSearch={setSearch}
          setStatus={setApprovalStatus}
          status={approvalStatus}
        />

        {isSpecialDiscountFetching ? (
          <CommonTableSkeleton compact mt={"-20px"} />
        ) : (
          <CommonTable
            mapData={specialDiscountData?.specialDiscounts}
            tableHeads={tableHeads}
            customOrderKeys={customOrderKeys}
            percentageArray={percentageArray}
            compact
            count={count}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            page={page}
            setPage={setPage}
            // onEdit={tabViewing === 2 ? null : handleEditOpen}
            onEdit={
              userDetails?.roleName === "Admin"
                ? handleEditOpen
                : userDetails?.roleName !== "Admin"
                ? approvalStatus !== "Approved" && handleEditOpen
                : null
            }
            onHistory={onHistoryOpen}
            onCancel={tabViewing === 1 ? onCancel : null}
            onVoid={
              tabViewing === 3 && approvalStatus !== "Voided" ? onVoid : null
            }
            mt={"-20px"}
            moveNoDataUp
          />
        )}
      </Box>

      <CommonModalForm
        title={(editMode ? "Edit" : "Add") + " Special Discount"}
        open={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleSubmit(onSubmit)}
        width="600px"
        disableSubmit={!isValid || !isDirty || watch("discount") === 0}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "5px",
            }}
          >
            <Typography sx={{ fontSize: "18px", fontWeight: "600" }}>
              Business Info
            </Typography>

            <ControlledAutocomplete
              name={`clientId`}
              control={control}
              options={clientData?.regularClient || []}
              getOptionLabel={(option) =>
                option.businessName?.toUpperCase() +
                  " - " +
                  option.ownersName?.toUpperCase() || ""
              }
              disableClearable
              disabled={editMode}
              loading={isClientLoading}
              isOptionEqualToValue={() => true}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  label="Business Name - Owner's Name"
                  helperText={errors?.clientId?.message}
                  error={errors?.clientId}
                />
              )}
            />
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <Typography sx={{ fontSize: "18px", fontWeight: "600" }}>
              Special Discount
            </Typography>

            <Controller
              control={control}
              name={"discount"}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <NumericFormat
                  label="Special Discount"
                  type="text"
                  size="small"
                  customInput={TextField}
                  autoComplete="off"
                  onValueChange={(e) => {
                    const newValue = e.value === "" ? null : Number(e.value);
                    onChange(newValue);

                    if (newValue != null && newValue > 10) {
                      alert("Special Discount cannot be more than 10%");
                    }
                  }}
                  onBlur={onBlur}
                  value={value || ""}
                  thousandSeparator=","
                  allowNegative={false}
                  allowLeadingZeros={false}
                  decimalScale={2}
                  inputRef={ref}
                  isAllowed={(values) => {
                    const { floatValue } = values;
                    // Check if the floatValue is greater than 10 and show a snackbar
                    if (floatValue != null && floatValue > 10) {
                      snackbar({
                        message: "Value should be between 1% and 10%",
                        variant: "error",
                      });
                      return false;
                    }
                    return true;
                  }}
                  suffix="%"
                  disabled={!watch("clientId")}
                />
              )}
            />
          </Box>

          <Box sx={{ display: "flex", gap: "5px", justifyContent: "end" }}>
            <Controller
              control={control}
              name="isOnetime"
              render={({ field }) => (
                <Checkbox
                  {...field}
                  onChange={(e) => field.onChange(e.target.checked)}
                  checked={field.value}
                />
              )}
            />

            <Typography>One time use only</Typography>
          </Box>
        </Box>
      </CommonModalForm>

      <ApprovalHistoryModal
        open={isHistoryOpen}
        onClose={onHistoryClose}
        variant="specialDiscount"
      />
    </>
  );
}

export default SpecialDiscount;
