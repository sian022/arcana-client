import React, { useState } from "react";
import CommonModal from "../CommonModal";
import { Box, CircularProgress, Typography } from "@mui/material";
import SecondaryButton from "../SecondaryButton";
import DangerButton from "../DangerButton";
import useSnackbar from "../../hooks/useSnackbar";
// import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import {
  GoogleMap,
  LoadScript,
  Marker,
  useJsApiLoader,
  useLoadScript,
} from "@react-google-maps/api";
// import {
//   APIProvider,
//   AdvancedMarker,
//   Map,
//   Marker,
//   Pin,
// } from "@vis.gl/react-google-maps";

function PinLocationModal({
  latitude: initialLatitude,
  setLatitude,
  longitude: initialLongitude,
  setLongitude,
  ...otherProps
}) {
  const { onClose, ...noOnClose } = otherProps;
  const { showSnackbar } = useSnackbar();

  const [markerPosition, setMarkerPosition] = useState({
    lat: initialLatitude || 0,
    lng: initialLongitude || 0,
  });

  const rdfPosition = { lat: 15.095278923422851, lng: 120.6081880242793 };

  const handleMapClick = (event) => {};

  const mapStyles = {
    height: "400px",
    width: "100%",
  };

  //Google Maps Functions

  const handleSubmit = () => {
    setLatitude(markerPosition.lat);
    setLongitude(markerPosition.lng);
    onClose();
  };

  return (
    <CommonModal width={"auto"} {...noOnClose}>
      <Typography
        sx={{
          fontWeight: "bold",
          fontSize: "20px",
          marginBottom: "10px",
          // textAlign: "center",
        }}
      >
        Pin Location
      </Typography>
      {/* <APIProvider apiKey={import.meta.env.VITE_GOOGLE_API_KEY}>
        <Box
          sx={{
            marginBottom: "20px",
            height: "400px",
            width: "600px",
          }}
        >
          <Map
            zoom={15}
            center={rdfPosition}
            gestureHandling={"greedy"}
            disableDefaultUI={true}
          >
            <Marker position={rdfPosition}>
              <Pin
                background={"#FBBC04"}
                glyphColor={"#000"}
                borderColor={"#000"}
              />
            </Marker>
          </Map>
        </Box>
      </APIProvider> */}

      <Box
        sx={{
          marginBottom: "20px",
          height: "400px",
          width: "600px",
        }}
      >
        <LoadScript
          googleMapsApiKey={import.meta.env.VITE_GOOGLE_API_KEY}
          loadingElement={() => <CircularProgress />}
        >
          <GoogleMap
            mapContainerStyle={mapStyles}
            zoom={20}
            center={rdfPosition}
            onClick={(event) => setMarkerPosition(event.latLng.toJSON())}
          >
            <Marker
              position={markerPosition}
              draggable={true}
              onDragEnd={(e) => setMarkerPosition(e.latLng.toJSON())}
            />
          </GoogleMap>
        </LoadScript>
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

export default PinLocationModal;
