import { Autocomplete, Box, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import PageHeaderAdd from "../../components/PageHeaderAdd";
import CommonTable from "../../components/CommonTable";
import CommonDrawer from "../../components/CommonDrawer";
import useDisclosure from "../../hooks/useDisclosure";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CommonDialog from "../../components/CommonDialog";
import SuccessSnackbar from "../../components/SuccessSnackbar";
import ErrorSnackbar from "../../components/ErrorSnackbar";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import { priceModeTaggingSchema } from "../../schema/schema";
import { useSelector } from "react-redux";
import { Link } from "@mui/icons-material";
import { useLazyGetAllItemsByPriceModeIdQuery } from "../../features/setup/api/priceModeItemsApi";
import { useGetAllPriceModeQuery } from "../../features/setup/api/priceModeSetupApi";
import { useGetAllProductsQuery } from "../../features/setup/api/productsApi";
import ControlledAutocomplete from "../../components/ControlledAutocomplete";
import { NumericFormat } from "react-number-format";

function PriceModeManagement() {
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
  ];

  const tableHeads = ["Price Mode Code", "Price Mode Description"];

  const customOrderKeys = ["priceModeCode", "priceModeDescription"];

  //React Hook Form
  const {
    handleSubmit,
    formState: { errors, isValid },
    register,
    setValue,
    reset,
    getValues,
    control,
    watch,
  } = useForm({
    resolver: yupResolver(priceModeTaggingSchema.schema),
    mode: "onChange",
    defaultValues: priceModeTaggingSchema.defaultValues,
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "items",
  });

  //RTK Query
  const { data, isLoading, isFetching } = useGetAllPriceModeQuery({
    Search: search,
    Status: status,
    PageNumber: page + 1,
    PageSize: rowsPerPage,
  });

  const { data: productData, isLoading: isProductLoading } =
    useGetAllProductsQuery({ Status: true, page: 1, pageSize: 1000 });

  const [
    triggerProductsById,
    { data: productsByIdData, isFetching: isProductsByIdFetching },
  ] = useLazyGetAllItemsByPriceModeIdQuery();

  //Drawer Functions
  const onDrawerSubmit = async (data) => {
    try {
      if (drawerMode === "add") {
        await postPriceMode(data).unwrap();
        setSnackbarMessage("Price Mode added successfully");
      } else if (drawerMode === "edit") {
        await putPriceMode({ id: selectedRowData?.id, ...data }).unwrap();
        setSnackbarMessage("Price Mode updated successfully");
      }

      onDrawerClose();
      reset();
      onSuccessOpen();
    } catch (error) {
      if (error?.data?.error?.message) {
        setSnackbarMessage(error?.data?.error?.message);
      } else {
        setSnackbarMessage(
          `Error ${drawerMode === "add" ? "adding" : "updating"} Price Mode`
        );
      }

      onErrorOpen();
    }
  };

  const onArchiveSubmit = async () => {
    try {
      await patchPrideModeStatus(selectedId).unwrap();
      onArchiveClose();
      setSnackbarMessage(
        `Price Mode ${status ? "archived" : "restored"} successfully`
      );
      onSuccessOpen();
    } catch (error) {
      if (error?.data?.error?.message) {
        setSnackbarMessage(error?.data?.error?.message);
      } else {
        setSnackbarMessage("Error archiving Price Mode");
      }

      onErrorOpen();
    }
  };

  const handleAddOpen = () => {
    setDrawerMode("add");
    onDrawerOpen();
  };

  const handleEditOpen = (editData) => {
    setDrawerMode("edit");
    onDrawerOpen();

    setValue("priceMode", editData.priceModeCode);
    setValue("priceModeDescription", editData.priceModeDescription);
  };

  const handleDrawerClose = () => {
    reset();
    onDrawerClose();
    setSelectedId("");
  };

  //UseEffect
  useEffect(() => {
    setCount(data?.totalCount);
  }, [data]);

  useEffect(() => {
    setPage(0);
  }, [search, status, rowsPerPage]);

  useEffect(() => {
    if (isDrawerOpen) {
      triggerProductsById(
        {
          PriceModeId: selectedRowData?.id,
          Status: true,
          PageSize: 1000,
          PageNumber: 1,
        },
        { preferCacheValue: true }
      );
    }
  }, [isDrawerOpen]);

  return (
    <Box className="commonPageLayout">
      <PageHeaderAdd
        pageTitle={
          <>
            Price Mode Management <Link />
          </>
        }
        setSearch={setSearch}
        setStatus={setStatus}
        removeAdd
      />
      {isFetching ? (
        <CommonTableSkeleton />
      ) : (
        <CommonTable
          mapData={data?.priceMode}
          editable
          // onEdit={handleEditOpen}
          // onArchive={handleArchiveOpen}
          onManageProducts={handleAddOpen}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          tableHeads={tableHeads}
          customOrderKeys={customOrderKeys}
          count={count}
          status={status}
        />
      )}

      <CommonDrawer
        width="600px"
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        drawerHeader="Manage Products"
        onSubmit={handleSubmit(onDrawerSubmit)}
        disableSubmit={!isValid}
        isLoading={
          drawerMode === "add"
            ? false
            : // isAddLoading
              // isUpdateLoading
              false
        }
      >
        <Box className="priceModeManagement">
          <Typography fontSize="1.2rem" fontWeight="700">
            Price Mode Info
          </Typography>

          <Box className="priceModeManagement__row">
            <TextField
              label="Price Mode"
              size="small"
              value={selectedRowData?.priceModeCode}
              sx={{ pointerEvents: "none", width: "25%" }}
              readOnly
            />

            <TextField
              label="Price Mode Description"
              size="small"
              value={selectedRowData?.priceModeDescription}
              sx={{ pointerEvents: "none", width: "75%" }}
              readOnly
            />
          </Box>

          <Typography fontSize="1.2rem" fontWeight="700" mt="10px">
            Products List
          </Typography>

          <Box className="priceModeManagement__row">
            {fields.map((item, index) => (
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "10px" }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <ControlledAutocomplete
                    name={`items[${index}].itemId`}
                    control={control}
                    options={productData?.items || []}
                    getOptionLabel={(option) => option.itemCode || ""}
                    disableClearable
                    loading={isProductLoading}
                    isOptionEqualToValue={(option, value) => true}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        label="Product Code"
                        // required
                        helperText={errors?.itemId?.message}
                        error={errors?.itemId}
                        sx={{ width: "180px" }}
                      />
                    )}
                    // onChange={(_, value) => {
                    //   setValue(
                    //     `items[${index}].itemDescription`,
                    //     value?.itemDescription
                    //   );
                    //   setValue(`items[${index}].uom`, value?.uom);
                    //   return value;
                    // }}
                  />

                  <Controller
                    control={control}
                    name={`items[${index}].price`}
                    render={({ field: { onChange, onBlur, value, ref } }) => (
                      <NumericFormat
                        label="Price"
                        type="text"
                        size="small"
                        customInput={TextField}
                        autoComplete="off"
                        onValueChange={(e) => {
                          onChange(Number(e.value));
                          handleRecalculateTotalAmount();
                        }}
                        onBlur={onBlur}
                        value={value || ""}
                        // ref={ref}
                        // required
                        thousandSeparator=","
                        allowNegative={false}
                        allowLeadingZeros={false}
                        prefix="₱"
                      />
                    )}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </CommonDrawer>

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

export default PriceModeManagement;
