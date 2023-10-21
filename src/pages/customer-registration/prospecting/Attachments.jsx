import { Box, Button, Radio, Typography } from "@mui/material";
import React from "react";
import {
  AddAPhoto,
  Assignment,
  Business,
  CameraAlt,
  Create,
  PermIdentity,
} from "@mui/icons-material";

function Attachments() {
  return (
    <Box className="attachments">
      <Box className="attachments__column">
        <Typography className="attachments__column__title">
          Owner's Requirements
        </Typography>
        <Box className="attachments__column__content">
          <Box className="attachments__column__content__item">
            <Typography>Customer's Signature</Typography>
            <Button className="buttonActive">
              <Create />
            </Button>
          </Box>
          <Box className="attachments__column__content__item">
            <Typography>Store Photo</Typography>
            <Button>
              <AddAPhoto />
            </Button>
          </Box>
          <Box className="attachments__column__content__item">
            <Typography>Business Permit</Typography>
            <Button>
              <Business />
            </Button>
          </Box>
          <Box className="attachments__column__content__item">
            <Typography>Valid ID of Owner</Typography>
            <Button>
              <PermIdentity />
            </Button>
          </Box>
        </Box>
        <Box className="attachments__column__radio">
          <Radio />
        </Box>
      </Box>

      <Box className="attachments__column">
        <Typography className="attachments__column__title">
          Representatives Requirements
        </Typography>
        <Box className="attachments__column__content">
          <Box className="attachments__column__content__item">
            <Typography>Representative's Signature</Typography>
            <Button>
              <Create />
            </Button>
          </Box>
          <Box className="attachments__column__content__item">
            <Typography>Store Photo</Typography>
            <Button>
              <AddAPhoto />
            </Button>
          </Box>
          <Box className="attachments__column__content__item">
            <Typography>Business Permit</Typography>
            <Button>
              <PermIdentity />
            </Button>
          </Box>
          <Box className="attachments__column__content__item">
            <Typography>Valid ID of Owner</Typography>
            <Button>
              <AddAPhoto />
            </Button>
          </Box>
          <Box className="attachments__column__content__item">
            <Typography>Valid ID of Representative</Typography>
            <Button>
              <CameraAlt />
            </Button>
          </Box>
          <Box className="attachments__column__content__item">
            <Typography>Authorization Letter</Typography>
            <Button>
              <Assignment />
            </Button>
          </Box>
        </Box>
        <Box className="attachments__column__radio">
          <Radio />
        </Box>
      </Box>
    </Box>
  );
}

export default Attachments;
