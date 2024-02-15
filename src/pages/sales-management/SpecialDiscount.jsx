import { Box, Checkbox, TextField, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import PageHeaderTabs from "../../components/PageHeaderTabs";
import { AppContext } from "../../context/AppContext";
import AddSearchMixin from "../../components/mixins/AddSearchMixin";
import useDisclosure from "../../hooks/useDisclosure";
import CommonTable from "../../components/CommonTable";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import { dummySpecialDiscountData } from "../../utils/DummyData";
import ControlledAutocomplete from "../../components/ControlledAutocomplete";
import { useGetAllClientsQuery } from "../../features/registration/api/registrationApi";
import { specialDiscountSchema } from "../../schema/schema";
import { Controller, set, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CommonModalForm from "../../components/CommonModalForm";
import { NumericFormat } from "react-number-format";
import useSnackbar from "../../hooks/useSnackbar";
import CommonDialog from "../../components/CommonDialog";
import { useSelector } from "react-redux";
import ApprovalHistoryModal from "../../components/modals/ApprovalHistoryModal";
import {
  useCreateSpecialDiscountMutation,
  useGetAllSpecialDiscountQuery,
  useUpdateSpecialDiscountMutation,
  useVoidSpecialDiscountMutation,
} from "../../features/special-discount/api/specialDiscountApi";
import { handleCatchErrorMessage } from "../../utils/CustomFunctions";

function SpecialDiscount() {
  const [modalMode, setModalMode] = useState("add");
  const [tabViewing, setTabViewing] = useState(1);
  const [search, setSearch] = useState("");
  const [approvalStatus, setApprovalStatus] = useState("Under review");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);
  const [editMode, setEditMode] = useState(false);

  const { notifications } = useContext(AppContext);
  const { showSnackbar } = useSnackbar();

  const selectedRowData = useSelector((state) => state.selectedRow.value);

  //React Hook Form
  const {
    handleSubmit,
    formState: { errors, isValid, isDirty },
    setValue,
    reset,
    control,
    watch,
    getValues,
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
    isOpen: isVoidOpen,
    onOpen: onVoidOpen,
    onClose: onVoidClose,
  } = useDisclosure();

  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onClose: onConfirmClose,
  } = useDisclosure();

  const {
    isOpen: isHistoryOpen,
    onOpen: onHistoryOpen,
    onClose: onHistoryClose,
  } = useDisclosure();

  //Constants
  const spDiscountNavigation = [
    {
      case: 1,
      name: "Pending Sp. Discount",
      listingFeeStatus: "Under review",
      badge: notifications["pendingSpDiscount"],
    },
    {
      case: 2,
      name: "Approved Sp. Discount",
      listingFeeStatus: "Approved",
      badge: notifications["approvedSpDiscount"],
    },
    {
      case: 3,
      name: "Rejected Sp. Discount",
      listingFeeStatus: "Rejected",
      badge: notifications["rejectedSpDiscount"],
    },
  ];

  //RTK Query
  const [createSpecialDiscount, { isLoading: isCreateLoading }] =
    useCreateSpecialDiscountMutation();
  const { data: specialDiscountData, isFetching: isSpecialDiscountFetching } =
    useGetAllSpecialDiscountQuery({
      Search: search,
      Status: true,
      ApprovalStatus: approvalStatus,
      PageNumber: page + 1,
      PageSize: rowsPerPage,
    });
  const [updateSpecialDiscount, { isLoading: isUpdateLoading }] =
    useUpdateSpecialDiscountMutation();
  const [voidSpecialDiscoubt, { isLoading: isVoidLoading }] =
    useVoidSpecialDiscountMutation();

  const { data: clientData, isLoading: isClientLoading } =
    useGetAllClientsQuery({
      RegistrationStatus: "Approved",
    });

  console.log(getValues());

  const isFetching = false;

  //Constants
  const tableHeads = [
    "Business Name",
    "Owner's Name",
    "Special Discount",
    "Created At",
  ];

  //Functions
  const onSubmit = async (data) => {
    const transformedData = {
      ...data,
      clientId: data.clientId?.id,
    };

    const { clientId, ...noClientId } = transformedData;

    try {
      if (modalMode === "edit") {
        await updateSpecialDiscount({
          id: transformedData.id,
          ...noClientId,
        }).unwrap();
      } else {
        await createSpecialDiscount(transformedData).unwrap();
      }

      handleFormClose();
      onConfirmClose();
      showSnackbar("Special discount added successfully", "success");
    } catch (error) {
      console.log(error);
      showSnackbar(handleCatchErrorMessage(error), "error");
      onConfirmClose();
    }
  };

  const onVoidSubmit = async () => {
    try {
      await voidSpecialDiscoubt({ id: selectedRowData?.id }).unwrap();
      showSnackbar("Special discount voided successfully", "success");
      onVoidClose();
    } catch (error) {
      console.log(error);
      showSnackbar(handleCatchErrorMessage(error), "error");
      // if (error?.data?.error?.message) {
      //   showSnackbar(error?.data?.error?.message, "error");
      // } else if (error?.status === 404) {
      //   showSnackbar("404 Not Found", "error");
      // } else {
      //   showSnackbar("Error adding special discount", "error");
      // }
      onVoidClose();
    }
  };

  const handleFormClose = () => {
    reset();
    onFormClose();
  };

  const handleAddOpen = () => {
    setModalMode("add");
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
      selectedRowData?.discount ? parseFloat(selectedRowData?.discount) : null
    );

    setModalMode("edit");
    onFormOpen();
  };

  //UseEffects
  useEffect(() => {
    setCount(dummySpecialDiscountData?.length);
  }, [dummySpecialDiscountData]);

  return (
    <>
      <Box className="commonPageLayout">
        <PageHeaderTabs
          wide
          pageTitle="Special Discount"
          tabsList={spDiscountNavigation}
          tabViewing={tabViewing}
          setTabViewing={setTabViewing}
        />

        <AddSearchMixin
          addTitle="Special Discount"
          onAddOpen={handleAddOpen}
          setSearch={setSearch}
        />

        {isFetching ? (
          <CommonTableSkeleton moreCompact />
        ) : (
          <CommonTable
            mapData={dummySpecialDiscountData}
            tableHeads={tableHeads}
            moreCompact
            count={count}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            page={page}
            setPage={setPage}
            includeActions
            onEdit={tabViewing === 2 ? null : handleEditOpen}
            onHistory={onHistoryOpen}
            // onVoid={tabViewing === 3 ? onVoidOpen : null}
            mt={"-20px"}
          />
        )}
      </Box>

      <CommonModalForm
        title={(modalMode === "edit" ? "Edit" : "Add") + " Special Discount"}
        open={isFormOpen}
        onClose={handleFormClose}
        onSubmit={onConfirmOpen}
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
              loading={isClientLoading}
              isOptionEqualToValue={(option, value) => true}
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
                      showSnackbar(
                        "Value should be between 1% and 10%",
                        "error"
                      );
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
              name="isOneTime"
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

      <CommonDialog
        open={isConfirmOpen}
        onClose={onConfirmClose}
        onYes={handleSubmit(onSubmit)}
        question
        isLoading={modalMode === "edit" ? isUpdateLoading : isCreateLoading}
      >
        Confirm {modalMode === "edit" ? "update" : "adding"} of{" "}
        <span style={{ fontWeight: "700" }}>{watch("discount")}%</span> special
        discount for <br />
        <span style={{ fontWeight: "700" }}>
          {watch("clientId")?.businessName}
        </span>
        ?
      </CommonDialog>

      <CommonDialog
        open={isVoidOpen}
        onClose={onVoidClose}
        onYes={onVoidSubmit}
        isLoading={isVoidLoading}
      >
        Confirm void of{" "}
        <span style={{ fontWeight: "700" }}>{selectedRowData?.discount}%</span>{" "}
        special discount for <br />
        <span style={{ fontWeight: "700" }}>
          {selectedRowData?.businessName}
        </span>
        ?
      </CommonDialog>
    </>
  );
}

export default SpecialDiscount;
