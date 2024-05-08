import { Box, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import PageHeaderAdd from "../../components/PageHeaderAdd";
import CommonTable from "../../components/CommonTable";
import CommonDrawer from "../../components/CommonDrawer";
import useDisclosure from "../../hooks/useDisclosure";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { variableDiscountSchema } from "../../schema/schema";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import {
  useDeleteVariableDiscountMutation,
  useGetAllDiscountTypesQuery,
  usePostDiscountTypeMutation,
  usePutDiscountTypeMutation,
} from "../../features/setup/api/discountTypeApi";
import { useSelector } from "react-redux";
import { NumericFormat } from "react-number-format";
import { Label } from "@mui/icons-material";
import useConfirm from "../../hooks/useConfirm";
import useSnackbar from "../../hooks/useSnackbar";
import { handleCatchErrorMessage } from "../../utils/CustomFunctions";

function VariableDiscount() {
  const [drawerMode, setDrawerMode] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(null);

  //Hooks
  const confirm = useConfirm();
  const snackbar = useSnackbar();
  const selectedRowData = useSelector((state) => state.selectedRow.value);

  // Drawer Disclosures
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();

  // Constants
  const customOrderKeys = [
    "minimumAmount",
    "maximumAmount",
    "minimumPercentage",
    "maximumPercentage",
  ];
  const pesoArray = ["minimumAmount", "maximumAmount"];
  const percentageArray = ["minimumPercentage", "maximumPercentage"];

  //React Hook Form
  const {
    handleSubmit,
    formState: { isValid },
    setValue,
    reset,
    control,
  } = useForm({
    resolver: yupResolver(variableDiscountSchema.schema),
    mode: "onChange",
    defaultValues: variableDiscountSchema.defaultValues,
  });

  //RTK Query
  const [postDiscountType, { isLoading: isAddLoading }] =
    usePostDiscountTypeMutation();
  const { data, isFetching } = useGetAllDiscountTypesQuery({
    Search: search,
    Status: true,
    PageNumber: page + 1,
    PageSize: rowsPerPage,
  });
  const [putDiscountType, { isLoading: isUpdateLoading }] =
    usePutDiscountTypeMutation();
  const [deleteVariableDiscount] = useDeleteVariableDiscountMutation();

  //Drawer Functions
  const onDrawerSubmit = async (data) => {
    try {
      if (drawerMode === "add") {
        await postDiscountType(data).unwrap();
      } else if (drawerMode === "edit") {
        await putDiscountType(data).unwrap();
      }

      onDrawerClose();
      reset();
      snackbar({
        message: `Variable Discount ${
          drawerMode === "add" ? "added" : "updated"
        } successfully`,
        variant: "success",
      });
    } catch (error) {
      if (error.isConfirmed) {
        snackbar({ message: handleCatchErrorMessage(error), variant: "error" });
      }
    }
  };

  const onRemove = async () => {
    try {
      await confirm({
        children: (
          <>
            Are you sure you want to delete amount range{" "}
            <span style={{ fontWeight: "bold", textTransform: "uppercase" }}>
              <br />₱{selectedRowData?.minimumAmount} - ₱
              {selectedRowData?.maximumAmount}
            </span>
            ?
          </>
        ),
        question: true,
        callback: () => deleteVariableDiscount(selectedRowData?.id).unwrap(),
      });

      snackbar({
        message: "Variable discount removed successfully",
        variant: "success",
      });
    } catch (error) {
      if (error.isConfirmed) {
        snackbar({ message: handleCatchErrorMessage(error), variant: "error" });
      }
    }
  };

  const handleAddOpen = () => {
    setDrawerMode("add");
    onDrawerOpen();
  };

  const handleDrawerClose = () => {
    reset();
    onDrawerClose();
  };

  //Constants
  const disableActions = ["delete"];

  //UseEffect
  useEffect(() => {
    setCount(data?.totalCount);
  }, [data]);

  useEffect(() => {
    setPage(0);
  }, [search, rowsPerPage]);

  useEffect(() => {
    if (isDrawerOpen && drawerMode === "add") {
      if (!data?.discount || data?.discount?.length === 0) {
        setValue("minimumAmount", 1);
      } else {
        setValue(
          "minimumAmount",
          Math.floor(
            data?.discount[data?.discount?.length - 1]?.maximumAmount
          ) + 1
        );
      }

      if (!data?.discount || data?.discount?.length === 0) {
        setValue("minimumPercentage", 1);
      } else {
        setValue(
          "minimumPercentage",
          Math.floor(
            data?.discount[data?.discount?.length - 1]?.maximumPercentage * 100
          ) + 1
        );
      }
    }
  }, [isDrawerOpen, drawerMode, data, setValue]);

  return (
    <Box className="commonPageLayout">
      <PageHeaderAdd
        pageTitle={
          <>
            Variable Discount <Label />
          </>
        }
        onOpen={handleAddOpen}
        setSearch={setSearch}
        removeArchive
      />
      {isFetching ? (
        <CommonTableSkeleton evenLesserCompact />
      ) : (
        <CommonTable
          evenLesserCompact
          mapData={data?.discount}
          customOrderKeys={customOrderKeys}
          pesoArray={pesoArray}
          percentageArray={percentageArray}
          onRemove={onRemove}
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          count={count}
          status={status}
          disableActions={
            selectedRowData?.id !==
              data?.discount?.[data?.discount?.length - 1]?.id && disableActions
          }
        />
      )}

      <CommonDrawer
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        drawerHeader={
          (drawerMode === "add" ? "Add" : "Edit") + " Variable Discount"
        }
        onSubmit={handleSubmit(onDrawerSubmit)}
        disableSubmit={!isValid}
        isLoading={drawerMode === "add" ? isAddLoading : isUpdateLoading}
      >
        <Controller
          control={control}
          name={"minimumAmount"}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <NumericFormat
              label="Minimum Amount (₱)"
              type="text"
              size="small"
              customInput={TextField}
              autoComplete="off"
              onValueChange={(e) => {
                onChange(Number(e.value));
              }}
              allowNegative={false}
              decimalScale={0}
              onBlur={onBlur}
              value={value || ""}
              inputRef={ref}
              thousandSeparator=","
              disabled
            />
          )}
        />

        <Controller
          control={control}
          name={"maximumAmount"}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <NumericFormat
              label="Maximum Amount (₱)"
              type="text"
              size="small"
              customInput={TextField}
              autoComplete="off"
              allowNegative={false}
              decimalScale={0}
              onValueChange={(e) => {
                onChange(Number(e.value));
                setValue(
                  "maximumAmountUpperBoundary",
                  parseFloat(e.value) + 0.999
                );
              }}
              onBlur={onBlur}
              value={value || ""}
              inputRef={ref}
              thousandSeparator=","
            />
          )}
        />

        <Controller
          control={control}
          name={"minimumPercentage"}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <NumericFormat
              label="Minimum Percentage (%)"
              type="text"
              size="small"
              customInput={TextField}
              autoComplete="off"
              onValueChange={(e) => {
                onChange(Number(e.value));
              }}
              onBlur={onBlur}
              value={value || ""}
              inputRef={ref}
              thousandSeparator=","
              allowNegative={false}
              decimalScale={0}
              disabled
            />
          )}
        />

        <Controller
          control={control}
          name={"maximumPercentage"}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <NumericFormat
              label="Maximum Percentage (%)"
              type="text"
              size="small"
              customInput={TextField}
              autoComplete="off"
              onValueChange={(e) => {
                onChange(Number(e.value));
              }}
              onBlur={onBlur}
              value={value || ""}
              inputRef={ref}
              thousandSeparator=","
              allowNegative={false}
              decimalScale={0}
            />
          )}
        />
      </CommonDrawer>
    </Box>
  );
}

export default VariableDiscount;
