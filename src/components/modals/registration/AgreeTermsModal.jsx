import {
  Box,
  Checkbox,
  CircularProgress,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import CommonModal from "../../CommonModal";
import { useEffect, useState } from "react";
import SecondaryButton from "../../SecondaryButton";

function AgreeTermsModal({ onRegister, isLoading, ...props }) {
  const { open } = props;

  //Hooks

  const [isAgree, setIsAgree] = useState(false);

  useEffect(() => {
    if (!open) {
      setIsAgree(false);
    }
  }, [open]);

  return (
    <CommonModal width="600px" {...props} closeTopRight>
      <Box className="agreeTermsModal">
        <Typography className="agreeTermsModal__title">
          Agreement Terms
        </Typography>

        <List className="agreeTermsModal__list" sx={{ listStyleType: "disc" }}>
          <ListItem sx={{ display: "list-item" }}>
            <Typography>
              This form serves as an official agreement between RDF Feed,
              Livestock & Foods Inc. and Smaxs. Both parties agree to follow all
              terms stated above this contract.
            </Typography>
          </ListItem>

          <ListItem sx={{ display: "list-item" }}>
            <Typography>
              All stipulations stated in this agreement shall be strictly
              adhered to and shall extend indefinitely until both parties agree
              to terminate or revise this agreement.
            </Typography>
          </ListItem>

          <ListItem sx={{ display: "list-item" }}>
            <Typography>
              Both parties shall keep the terms and conditions of this agreement
              confidential and shall not disclose this to any person.
            </Typography>
          </ListItem>
        </List>

        <Box className="agreeTermsModal__checkAgree">
          <Checkbox
            checked={isAgree}
            onChange={(e) => setIsAgree(e.target.checked)}
          />

          <Typography>
            I have read and agree with the above agreement terms
          </Typography>
        </Box>

        <Box className="agreeTermsModal__registerButton">
          <SecondaryButton
            disabled={!isAgree}
            size="medium"
            onClick={onRegister}
            sx={{ width: "100%", mt: 1 }}
          >
            {isLoading ? <CircularProgress /> : "Register Client"}
          </SecondaryButton>
        </Box>
      </Box>
    </CommonModal>
  );
}

export default AgreeTermsModal;
