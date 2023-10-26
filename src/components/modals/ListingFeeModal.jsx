import React from "react";
import CommonModal from "../CommonModal";
import { Box, Typography } from "@mui/material";
import SecondaryButton from "../SecondaryButton";
import DangerButton from "../DangerButton";
import {
  GoogleMap,
  MarkerF as Marker,
  useLoadScript,
} from "@react-google-maps/api";
import useSnackbar from "../../hooks/useSnackbar";
import {
  MapContainer,
  TileLayer,
  useMap,
} from "https://cdn.esm.sh/react-leaflet";

function ListingFeeModal({ ...otherProps }) {
  const { onClose, ...noOnClose } = otherProps;
  const { showSnackbar } = useSnackbar();

  //Misc Functions
  const handleSubmit = () => {
    // setLatitude("");
    // setLongitude("");
    onClose();
  };

  return (
    <CommonModal {...otherProps}>
      <Box>
        <Typography
          sx={{ fontWeight: "bold", fontSize: "30px", textAlign: "center" }}
        >
          Listing Fee
        </Typography>
        <div id="map"></div>
      </Box>
      <Box
        sx={{ display: "flex", justifyContent: "end", gap: "10px" }}
        className="roleTaggingModal__actions"
      >
        <SecondaryButton onClick={handleSubmit}>Save</SecondaryButton>
        <DangerButton onClick={onClose}>Close</DangerButton>
      </Box>
    </CommonModal>
  );
}

export default ListingFeeModal;
