import { Box, Button, Input, Radio, Typography } from "@mui/material";
import React, { useContext, useRef, useState } from "react";
import {
  AddAPhoto,
  Assignment,
  Business,
  CameraAlt,
  Create,
  PermIdentity,
} from "@mui/icons-material";
import { AttachmentsContext } from "../../../context/AttachmentsContext";
import SignatureCanvasModal from "../../../components/modals/SignatureCanvasModal";
import useDisclosure from "../../../hooks/useDisclosure";
import { useSelector } from "react-redux";
import { base64ToBlob } from "../../../utils/CustomFunctions";

function Attachments() {
  const {
    requirementsMode,
    setRequirementsMode,
    ownersRequirements,
    setOwnersRequirements,
    representativeRequirements,
    setRepresentativeRequirements,
  } = useContext(AttachmentsContext);

  const selectedRowData = useSelector((state) => state.selectedRow.value);

  // console.log("Owner:", ownersRequirements);
  // console.log("Representative:", representativeRequirements);

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

  //Handler Functions
  const handleSetSignature = (signature) => {
    if (requirementsMode === "owner") {
      setOwnersRequirements((prev) => ({
        ...prev,
        signature:
          // new File(
          //   [base64ToBlob(signature)],
          //   `signature_${
          //     selectedRowData.businessName
          //       ? selectedRowData.businessname
          //       : "owner"
          //   }_${Date.now()}.jpg`,
          //   { type: "image/jpeg" }
          // ),
          signature,
      }));
    } else if (requirementsMode === "representative") {
      setRepresentativeRequirements((prev) => ({
        ...prev,
        signature:
          // new File(
          //   [base64ToBlob(signature)],
          //   `signature_${
          //     selectedRowData.businessName
          //       ? selectedRowData.businessname
          //       : "representative"
          //   }_${Date.now()}.jpg`,
          //   { type: "image/jpeg" }
          // ),
          signature,
      }));
    }
  };

  return (
    <>
      <Box className="attachments">
        <Box
          className={
            "attachments__column" +
            (requirementsMode !== "owner" ? " overlay" : "")
          }
        >
          <Typography className="attachments__column__title">
            Owner's Requirements
          </Typography>
          <Box className="attachments__column__content">
            <Box className="attachments__column__content__item">
              <Typography>Customer's Signature</Typography>
              <Button
                className={ownersRequirements["signature"] && "buttonActive"}
                onClick={
                  onCanvasOpen
                  // () => {ownerRequirementRefs["signature"].current.click()}
                }
              >
                <Create />
              </Button>
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
            </Box>
            <Box className="attachments__column__content__item">
              <Typography>Valid ID of Owner</Typography>
              <Button
                className={ownersRequirements["photoIdOwner"] && "buttonActive"}
                onClick={() => {
                  ownerRequirementRefs["photoIdOwner"].current.click();
                }}
              >
                <PermIdentity />
              </Button>
            </Box>
          </Box>
          <Box className="attachments__column__radio">
            <Radio
              value={"owner"}
              checked={requirementsMode === "owner"}
              onChange={(e) => {
                setRequirementsMode(e.target.value);
              }}
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
            Representative's Requirements
          </Typography>
          <Box className="attachments__column__content">
            <Box className="attachments__column__content__item">
              <Typography>Representative's Signature</Typography>
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
            </Box>
            <Box className="attachments__column__content__item">
              <Typography>Business Permit</Typography>
              <Button
                className={
                  representativeRequirements["businessPermit"] && "buttonActive"
                }
                onClick={() => {
                  representativeRequirementRefs[
                    "businessPermit"
                  ].current.click();
                }}
              >
                <Business />
              </Button>
            </Box>
            <Box className="attachments__column__content__item">
              <Typography>Valid ID of Owner</Typography>
              <Button
                className={
                  representativeRequirements["photoIdOwner"] && "buttonActive"
                }
                onClick={() => {
                  representativeRequirementRefs["photoIdOwner"].current.click();
                }}
              >
                <PermIdentity />
              </Button>
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
            </Box>
          </Box>
          <Box className="attachments__column__radio">
            <Radio
              value={"representative"}
              checked={requirementsMode === "representative"}
              onChange={(e) => {
                setRequirementsMode(e.target.value);
              }}
            />
          </Box>
        </Box>
      </Box>

      <SignatureCanvasModal
        open={isCanvasOpen}
        onClose={onCanvasClose}
        setSignature={handleSetSignature}
        signature={ownersRequirements["signature"]}
      />
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
          }}
        />
      </>
    </>
  );
}

export default Attachments;
