import { createContext, useState } from "react";
import { base64ToBlob } from "../utils/CustomFunctions";

const AttachmentsContext = createContext();

const AttachmentsProvider = ({ children }) => {
  const [requirementsMode, setRequirementsMode] = useState(null);

  const [ownersRequirements, setOwnersRequirements] = useState({
    signature: null,
    storePhoto: null,
    businessPermit: null,
    photoIdOwner: null,
  });

  const [representativeRequirements, setRepresentativeRequirements] = useState({
    signature: null,
    storePhoto: null,
    businessPermit: null,
    photoIdOwner: null,
    photoIdRepresentative: null,
    authorizationLetter: null,
  });

  const [ownersRequirementsIsLink, setOwnersRequirementsIsLink] = useState({
    signature: false,
    storePhoto: false,
    businessPermit: false,
    photoIdOwner: false,
  });

  const [
    representativeRequirementsIsLink,
    setRepresentativeRequirementsIsLink,
  ] = useState({
    signature: false,
    storePhoto: false,
    businessPermit: false,
    photoIdOwner: false,
    photoIdRepresentative: false,
    authorizationLetter: false,
  });

  const convertSignatureToBase64 = () => {
    if (requirementsMode === "owner" && ownersRequirements["signature"]) {
      const convertedSignature = new File(
        [base64ToBlob(ownersRequirements["signature"])],
        `signature_${Date.now()}.jpg`,
        { type: "image/jpeg" }
      );
      setOwnersRequirements({
        ...ownersRequirements,
        signature: convertedSignature,
      });
    } else if (
      requirementsMode === "representative" &&
      representativeRequirements["signature"]
    ) {
      const convertedSignature = new File(
        [base64ToBlob(representativeRequirements["signature"])],
        `signature_${Date.now()}.jpg`,
        { type: "image/jpeg" }
      );
      setRepresentativeRequirements({
        ...representativeRequirements,
        signature: convertedSignature,
      });
    }
  };

  return (
    <AttachmentsContext.Provider
      value={{
        requirementsMode,
        setRequirementsMode,
        ownersRequirements,
        setOwnersRequirements,
        representativeRequirements,
        setRepresentativeRequirements,
        convertSignatureToBase64,
        ownersRequirementsIsLink,
        setOwnersRequirementsIsLink,
        representativeRequirementsIsLink,
        setRepresentativeRequirementsIsLink,
      }}
    >
      {children}
    </AttachmentsContext.Provider>
  );
};

export { AttachmentsContext, AttachmentsProvider };
