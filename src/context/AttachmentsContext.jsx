import React, { createContext, useState } from "react";

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

  return (
    <AttachmentsContext.Provider
      value={{
        requirementsMode,
        setRequirementsMode,
        ownersRequirements,
        setOwnersRequirements,
        representativeRequirements,
        setRepresentativeRequirements,
      }}
    >
      {children}
    </AttachmentsContext.Provider>
  );
};

export { AttachmentsContext, AttachmentsProvider };
