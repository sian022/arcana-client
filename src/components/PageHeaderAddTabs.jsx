import { Box, Paper, Typography, Stack, Badge, Divider } from "@mui/material";
import React from "react";
import "../assets/styles/common.styles.scss";
import SecondaryButton from "./SecondaryButton";

function PageHeaderAddTabs({
  onOpen,
  pageTitle,
  tabsList,
  tabViewing,
  setTabViewing,
  addTitle,
  largeButton,
}) {
  return (
    <Box sx={{ padding: "1px" }}>
      <Box
        component={Paper}
        className="pageHeader"
        sx={{ overflow: "overlay" }}
      >
        <Box className="pageHeader__left">
          <Typography className="pageHeader__title">{pageTitle}</Typography>
          <SecondaryButton
            sx={{ height: largeButton && "50px" }}
            className="addRowButtons"
            onClick={onOpen}
          >
            {addTitle}
          </SecondaryButton>
        </Box>
        <Box className="pageHeader__right">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: "20px",
            }}
          >
            {tabsList?.map((item, i) => (
              <Stack
                sx={{ cursor: "pointer", alignItems: "center", width: "160px" }}
                key={i}
                onClick={() => setTabViewing(item.case)}
              >
                <Badge
                  badgeContent={item.badge}
                  color="primary"
                  invisible={item.case === tabViewing}
                >
                  <Typography
                    sx={{
                      fontSize: "14.5px",
                      fontWeight: "bold",
                      color: "secondary.main",
                      textAlign: "center",
                    }}
                  >
                    {item.name}
                  </Typography>
                </Badge>
                {item.case === tabViewing && (
                  <Divider
                    sx={{
                      bgcolor: "secondary.main",
                      width: "160px",
                      // width: "auto",
                      height: "3px",
                      borderRadius: "10px",
                      transition: "width 0.8s ease-in-out",
                    }}
                  />
                )}
              </Stack>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default PageHeaderAddTabs;
