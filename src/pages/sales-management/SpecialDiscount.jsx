import { Box, Checkbox, TextField, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import PageHeaderTabs from "../../components/PageHeaderTabs";
import { AppContext } from "../../context/AppContext";
import AddSearchMixin from "../../components/mixins/AddSearchMixin";
import useDisclosure from "../../hooks/useDisclosure";
import CommonTable from "../../components/CommonTable";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import { dummyTableData } from "../../utils/DummyData";
import CommonDrawer from "../../components/CommonDrawer";
import ControlledAutocomplete from "../../components/ControlledAutocomplete";
import { useGetAllClientsQuery } from "../../features/registration/api/registrationApi";
import { specialDiscountSchema } from "../../schema/schema";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

function SpecialDiscount() {
  const [drawerMode, setDrawerMode] = useState("add");
  const [tabViewing, setTabViewing] = useState(1);
  const [search, setSearch] = useState("");
  // const [listingFeeStatus, setListingFeeStatus] = useState("Under review");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);
  const [editMode, setEditMode] = useState(false);

  const { notifications } = useContext(AppContext);

  //React Hook Form
  const {
    handleSubmit,
    formState: { errors, isValid, isDirty },
    register,
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
    isOpen: isSpDiscountOpen,
    onOpen: onSpDiscountOpen,
    onClose: onSpDiscountClose,
  } = useDisclosure();

  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
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
  const handleAddOpen = () => {
    setDrawerMode("add");
    onDrawerOpen();
  };

  const handleDrawerClose = () => {
    // reset();
    onDrawerClose();
    setSelectedId("");
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
          onAddOpen={onDrawerOpen}
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

      <CommonDrawer
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        width={"400px"}
        drawerHeader={
          (drawerMode === "add" ? "Add" : "Edit") + " Special Discount"
        }
        // onSubmit={handleSubmit(onDrawerSubmit)}
        // disableSubmit={!isValid}
        // isLoading={drawerMode === "add" ? isAddLoading : isUpdateLoading}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <Typography sx={{ fontWeight: "600", fontSize: "18px" }}>
            Customer Name
          </Typography>

          <ControlledAutocomplete
            name={`clientId`}
            control={control}
            options={clientData?.regularClient || []}
            getOptionLabel={(option) =>
              option.businessName + " - " + option.ownersName || ""
            }
            disableClearable
            loading={isClientLoading}
            disabled={editMode}
            // value={clientData?.regularClient?.find(
            //   (item) => item.businessName === selectedRowData?.businessName
            // )}
            // isOptionEqualToValue={(option, value) => option.id === value.id}
            isOptionEqualToValue={(option, value) => true}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                label="Business Name - Owner's Name"
                required
                helperText={errors?.itemId?.message}
                error={errors?.itemId}
                // sx={{ width: "400px" }}
              />
            )}
          />
        </Box>

        {/* <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <Typography sx={{ fontWeight: "600", fontSize: "18px" }}>
            Customer Name
          </Typography>
          <TextField
            label="Customer Name"
            size="small"
            autoComplete="off"
            // {...register("storeTypeName")}
            // helperText={errors?.storeTypeName?.message}
            // error={errors?.storeTypeName}
          />
        </Box> */}

        <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <Typography sx={{ fontWeight: "600", fontSize: "18px" }}>
            Special Discount
          </Typography>
          <TextField
            label="Special Discount"
            size="small"
            autoComplete="off"
            type="number"
            required
            // {...register("storeTypeName")}
            // helperText={errors?.storeTypeName?.message}
            // error={errors?.storeTypeName}
          />
        </Box>

        <Box sx={{ display: "flex", gap: "5px" }}>
          <Checkbox />
          <Typography>One time use only</Typography>
        </Box>
      </CommonDrawer>
    </>
  );
}

export default SpecialDiscount;
