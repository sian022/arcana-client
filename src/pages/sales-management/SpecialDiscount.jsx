import { Box, Checkbox, TextField, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import PageHeaderTabs from "../../components/PageHeaderTabs";
import { AppContext } from "../../context/AppContext";
import AddSearchMixin from "../../components/mixins/AddSearchMixin";
import useDisclosure from "../../hooks/useDisclosure";
import CommonTable from "../../components/CommonTable";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import { dummyTableData } from "../../utils/DummyData";
import ControlledAutocomplete from "../../components/ControlledAutocomplete";
import { useGetAllClientsQuery } from "../../features/registration/api/registrationApi";
import { specialDiscountSchema } from "../../schema/schema";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CommonModalForm from "../../components/CommonModalForm";
import { NumericFormat } from "react-number-format";
import useSnackbar from "../../hooks/useSnackbar";
import CommonDialog from "../../components/CommonDialog";

function SpecialDiscount() {
  const [drawerMode, setDrawerMode] = useState("add");
  const [tabViewing, setTabViewing] = useState(1);
  const [search, setSearch] = useState("");
  const [approvalStatus, setApprovalStatus] = useState("Under review");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);
  const [editMode, setEditMode] = useState(false);

  const [isOneTimeUse, setIsOneTimeUse] = useState(false);

  const { notifications } = useContext(AppContext);
  const { showSnackbar } = useSnackbar();

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
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onClose: onConfirmClose,
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
  const { data: clientData, isLoading: isClientLoading } =
    useGetAllClientsQuery({
      RegistrationStatus: "Approved",
    });

  const isFetching = false;

  //Functions
  const onSubmit = (data) => {
    const transformedData = {
      ...data,
      clientId: data.clientId?.id,
    };

    try {
      console.log(transformedData);
      handleFormClose();
      onConfirmClose();
      showSnackbar("Special discount added successfully", "success");
    } catch (error) {
      console.log(error);
      if (error?.data?.error?.message) {
        showSnackbar(error?.data?.error?.message, "error");
      } else {
        showSnackbar("Error adding special discount", "error");
      }
      onConfirmClose();
    }
  };

  const handleFormClose = () => {
    reset();
    onFormClose();
  };

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
          // onAddOpen={onDrawerOpen}
          onAddOpen={onFormOpen}
          setSearch={setSearch}
        />

        {isFetching ? (
          <CommonTableSkeleton moreCompact />
        ) : (
          <CommonTable
            mapData={dummyTableData}
            moreCompact
            // excludeKeysDisplay={excludeKeysDisplay}
            count={count}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            page={page}
            setPage={setPage}
            editable
            // onView={onViewOpen}
            // tableHeads={tableHeads}
            // pesoArray={pesoArray}
            // onEdit={handleOpenEdit}
            // onHistory={onHistoryOpen}
            mt={"-20px"}
          />
        )}
      </Box>

      <CommonModalForm
        title="Special Discount"
        open={isFormOpen}
        onClose={handleFormClose}
        onSubmit={onConfirmOpen}
        // onSubmit={handleSubmit(onSubmit)}
        width="600px"
        disableSubmit={!isValid || !isDirty || watch("specialDiscount") === 0}
        // height="520px"
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
                  // required
                  helperText={errors?.clientId?.message}
                  error={errors?.clientId}
                />
              )}
              onChange={(_, value) => {
                if (watch("clientId") && watch("listingItems")[0]?.itemId) {
                  onClientConfirmationOpen();
                  setConfirmationValue(value);
                  return watch("clientId");
                } else {
                  return value;
                }
              }}
            />
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <Typography sx={{ fontSize: "18px", fontWeight: "600" }}>
              Special Discount
            </Typography>

            <Controller
              control={control}
              name={"specialDiscount"}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <NumericFormat
                  label="Special Discount (%)"
                  type="text"
                  size="small"
                  customInput={TextField}
                  autoComplete="off"
                  onValueChange={(e) => {
                    const newValue = e.value === "" ? null : Number(e.value);
                    onChange(newValue);

                    // Check if the entered value is more than 10 and show an alert
                    if (newValue != null && newValue > 10) {
                      alert("Special Discount cannot be more than 10%");
                      // You may replace the alert with your preferred way of notifying the user
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
                      return false; // Prevent updating the value
                    }
                    return true;
                  }}
                  // disabled={!watch("clientId")}
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

      <CommonDialog
        open={isConfirmOpen}
        onClose={onConfirmClose}
        onYes={handleSubmit(onSubmit)}
        noIcon
      >
        Confirm adding of special discount?
      </CommonDialog>
    </>
  );
}

export default SpecialDiscount;
