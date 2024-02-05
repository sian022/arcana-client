import { Box, IconButton, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import PageHeaderAdd from "../../components/PageHeaderAdd";
import { Cancel, Link } from "@mui/icons-material";
import CommonTable from "../../components/CommonTable";
import { useGetAllPriceModeQuery } from "../../features/setup/api/priceModeSetupApi";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import CommonModalForm from "../../components/CommonModalForm";
import useDisclosure from "../../hooks/useDisclosure";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { priceModeTaggingSchema } from "../../schema/schema";
import { useSelector } from "react-redux";
import SecondaryButton from "../../components/SecondaryButton";
import ControlledAutocomplete from "../../components/ControlledAutocomplete";
import { useGetAllProductsQuery } from "../../features/setup/api/productsApi";
import useSnackbar from "../../hooks/useSnackbar";
import { NumericFormat } from "react-number-format";

function PriceModeManagement() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);

  const selectedRowData = useSelector((state) => state.selectedRow.value);

  const { showSnackbar } = useSnackbar();

  //Disclosures
  const {
    isOpen: isModalFormOpen,
    onOpen: onModalFormOpen,
    onClose: onModalFormClose,
  } = useDisclosure();

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

  const { fields, remove, append } = useFieldArray({
    control,
    name: "priceModeItems",
  });

  //RTK Query
  const { data, isFetching } = useGetAllPriceModeQuery({
    Search: search,
    Status: true,
    PageNumber: page + 1,
    PageSize: rowsPerPage,
  });

  const { data: productData, isLoading: isProductLoading } =
    useGetAllProductsQuery({ Status: true, page: 1, pageSize: 1000 });

  // Constants
  const tableHeads = ["Price Mode Code", "Price Mode Description"];

  const customOrderKeys = ["priceModeCode", "priceModeDescription"];

  //Functions
  const handleFormClose = () => {
    reset();
    onModalFormClose();
  };

  //UseEffect
  useEffect(() => {
    setCount(data?.totalCount);
  }, [data]);

  useEffect(() => {
    setPage(0);
  }, [search, rowsPerPage]);

  useEffect(() => {
    if (isModalFormOpen) {
      setValue("priceModeItems[0].priceModeId", selectedRowData?.id);
    }
  }, [isModalFormOpen]);

  return (
    <>
      <Box className="commonPageLayout">
        <PageHeaderAdd
          pageTitle={
            <>
              Price Mode Management <Link />
            </>
          }
          setSearch={setSearch}
          removeAdd
          removeArchive
        />

        {isFetching ? (
          <CommonTableSkeleton />
        ) : (
          <CommonTable
            mapData={data?.priceMode}
            editable
            onManageProducts={onModalFormOpen}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            tableHeads={tableHeads}
            customOrderKeys={customOrderKeys}
            count={count}
          />
        )}
      </Box>

      <CommonModalForm
        title="Manage Products"
        open={isModalFormOpen}
        onClose={handleFormClose}
        width="1100px"
      >
        <Box className="priceModeManagementModal">
          <Typography fontSize="1.1rem" fontWeight="700">
            Price Mode Info
          </Typography>

          <Box className="priceModeManagementModal__header">
            <TextField
              label="Price Mode"
              size="small"
              readOnly
              value={selectedRowData?.priceModeCode}
              sx={{ width: "100px", pointerEvents: "none" }}
            />

            <TextField
              label="Price Mode Description"
              size="small"
              readOnly
              value={selectedRowData?.priceModeDescription}
              sx={{ width: "400px", pointerEvents: "none" }}
            />
          </Box>

          <Typography fontSize="1.1rem" fontWeight="700">
            Products List
          </Typography>

          <Box className="priceModeManagementModal__items">
            {fields.map((item, index) => (
              <Box
                key={item.id}
                className="priceModeManagementModal__items__item"
              >
                <ControlledAutocomplete
                  name={`priceModeItems[${index}].itemId`}
                  control={control}
                  options={productData?.items || []}
                  getOptionLabel={(option) => option.itemCode || ""}
                  getOptionDisabled={(option) => {}}
                  disableClearable
                  loading={isProductLoading}
                  disabled={!watch("clientId")}
                  isOptionEqualToValue={(option, value) => true}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      label="Product Code"
                      sx={{ width: "180px" }}
                    />
                  )}
                  onChange={(_, value) => {
                    setValue(
                      `priceModeItems[${index}].itemDescription`,
                      value?.itemDescription
                    );
                    return value;
                  }}
                />

                <Controller
                  control={control}
                  name={`priceModeItems[${index}].itemDescription`}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <TextField
                      label="Item Description"
                      size="small"
                      autoComplete="off"
                      disabled
                      onChange={onChange}
                      onBlur={onBlur}
                      value={value?.toUpperCase() || ""}
                      ref={ref}
                      sx={{ width: "400px" }}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name={`priceModeItems[${index}].price`}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <NumericFormat
                      label="Price"
                      type="text"
                      size="small"
                      customInput={TextField}
                      autoComplete="off"
                      onValueChange={(e) => {
                        onChange(Number(e.value));
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

                <IconButton
                  sx={{ color: "error.main" }}
                  onClick={() => {
                    fields.length <= 1
                      ? showSnackbar(
                          "At least one product is required",
                          "error"
                        )
                      : remove(index);
                  }}
                  tabIndex={-1}
                >
                  <Cancel sx={{ fontSize: "30px" }} />
                </IconButton>
              </Box>
            ))}
          </Box>

          <SecondaryButton
            sx={{ width: "150px" }}
            onClick={() =>
              append({
                priceModeId: selectedRowData?.id,
                itemId: null,
                price: null,
              })
            }
          >
            Add Product
          </SecondaryButton>
        </Box>
      </CommonModalForm>
    </>
  );
}

export default PriceModeManagement;
