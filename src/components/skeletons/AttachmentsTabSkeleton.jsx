import { Box, Skeleton, Typography } from "@mui/material";
import React from "react";

function AttachmentsTabSkeleton() {
  return (
    <Box className="viewRegistrationModal__attachments__content">
      <Box className="viewRegistrationModal__attachments__content__titleGroup">
        <Typography className="viewRegistrationModal__attachments__content__titleGroup__title">
          Attachments
        </Typography>

        <Skeleton width="300px" height="30px" sx={{ transform: "none" }} />
      </Box>

      <Box className="viewRegistrationModal__attachments__content__fields">
        <Box className="viewRegistrationModal__attachments__content__fields__item">
          <Skeleton width="250px" height="30px" sx={{ transform: "none" }} />

          <Skeleton width="60px" height="30px" sx={{ transform: "none" }} />
        </Box>

        <Box className="viewRegistrationModal__attachments__content__fields__item">
          <Skeleton width="250px" height="30px" sx={{ transform: "none" }} />

          <Skeleton width="60px" height="30px" sx={{ transform: "none" }} />
        </Box>

        <Box className="viewRegistrationModal__attachments__content__fields__item">
          <Skeleton width="250px" height="30px" sx={{ transform: "none" }} />

          <Skeleton width="60px" height="30px" sx={{ transform: "none" }} />
        </Box>

        <Box className="viewRegistrationModal__attachments__content__fields__item">
          <Skeleton width="250px" height="30px" sx={{ transform: "none" }} />

          <Skeleton width="60px" height="30px" sx={{ transform: "none" }} />
        </Box>

        <Box className="viewRegistrationModal__attachments__content__fields__item">
          <Skeleton width="250px" height="30px" sx={{ transform: "none" }} />

          <Skeleton width="60px" height="30px" sx={{ transform: "none" }} />
        </Box>

        <Box className="viewRegistrationModal__attachments__content__fields__item">
          <Skeleton width="250px" height="30px" sx={{ transform: "none" }} />

          <Skeleton width="60px" height="30px" sx={{ transform: "none" }} />
        </Box>
      </Box>
    </Box>
  );
}

export default AttachmentsTabSkeleton;
