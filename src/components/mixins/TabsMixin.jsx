import {
  Box,
  Paper,
  Typography,
  Stack,
  Badge,
  Divider,
  CircularProgress,
} from "@mui/material";
import React from "react";
import "../../assets/styles/common.styles.scss";

function TabsMixin({
  wide,
  extraWide,
  pageTitle,
  tabsList,
  tabViewing,
  setTabViewing,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        gap: "20px",
      }}
    >
      {tabsList?.map((item, i) => (
        <Stack
          sx={{
            cursor: "pointer",
            alignItems: "center",
            // width: extraWide ? "200px" : wide ? "180px" : "160px",
          }}
          key={i}
          onClick={() => setTabViewing(item.case)}
        >
          <Badge
            badgeContent={!item.isBadgeLoading ? item.badge : <></>}
            color="notification"
            invisible={item.case === tabViewing}
            sx={{ color: "white !important" }}
          >
            <Typography
              sx={{
                fontSize: "14.5px",
                fontWeight: "bold",
                color: "secondary.main",
                textAlign: "center",
                marginTop: "3px",
              }}
            >
              {item.name}
            </Typography>
          </Badge>
          {item.case === tabViewing && (
            <Divider
              sx={{
                bgcolor: "secondary.main",
                width: extraWide ? "200px" : wide ? "180px" : "160px",
                // width: "auto",
                height: "3px",
                borderRadius: "10px",
                transition: "width 0.8s ease-in-out",
              }}
            />
          )}
        </Stack>
      ))}
      {/* </Box> */}
    </Box>
  );
}

export default TabsMixin;
