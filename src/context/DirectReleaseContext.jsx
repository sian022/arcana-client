import React, { createContext, useState } from "react";

const DirectReleaseContext = createContext();

const DirectReleaseProvider = ({ children }) => {
  const [signatureDirect, setSignatureDirect] = useState(null);
  const [photoProofDirect, setPhotoProofDirect] = useState(null);

  console.log(signatureDirect);
  return (
    <DirectReleaseContext.Provider
      value={{
        signatureDirect,
        setSignatureDirect,
        photoProofDirect,
        setPhotoProofDirect,
      }}
    >
      {children}
    </DirectReleaseContext.Provider>
  );
};

export { DirectReleaseContext, DirectReleaseProvider };
