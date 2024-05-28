import React from "react";

import { ReasonConfirmContext } from "../context/ReasonConfirmContext";

const useReasonConfirm = () => {
  const reason = React.useContext(ReasonConfirmContext);

  return reason;
};

export default useReasonConfirm;
