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

function PinLocationModal({
  latitude,
  setLatitude,
  longitude,
  setLongitude,
  ...otherProps
}) {
  const { onClose, ...noOnClose } = otherProps;
  const { showSnackbar } = useSnackbar();

  //Google Maps Functions
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  });

  const getLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocations.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          showSnackbar(error.data.messages[0], "error");
        }
      );
    } else {
      showSnackbar("Geolocation is not supported by this browser.", "error");
    }
  };

  //Misc Functions
  const handleSubmit = () => {
    setLatitude("");
    setLongitude("");
    onClose();
  };

  return (
    <CommonModal {...noOnClose}>
      <Box>
        <Typography
          sx={{ fontWeight: "bold", fontSize: "30px", textAlign: "center" }}
        >
          MAMAYA KA NALANG
        </Typography>
        <div id="map"></div>
      </Box>
      {/* <Box>
        {!isLoaded ? (
          <div>Loading...</div>
        ) : (
          <GoogleMap
            zoom={15} // Adjust the zoom level as needed
            center={{ lat: latitude, lng: longitude }}
            // mapContainerClassName="map-container"
            // mapContainerStyle={{ height: "90%", width: "100%" }}
          >
            <Marker
              position={{ lat: latitude, lng: longitude }}
              clickable
              title="This is your current location"
            />
          </GoogleMap>
        )}
      </Box> */}
      {/* <Box sx={{ display: "flex" }}>
        {!latitude || !longitude ? (
          <SecondaryButton>Get Location</SecondaryButton>
        ) : (
          <SecondaryButton>
            This location has been registered. Click here againn to close map
          </SecondaryButton>
        )}
      </Box> */}
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

export default PinLocationModal;
