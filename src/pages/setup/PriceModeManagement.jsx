import { Box, TextField, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "@mui/icons-material";
import CommonTable from "../../components/CommonTable";
import { useGetAllPriceModeQuery } from "../../features/setup/api/priceModeSetupApi";
import CommonTableSkeleton from "../../components/CommonTableSkeleton";
import useDisclosure from "../../hooks/useDisclosure";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { priceModeItemSchema } from "../../schema/schema";
import { useSelector } from "react-redux";
import ControlledAutocomplete from "../../components/ControlledAutocomplete";
import { useLazyGetAllProductsQuery } from "../../features/setup/api/productsApi";
import useSnackbar from "../../hooks/useSnackbar";
import { NumericFormat } from "react-number-format";
import CommonDialog from "../../components/CommonDialog";
import {
  useDeletePriceModeItemMutation,
  useGetAllItemsByPriceModeIdQuery,
  usePostItemsToPriceModeMutation,
} from "../../features/setup/api/priceModeItemsApi";
import CommonDrawer from "../../components/CommonDrawer";
import PriceChangeDrawer from "../../components/drawers/PriceChangeDrawer";
import PriceDetailsModal from "../../components/modals/PriceDetailsModal";
import PageHeaderAddButtonSearch from "../../components/PageHeaderAddButtonSearch";
import moment from "moment";
import ExportPriceModal from "../../components/modals/ExportPriceModal";
import {
  decryptString,
  handleCatchErrorMessage,
} from "../../utils/CustomFunctions";
import axios from "axios";

function PriceModeManagement() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);
  const [exportDateTime, setExportDateTime] = useState(moment());
  const [isExportLoading, setIsExportLoading] = useState(false);

  const selectedRowData = useSelector((state) => state.selectedRow.value);
  const snackbar = useSnackbar();

  //Disclosures
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();

  const {
    isOpen: isPriceChangeOpen,
    onOpen: onPriceChangeOpen,
    onClose: onPriceChangeClose,
  } = useDisclosure();

  const {
    isOpen: isPriceDetailsOpen,
    onOpen: onPriceDetailsOpen,
    onClose: onPriceDetailsClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const {
    isOpen: isExportOpen,
    onOpen: onExportOpen,
    onClose: onExportClose,
  } = useDisclosure();

  //React Hook Form
  const {
    handleSubmit,
    formState: { isValid, isDirty },
    setValue,
    reset,
    control,
    watch,
  } = useForm({
    resolver: yupResolver(priceModeItemSchema.schema),
    mode: "onChange",
    defaultValues: priceModeItemSchema.defaultValues,
  });

  //React Hook Form Watch
  const watchPriceModeId = watch("priceModeId");

  //Axios
  const exportPriceChanges = async () => {
    const res = await axios.get(
      `${
        import.meta.env.VITE_BASEURL
      }price-change/export?EffectivityDate=${moment(exportDateTime).format(
        "YYYY-MM-DDTHH:mm:ss"
      )}`,
      {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${decryptString(
            sessionStorage.getItem("token")
          )}`,
          "Content-Type": "application/json", // Example content type, adjust as necessary
        },
      }
    );

    return res.data;
  };

  //RTK Query
  const { data: priceModeData, isFetching: isPriceModeFetching } =
    useGetAllPriceModeQuery({
      Status: true,
      PageNumber: 1,
      PageSize: 1000,
    });
  const [postItemsToPriceMode, { isLoading: isTaggingLoading }] =
    usePostItemsToPriceModeMutation();
  const [deletePriceModeItem, { isLoading: isDeleteLoading }] =
    useDeletePriceModeItemMutation();

  const [
    triggerProducts,
    { data: productData, isFetching: isProductFetching },
  ] = useLazyGetAllProductsQuery();

  const { data: priceModeItemsData, isFetching: isPriceModeItemsFetching } =
    useGetAllItemsByPriceModeIdQuery({
      Search: search,
      PageNumber: page + 1,
      PageSize: rowsPerPage,
    });

  // Constants
  const tableHeads = [
    // "ID",
    "Product Code",
    "Item Description",
    "UOM",
    "Price",
    "Price Mode",
    "Price Details",
  ];

  const customOrderKeys = [
    "itemCode",
    "itemDescription",
    "uom",
    "currentPrice",
    "priceModeCode",
  ];

  const pesoArray = ["currentPrice"];

  //Functions
  const onSubmit = async (data) => {
    const transformedData = {
      priceModeId: data?.priceModeId?.id,
      itemId: data?.itemId?.id,
      price: data?.price,
    };

    try {
      await postItemsToPriceMode(transformedData).unwrap();

      handleDrawerClose();
      snackbar({
        message: "Product successfully tagged to price mode",
        variant: "success",
      });
    } catch (error) {
      if (error?.data?.error?.message) {
        snackbar({ message: error?.data?.error?.message, variant: "error" });
      } else {
        snackbar({
          message: "Error tagging product to price mode",
          variant: "error",
        });
      }
    }
  };

  const handleDelete = async () => {
    try {
      await deletePriceModeItem({
        id: selectedRowData?.priceModeItemId,
      }).unwrap();
      snackbar({ message: "Item deleted successfully", variant: "success" });
      onDeleteClose();
    } catch (error) {
      if (error?.data?.error?.message) {
        snackbar({ message: error?.data?.error?.message, variant: "error" });
      } else {
        snackbar({ message: "Error deleting item", variant: "error" });
      }
      onDeleteClose();
    }
  };

  const handleDrawerClose = () => {
    onDrawerClose();
    reset();
  };

  const onExport = async () => {
    try {
      setIsExportLoading(true);

      const excelData = await exportPriceChanges();

      const excelBlob = new Blob([excelData], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = URL.createObjectURL(excelBlob);

      const dateFormatted = moment(exportDateTime)
        .format("MM-DD-yy")
        .replace(/-/g, "")
        .replace("20", "");

      const a = document.createElement("a");
      a.href = url;
      a.download = `Arcana_Prices_${dateFormatted}.xlsx`;
      a.click();
    } catch (error) {
      console.log(error);
      snackbar({ message: handleCatchErrorMessage(error), variant: "error" });
    }

    setIsExportLoading(false);
  };

  // UseEffect;
  useEffect(() => {
    if (watchPriceModeId) {
      triggerProducts(
        {
          priceModeId: watchPriceModeId?.id,
          Status: true,
          page: 1,
          pageSize: 1000,
        },
        { preferCacheValue: true }
      );
    }
  }, [watchPriceModeId, triggerProducts]);

  useEffect(() => {
    setCount(priceModeItemsData?.totalCount);
  }, [priceModeItemsData]);

  useEffect(() => {
    setPage(0);
  }, [search, rowsPerPage]);

  return (
    <>
      <Box className="commonPageLayout">
        <PageHeaderAddButtonSearch
          pageTitle={
            <>
              Price Mode Management <Link />
            </>
          }
          setSearch={setSearch}
          onOpen={onDrawerOpen}
          removeArchive
          secondButtonTitle="Export"
          secondButtonOnClick={onExportOpen}
        />

        {isPriceModeItemsFetching ? (
          <CommonTableSkeleton evenLesserCompact />
        ) : (
          <CommonTable
            evenLesserCompact
            mapData={priceModeItemsData?.priceModeItems}
            onRemove={onDeleteOpen}
            onPriceChange={onPriceChangeOpen}
            onViewMoreConstant={onPriceDetailsOpen}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            tableHeads={tableHeads}
            customOrderKeys={customOrderKeys}
            pesoArray={pesoArray}
            count={count}
          />
        )}
      </Box>

      <CommonDrawer
        drawerHeader="Tag Product to Price Mode"
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        disableSubmit={!isValid || !isDirty}
        onSubmit={handleSubmit(onSubmit)}
        isLoading={isTaggingLoading}
      >
        <ControlledAutocomplete
          name="priceModeId"
          control={control}
          options={priceModeData?.priceMode || []}
          getOptionLabel={(option) => option.priceModeCode || ""}
          disableClearable
          loading={isPriceModeFetching}
          isOptionEqualToValue={() => true}
          renderInput={(params) => (
            <TextField {...params} size="small" label="Price Mode" />
          )}
          onChange={(_, value) => {
            setValue("itemId", null);
            setValue("itemDescription", "");
            setValue("uom", "");
            setValue("price", null);
            return value;
          }}
        />

        <ControlledAutocomplete
          name="itemId"
          control={control}
          options={isProductFetching ? [] : productData?.items || []}
          getOptionLabel={(option) => option.itemCode || ""}
          disabled={!watch("priceModeId")}
          disableClearable
          loading={isProductFetching}
          isOptionEqualToValue={() => true}
          renderInput={(params) => (
            <TextField {...params} size="small" label="Product Code" />
          )}
          onChange={(_, value) => {
            setValue("itemDescription", value?.itemDescription);
            setValue("uom", value?.uom);
            return value;
          }}
        />

        <Controller
          control={control}
          name="itemDescription"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Tooltip title={value?.toUpperCase() || ""} placement="top">
              <TextField
                label="Item Description"
                size="small"
                autoComplete="off"
                disabled
                onChange={onChange}
                onBlur={onBlur}
                value={value?.toUpperCase() || ""}
                ref={ref}
              />
            </Tooltip>
          )}
        />

        <Controller
          control={control}
          name="uom"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <TextField
              label="Unit of Measurement"
              size="small"
              autoComplete="off"
              disabled
              onChange={onChange}
              onBlur={onBlur}
              value={value?.toUpperCase() || ""}
              ref={ref}
            />
          )}
        />

        <Controller
          control={control}
          name="price"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <NumericFormat
              label="Price"
              type="text"
              size="small"
              customInput={TextField}
              autoComplete="off"
              onValueChange={(e) => {
                e.value !== "" && onChange(Number(e.value));
              }}
              onBlur={onBlur}
              value={value || ""}
              inputRef={ref}
              disabled={!watch("itemId")}
              thousandSeparator=","
              allowNegative={false}
              allowLeadingZeros={false}
              prefix="₱"
            />
          )}
        />
      </CommonDrawer>

      <PriceChangeDrawer
        open={isPriceChangeOpen}
        onClose={onPriceChangeClose}
      />

      <PriceDetailsModal
        data={priceModeItemsData?.priceModeItems}
        isFetching={isPriceModeItemsFetching}
        open={isPriceDetailsOpen}
        onClose={onPriceDetailsClose}
      />

      <ExportPriceModal
        open={isExportOpen}
        onClose={onExportClose}
        onExport={onExport}
        dateTime={exportDateTime}
        setDateTime={setExportDateTime}
        isExportLoading={isExportLoading}
      />

      <CommonDialog
        open={isDeleteOpen}
        onClose={onDeleteClose}
        onYes={handleDelete}
        isLoading={isDeleteLoading}
      >
        Are you sure you want to remove this item?
      </CommonDialog>
    </>
  );
}

export default PriceModeManagement;
