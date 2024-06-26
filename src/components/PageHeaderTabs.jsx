import { Box, Paper, Typography, Stack, Badge, Divider } from "@mui/material";
import "../assets/styles/common.styles.scss";

function PageHeaderTabs({
  small,
  wide,
  extraWide,
  pageTitle,
  tabsList,
  tabViewing,
  setTabViewing,
  isNotificationFetching,
}) {
  return (
    <Box sx={{ padding: "1px" }}>
      <Box component={Paper} className="pageHeader">
        <Box className="pageHeader__left">
          <Typography className="pageHeader__title">{pageTitle}</Typography>
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
                sx={{
                  cursor: "pointer",
                  alignItems: "center",
                  width: extraWide
                    ? "200px"
                    : wide
                    ? "180px"
                    : small
                    ? "120px"
                    : "160px",
                }}
                key={i}
                onClick={() => setTabViewing(item.case)}
              >
                <Badge
                  badgeContent={!item.isBadgeLoading ? item.badge : <></>}
                  color="notification"
                  invisible={item.case === tabViewing || isNotificationFetching}
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
                      width: extraWide
                        ? "200px"
                        : wide
                        ? "180px"
                        : small
                        ? "120px"
                        : "160px",
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

export default PageHeaderTabs;
