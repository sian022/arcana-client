import { Box, TextField, Typography, debounce } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  useGetAllApprovedProspectsQuery,
  useGetAllReleasedProspectsQuery,
  usePatchVoidProspectMutation,
} from "../../../features/prospect/api/prospectApi";
import CommonTableSkeleton from "../../../components/CommonTableSkeleton";
import CommonTable from "../../../components/CommonTable";
import { useDispatch, useSelector } from "react-redux";
import { setBadge } from "../../../features/prospect/reducers/badgeSlice";
import useDisclosure from "../../../hooks/useDisclosure";
import RegisterRegularForm from "./RegisterRegularForm";
import PrintFreebiesModal from "../../../components/modals/PrintFreebiesModal";
import CommonDialog from "../../../components/CommonDialog";
import { notificationApi } from "../../../features/notification/api/notificationApi";
import useSnackbar from "../../../hooks/useSnackbar";
import SearchVoidMixin from "../../../components/mixins/SearchVoidMixin";

function Released() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(0);
  const [registrationStatus, setRegistrationStatus] = useState("");

  const [voidConfirmBox, setVoidConfirmBox] = useState("");

  const dispatch = useDispatch();
  const badges = useSelector((state) => state.badge.value);
  const selectedStoreType = useSelector(
    (state) => state.selectedStoreType.value
  );
  const { showSnackbar } = useSnackbar();

  const selectedRowData = useSelector((state) => state.selectedRow.value);

  //Disclosures
  const {
    isOpen: isVoidOpen,
    onOpen: onVoidOpen,
    onClose: onVoidClose,
  } = useDisclosure();

  //Constants
  const tableHeads = [
    "Business Name",
    "Owner's Name",
    "Business Type",
    "Contact Number",
  ];

  const customOrderKeys = [
    "businessName",
    "ownersName",
    "storeType",
    "phoneNumber",
  ];

  //Disclosures
  const {
    isOpen: isRegisterOpen,
    onOpen: onRegisterOpen,
    onClose: onRegisterClose,
  } = useDisclosure();

  const {
    isOpen: isPrintOpen,
    onOpen: onPrintOpen,
    onClose: onPrintClose,
  } = useDisclosure();

  //RTK Query
  const { data, isLoading, isFetching } = useGetAllApprovedProspectsQuery({
    Search: search,
    Status: status,
    PageNumber: page + 1,
    PageSize: rowsPerPage,
    StoreType: selectedStoreType !== "Main" ? selectedStoreType : "",
    // WithFreebies: true,
    FreebieStatus: registrationStatus !== "Voided" ? "Released" : "",
    RegistrationStatus:
      registrationStatus === "Voided"
        ? registrationStatus
        : "Pending registration",
  });

  const [patchVoidProspect, { isLoading: isVoidLoading }] =
    usePatchVoidProspectMutation();

  //Misc Functions
  const debouncedSetSearch = debounce((value) => {
    setSearch(value);
  }, 200);

  const onVoidSubmit = async () => {
    try {
      await patchVoidProspect(selectedRowData?.id).unwrap();
      onVoidClose();
      showSnackbar(`Prospect voided successfully`, "success");
      dispatch(notificationApi.util.invalidateTags(["Notification"]));
    } catch (error) {
      console.log(error);
      if (error?.data?.error?.message) {
        showSnackbar(error?.data?.error?.message, "error");
      } else {
        showSnackbar("Error voiding prospect", "error");
      }
    }
  };

  ///UseEffects
  useEffect(() => {
    setCount(data?.totalCount);
    dispatch(setBadge({ ...badges, released: data?.totalCount }));
  }, [data]);

  return (
    <>
      <Box>
        <SearchVoidMixin
          setSearch={setSearch}
          setStatus={setRegistrationStatus}
          status={registrationStatus}
        />
        {/* <TextField
          type="search"
          size="small"
          label="Search"
          onChange={(e) => {
            debouncedSetSearch(e.target.value);
          }}
          autoComplete="off"
          // sx={{ margin: "15px" }}
          sx={{ mb: "15px", mt: "-5px" }}
        /> */}

        {isFetching ? (
          <CommonTableSkeleton compact />
        ) : (
          <CommonTable
            mapData={data?.requestedProspect}
            tableHeads={tableHeads}
            customOrderKeys={customOrderKeys}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            includeActions
            onRegularRegister={
              registrationStatus !== "Voided" && onRegisterOpen
            }
            onVoid={registrationStatus !== "Voided" && onVoidOpen}
            setRowsPerPage={setRowsPerPage}
            count={count}
            status={status}
            compact
            onPrintFreebies={onPrintOpen}
          />
        )}
      </Box>

      {/* <AttachmentsProvider> */}
      <RegisterRegularForm open={isRegisterOpen} onClose={onRegisterClose} />

      <PrintFreebiesModal
        open={isPrintOpen}
        // open={true}
        onClose={onPrintClose}
      />
      {/* </AttachmentsProvider> */}

      <CommonDialog
        open={isVoidOpen}
        onClose={onVoidClose}
        isLoading={isVoidLoading}
        onYes={onVoidSubmit}
        disableYes={voidConfirmBox !== selectedRowData?.businessName}
      >
        Are you sure you want to void prospect{" "}
        <span style={{ fontWeight: "bold", textTransform: "uppercase" }}>
          {selectedRowData?.businessName}
        </span>
        ? <br />
        <span style={{ textTransform: "uppercase", fontWeight: "bold" }}>
          (This action cannot be reversed)
        </span>
        <br />
        <Box
          sx={{ display: "flex", flexDirection: "column", marginTop: "20px" }}
        >
          <Typography sx={{ textAlign: "left", fontWeight: "bold" }}>
            To confirm, type "{selectedRowData?.businessName}" in the box below
          </Typography>
          <TextField
            size="small"
            // fullWidth
            autoComplete="off"
            onChange={(e) => {
              setVoidConfirmBox(e.target.value);
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "error.main", // Set your desired border color here
                },
              },
            }}
          />
        </Box>
      </CommonDialog>
    </>
  );
}

export default Released;
