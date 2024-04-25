import {
  Box,
  Button,
  IconButton,
  Input,
  Radio,
  Typography,
} from "@mui/material";
import { useContext, useRef, useState } from "react";
import {
  AddAPhoto,
  Assignment,
  Business,
  CameraAlt,
  Create,
  PermIdentity,
  Visibility,
} from "@mui/icons-material";
import { AttachmentsContext } from "../../../context/AttachmentsContext";
import SignatureCanvasModal from "../../../components/modals/SignatureCanvasModal";
import useDisclosure from "../../../hooks/useDisclosure";
import { base64ToBlob } from "../../../utils/CustomFunctions";
import ViewPhotoModal from "../../../components/modals/ViewPhotoModal";

function Attachments() {
  const {
    requirementsMode,
    setRequirementsMode,
    ownersRequirements,
    setOwnersRequirements,
    ownersRequirementsIsLink,
    setOwnersRequirementsIsLink,
    representativeRequirements,
    setRepresentativeRequirements,
    representativeRequirementsIsLink,
    setRepresentativeRequirementsIsLink,
  } = useContext(AttachmentsContext);

  const [currentViewPhoto, setCurrentViewPhoto] = useState(null);
  const [currentViewPhotoLabel, setCurrentViewPhotoLabel] = useState("");
  const [currentViewPhotoLabelCamel, setCurrentViewPhotoLabelCamel] =
    useState("");

  const ownerRequirementRefs = {
    signature: useRef(),
    storePhoto: useRef(),
    businessPermit: useRef(),
    photoIdOwner: useRef(),
  };

  const representativeRequirementRefs = {
    signature: useRef(),
    storePhoto: useRef(),
    businessPermit: useRef(),
    photoIdOwner: useRef(),
    photoIdRepresentative: useRef(),
    authorizationLetter: useRef(),
  };

  //Disclosures
  const {
    isOpen: isCanvasOpen,
    onOpen: onCanvasOpen,
    onClose: onCanvasClose,
  } = useDisclosure();

  const {
    isOpen: isViewPhotoOpen,
    onOpen: onViewPhotoOpen,
    onClose: onViewPhotoClose,
  } = useDisclosure();

  //Handler Functions
  const handleSetSignature = (signature) => {
    if (requirementsMode === "owner") {
      setOwnersRequirements((prev) => ({
        ...prev,
        signature: signature,
      }));
    } else if (requirementsMode === "representative") {
      setRepresentativeRequirements((prev) => ({
        ...prev,
        signature: signature,
      }));
    }
  };

  const handleViewPhoto = (file, label, camel) => {
    onViewPhotoOpen();
    setCurrentViewPhoto(file);
    setCurrentViewPhotoLabel(label);
    setCurrentViewPhotoLabelCamel(camel);
  };

  return (
    <>
      <Box className="attachmentsContainer">
        <Box className="attachments">
          <Box
            className={
              "attachments__column" +
              (requirementsMode !== "owner" ? " overlay" : "")
            }
          >
            <Typography className="attachments__column__title">
              Owner&lsquo;s Requirements
            </Typography>
            <Box className="attachments__column__content">
              <Box className="attachments__column__content__item">
                <Typography>Customer&lsquo;s Signature</Typography>
                <Button
                  className={ownersRequirements["signature"] && "buttonActive"}
                  onClick={
                    onCanvasOpen
                    // () => {ownerRequirementRefs["signature"].current.click()}
                  }
                >
                  <Create />
                </Button>
                {ownersRequirements["signature"] && (
                  <IconButton
                    className="attachments__column__content__item__viewOwner"
                    onClick={() => {
                      let convertedSignature;
                      if (!ownersRequirementsIsLink["signature"]) {
                        convertedSignature = base64ToBlob(
                          ownersRequirements["signature"]
                        );
                      }

                      handleViewPhoto(
                        ownersRequirementsIsLink["signature"]
                          ? ownersRequirements["signature"]
                          : convertedSignature,
                        "Signature",
                        "signature"
                      );
                    }}
                  >
                    <Visibility />
                  </IconButton>
                )}
              </Box>
              <Box className="attachments__column__content__item">
                <Typography>Store Photo</Typography>
                <Button
                  className={ownersRequirements["storePhoto"] && "buttonActive"}
                  onClick={() => {
                    ownerRequirementRefs["storePhoto"].current.click();
                  }}
                >
                  <AddAPhoto />
                </Button>
                {ownersRequirements["storePhoto"] && (
                  <IconButton
                    className="attachments__column__content__item__viewOwner"
                    onClick={() => {
                      handleViewPhoto(
                        ownersRequirements["storePhoto"],
                        "Store Photo",
                        "storePhoto"
                      );
                    }}
                  >
                    <Visibility />
                  </IconButton>
                )}
              </Box>
              <Box className="attachments__column__content__item">
                <Typography>Business Permit</Typography>
                <Button
                  className={
                    ownersRequirements["businessPermit"] && "buttonActive"
                  }
                  onClick={() => {
                    ownerRequirementRefs["businessPermit"].current.click();
                  }}
                >
                  <Business />
                </Button>
                {ownersRequirements["businessPermit"] && (
                  <IconButton
                    className="attachments__column__content__item__viewOwner"
                    onClick={() => {
                      handleViewPhoto(
                        ownersRequirements["businessPermit"],
                        "Business Permit",
                        "businessPermit"
                      );
                    }}
                  >
                    <Visibility />
                  </IconButton>
                )}
              </Box>
              <Box className="attachments__column__content__item">
                <Typography>Valid ID of Owner</Typography>
                <Button
                  className={
                    ownersRequirements["photoIdOwner"] && "buttonActive"
                  }
                  onClick={() => {
                    ownerRequirementRefs["photoIdOwner"].current.click();
                  }}
                >
                  <PermIdentity />
                </Button>
                {ownersRequirements["photoIdOwner"] && (
                  <IconButton
                    className="attachments__column__content__item__viewOwner"
                    onClick={() => {
                      handleViewPhoto(
                        ownersRequirements["photoIdOwner"],
                        "Valid ID of Owner",
                        "photoIdOwner"
                      );
                    }}
                  >
                    <Visibility />
                  </IconButton>
                )}
              </Box>
            </Box>
            <Box className="attachments__column__radio">
              <Radio
                value={"owner"}
                checked={requirementsMode === "owner"}
                onChange={(e) => {
                  setRequirementsMode(e.target.value);
                }}
                disabled
              />
            </Box>
          </Box>

          <Box
            className={
              "attachments__column" +
              (requirementsMode !== "representative" ? " overlay" : "")
            }
          >
            <Typography className="attachments__column__title">
              Representative&lsquo;s Requirements
            </Typography>
            <Box className="attachments__column__content">
              <Box className="attachments__column__content__item">
                <Typography>Representative&lsquo;s Signature</Typography>
                <Button
                  className={
                    representativeRequirements["signature"] && "buttonActive"
                  }
                  onClick={
                    onCanvasOpen
                    // () => {representativeRequirementRefs["signature"].current.click()}
                  }
                >
                  <Create />
                </Button>
                {representativeRequirements["signature"] && (
                  <IconButton
                    className="attachments__column__content__item__viewRepresentative"
                    onClick={() => {
                      let convertedSignature;
                      if (!representativeRequirementsIsLink["signature"]) {
                        convertedSignature = base64ToBlob(
                          representativeRequirements["signature"]
                        );
                      }

                      handleViewPhoto(
                        representativeRequirementsIsLink["signature"]
                          ? representativeRequirements["signature"]
                          : convertedSignature,
                        "Signature",
                        "signature"
                      );
                    }}
                    // onClick={() => {
                    //   const convertedSignature = base64ToBlob(
                    //     representativeRequirements["signature"]
                    //   );
                    //   handleViewPhoto(
                    //     convertedSignature,
                    //     "Signature",
                    //     "signature"
                    //   );
                    // }}
                  >
                    <Visibility />
                  </IconButton>
                )}
              </Box>
              <Box className="attachments__column__content__item">
                <Typography>Store Photo</Typography>
                <Button
                  className={
                    representativeRequirements["storePhoto"] && "buttonActive"
                  }
                  onClick={() => {
                    representativeRequirementRefs["storePhoto"].current.click();
                  }}
                >
                  <AddAPhoto />
                </Button>
                {representativeRequirements["storePhoto"] && (
                  <IconButton
                    className="attachments__column__content__item__viewRepresentative"
                    onClick={() => {
                      handleViewPhoto(
                        representativeRequirements["storePhoto"],
                        "Store Photo",
                        "storePhoto"
                      );
                    }}
                  >
                    <Visibility />
                  </IconButton>
                )}
              </Box>
              <Box className="attachments__column__content__item">
                <Typography>Business Permit</Typography>
                <Button
                  className={
                    representativeRequirements["businessPermit"] &&
                    "buttonActive"
                  }
                  onClick={() => {
                    representativeRequirementRefs[
                      "businessPermit"
                    ].current.click();
                  }}
                >
                  <Business />
                </Button>
                {representativeRequirements["businessPermit"] && (
                  <IconButton
                    className="attachments__column__content__item__viewRepresentative"
                    onClick={() => {
                      handleViewPhoto(
                        representativeRequirements["businessPermit"],
                        "Business Permit",
                        "businessPermit"
                      );
                    }}
                  >
                    <Visibility />
                  </IconButton>
                )}
              </Box>
              <Box className="attachments__column__content__item">
                <Typography>Valid ID of Owner</Typography>
                <Button
                  className={
                    representativeRequirements["photoIdOwner"] && "buttonActive"
                  }
                  onClick={() => {
                    representativeRequirementRefs[
                      "photoIdOwner"
                    ].current.click();
                  }}
                >
                  <PermIdentity />
                </Button>
                {representativeRequirements["photoIdOwner"] && (
                  <IconButton
                    className="attachments__column__content__item__viewRepresentative"
                    onClick={() => {
                      handleViewPhoto(
                        representativeRequirements["photoIdOwner"],
                        "Valid ID of Owner",
                        "photoIdOwner"
                      );
                    }}
                  >
                    <Visibility />
                  </IconButton>
                )}
              </Box>
              <Box className="attachments__column__content__item">
                <Typography>Valid ID of Representative</Typography>
                <Button
                  className={
                    representativeRequirements["photoIdRepresentative"] &&
                    "buttonActive"
                  }
                  onClick={() => {
                    representativeRequirementRefs[
                      "photoIdRepresentative"
                    ].current.click();
                  }}
                >
                  <CameraAlt />
                </Button>
                {representativeRequirements["photoIdRepresentative"] && (
                  <IconButton
                    className="attachments__column__content__item__viewRepresentative"
                    onClick={() => {
                      handleViewPhoto(
                        representativeRequirements["photoIdRepresentative"],
                        "Valid ID of Representative",
                        "photoIdRepresentative"
                      );
                    }}
                  >
                    <Visibility />
                  </IconButton>
                )}
              </Box>
              <Box className="attachments__column__content__item">
                <Typography>Authorization Letter</Typography>
                <Button
                  className={
                    representativeRequirements["authorizationLetter"] &&
                    "buttonActive"
                  }
                  onClick={() => {
                    representativeRequirementRefs[
                      "authorizationLetter"
                    ].current.click();
                  }}
                >
                  <Assignment />
                </Button>
                {representativeRequirements["authorizationLetter"] && (
                  <IconButton
                    className="attachments__column__content__item__viewRepresentative"
                    onClick={() => {
                      handleViewPhoto(
                        representativeRequirements["authorizationLetter"],
                        "Authorization Letter",
                        "authorizationLetter"
                      );
                    }}
                  >
                    <Visibility />
                  </IconButton>
                )}
              </Box>
            </Box>
            <Box className="attachments__column__radio">
              <Radio
                value={"representative"}
                checked={requirementsMode === "representative"}
                onChange={(e) => {
                  setRequirementsMode(e.target.value);
                }}
                disabled
              />
            </Box>
          </Box>
        </Box>
      </Box>

      <SignatureCanvasModal
        open={isCanvasOpen}
        onClose={onCanvasClose}
        setSignature={handleSetSignature}
        signature={ownersRequirements["signature"]}
      />

      <ViewPhotoModal
        currentViewPhoto={currentViewPhoto}
        currentViewPhotoLabel={currentViewPhotoLabel}
        currentViewPhotoLabelCamel={currentViewPhotoLabelCamel}
        open={isViewPhotoOpen}
        onClose={onViewPhotoClose}
      />
      {/* <CommonModal
        width="800px"
        open={isViewPhotoOpen}
        onClose={onViewPhotoClose}
      >
        <Box className="attachments__viewModal__title">
          <Typography>
            {currentViewPhotoLabel ? currentViewPhotoLabel : "Photo Preview"}
          </Typography>
          <IconButton onClick={onViewPhotoClose}>
            <Close />
          </IconButton>
        </Box>

        {currentViewPhoto ? (
          <>
            {currentViewPhotoLabel === "Signature" ? (
              <Box className="attachments__viewModal__signature">
                <img
                  src={URL.createObjectURL(currentViewPhoto)}
                  alt="File preview"
                  style={{ borderRadius: "12px" }}
                />
              </Box>
            ) : currentViewPhotoLabel !== "Signature" &&
              currentViewPhotoLabel !== null ? (
              <img
                src={URL.createObjectURL(currentViewPhoto)}
                alt="File preview"
                style={{ borderRadius: "12px", width: "800px" }}
              />
            ) : null}
          </>
        ) : (
          <CircularProgress />
        )}
      </CommonModal> */}
      <>
        {/* <Input
          type="file"
          sx={{ display: "none" }}
          inputRef={ownerRequirementRefs["signature"]}
          inputProps={{ accept: "image/jpeg, image/png, image/gif" }}
          onChange={(e) => {
            setOwnersRequirements((prev) => ({
              ...prev,
              signature: e.target.files[0],
            }));
          }}
        /> */}
        <Input
          type="file"
          sx={{ display: "none" }}
          inputRef={ownerRequirementRefs["storePhoto"]}
          inputProps={{ accept: "image/jpeg, image/png, image/gif" }}
          onChange={(e) => {
            setOwnersRequirements((prev) => ({
              ...prev,
              storePhoto: e.target.files[0],
            }));
            setOwnersRequirementsIsLink((prev) => ({
              ...prev,
              storePhoto: false,
            }));
          }}
        />
        <Input
          type="file"
          sx={{ display: "none" }}
          inputRef={ownerRequirementRefs["businessPermit"]}
          inputProps={{ accept: "image/jpeg, image/png, image/gif" }}
          onChange={(e) => {
            setOwnersRequirements((prev) => ({
              ...prev,
              businessPermit: e.target.files[0],
            }));
            setOwnersRequirementsIsLink((prev) => ({
              ...prev,
              businessPermit: false,
            }));
          }}
        />
        <Input
          type="file"
          sx={{ display: "none" }}
          inputRef={ownerRequirementRefs["photoIdOwner"]}
          inputProps={{ accept: "image/jpeg, image/png, image/gif" }}
          onChange={(e) => {
            setOwnersRequirements((prev) => ({
              ...prev,
              photoIdOwner: e.target.files[0],
            }));
            setOwnersRequirementsIsLink((prev) => ({
              ...prev,
              photoIdOwner: false,
            }));
          }}
        />

        {/* Representative Requirements */}
        {/* <Input
          type="file"
          sx={{ display: "none" }}
          inputRef={representativeRequirementRefs["signature"]}
          inputProps={{ accept: "image/jpeg, image/png, image/gif" }}
          onChange={(e) => {
            setRepresentativeRequirements((prev) => ({
              ...prev,
              signature: e.target.files[0],
            }));
          }}
        /> */}
        <Input
          type="file"
          sx={{ display: "none" }}
          inputRef={representativeRequirementRefs["storePhoto"]}
          inputProps={{ accept: "image/jpeg, image/png, image/gif" }}
          onChange={(e) => {
            setRepresentativeRequirements((prev) => ({
              ...prev,
              storePhoto: e.target.files[0],
            }));
            setRepresentativeRequirementsIsLink((prev) => ({
              ...prev,
              storePhoto: false,
            }));
          }}
        />
        <Input
          type="file"
          sx={{ display: "none" }}
          inputRef={representativeRequirementRefs["businessPermit"]}
          inputProps={{ accept: "image/jpeg, image/png, image/gif" }}
          onChange={(e) => {
            setRepresentativeRequirements((prev) => ({
              ...prev,
              businessPermit: e.target.files[0],
            }));
            setRepresentativeRequirementsIsLink((prev) => ({
              ...prev,
              businessPermit: false,
            }));
          }}
        />
        <Input
          type="file"
          sx={{ display: "none" }}
          inputRef={representativeRequirementRefs["photoIdOwner"]}
          inputProps={{ accept: "image/jpeg, image/png, image/gif" }}
          onChange={(e) => {
            setRepresentativeRequirements((prev) => ({
              ...prev,
              photoIdOwner: e.target.files[0],
            }));
            setRepresentativeRequirementsIsLink((prev) => ({
              ...prev,
              photoIdOwner: false,
            }));
          }}
        />
        <Input
          type="file"
          sx={{ display: "none" }}
          inputRef={representativeRequirementRefs["photoIdRepresentative"]}
          inputProps={{ accept: "image/jpeg, image/png, image/gif" }}
          onChange={(e) => {
            setRepresentativeRequirements((prev) => ({
              ...prev,
              photoIdRepresentative: e.target.files[0],
            }));
            setRepresentativeRequirementsIsLink((prev) => ({
              ...prev,
              photoIdRepresentative: false,
            }));
          }}
        />
        <Input
          type="file"
          sx={{ display: "none" }}
          inputRef={representativeRequirementRefs["authorizationLetter"]}
          inputProps={{ accept: "image/jpeg, image/png, image/gif" }}
          onChange={(e) => {
            setRepresentativeRequirements((prev) => ({
              ...prev,
              authorizationLetter: e.target.files[0],
            }));
            setRepresentativeRequirementsIsLink((prev) => ({
              ...prev,
              authorizationLetter: false,
            }));
          }}
        />
      </>
    </>
  );
}

export default Attachments;
