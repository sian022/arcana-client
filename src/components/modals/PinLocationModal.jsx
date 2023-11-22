import React, { useState } from "react";
import CommonModal from "../CommonModal";
import { Box, CircularProgress, Typography } from "@mui/material";
import SecondaryButton from "../SecondaryButton";
import DangerButton from "../DangerButton";
import useSnackbar from "../../hooks/useSnackbar";
import {
  GoogleMap,
  LoadScript,
  Marker,
  useJsApiLoader,
  useLoadScript,
} from "@react-google-maps/api";

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

  const mapStyles = {
    height: "400px",
    width: "100%",
  };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    // googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  });

  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(rdfPosition);
    map.fitBounds(bounds);

    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  //Google Maps Functions

  const handleSubmit = () => {
    // setLatitude(markerPosition.lat);
    // setLongitude(markerPosition.lng);
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

      <Box
        sx={{
          marginBottom: "20px",
          height: "400px",
          width: "600px",
        }}
      >
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={mapStyles}
            center={rdfPosition}
            zoom={10}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            {/* Child components, such as markers, info windows, etc. */}
            <></>
          </GoogleMap>
        ) : (
          <></>
        )}
        {/* <LoadScript
          googleMapsApiKey={import.meta.env.VITE_GOOGLE_API_KEY}
          // loadingElement={() => <CircularProgress sx={{ width: "300px" }} />}
        >
          <GoogleMap
            mapContainerStyle={mapStyles}
            zoom={16}
            center={rdfPosition}
            onClick={(event) => setMarkerPosition(event.latLng.toJSON())}
          >
            <Marker
              position={markerPosition}
              draggable={true}
              onDragEnd={(e) => setMarkerPosition(e.latLng.toJSON())}
            />
          </GoogleMap>
        </LoadScript> */}
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
