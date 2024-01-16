import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import CommonPageIndex from "../../components/CommonPageIndex";
import { Box, Typography } from "@mui/material";
import { ArrowCircleRight } from "@mui/icons-material";

function CustomerManagement() {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname === "/customer-management") {
    return (
      <Box className="pageIndex">
        <Box className="pageIndex__banner">
          <Typography className="pageIndex__banner__title">
            Customer Management
          </Typography>
        </Box>

        <Box className="pageIndex__navigators">
          <Box
            className="pageIndex__navigators__item"
            onClick={() => navigate("business-type")}
          >
            <Box className="pageIndex__navigators__item__text">
              <Typography className="pageIndex__navigators__item__text__title">
                Business Type
              </Typography>
              <Typography className="pageIndex__navigators__item__text__subTitle">
                Manage and create business type
              </Typography>
            </Box>

            <Box className="pageIndex__navigators__item__notifAndArrow">
              <Box></Box>
              <ArrowCircleRight className="pageIndex__navigators__item__notifAndArrow__arrow" />
            </Box>
          </Box>

          <Box
            className="pageIndex__navigators__item"
            onClick={() => navigate("variable-discount")}
          >
            <Box className="pageIndex__navigators__item__text">
              <Typography className="pageIndex__navigators__item__text__title">
                Variable Discount
              </Typography>
              <Typography className="pageIndex__navigators__item__text__subTitle">
                Manage variable discount amount and percentage ranges
              </Typography>
            </Box>

            <Box className="pageIndex__navigators__item__notifAndArrow">
              <Box></Box>
              <ArrowCircleRight className="pageIndex__navigators__item__notifAndArrow__arrow" />
            </Box>
          </Box>

          <Box
            className="pageIndex__navigators__item"
            onClick={() => navigate("term-days")}
          >
            <Box className="pageIndex__navigators__item__text">
              <Typography className="pageIndex__navigators__item__text__title">
                Term Days
              </Typography>
              <Typography className="pageIndex__navigators__item__text__subTitle">
                Manage and create term days
              </Typography>
            </Box>

            <Box className="pageIndex__navigators__item__notifAndArrow">
              <Box></Box>
              <ArrowCircleRight className="pageIndex__navigators__item__notifAndArrow__arrow" />
            </Box>
          </Box>

          <Box
            className="pageIndex__navigators__item"
            onClick={() => navigate("expenses-setup")}
          >
            <Box className="pageIndex__navigators__item__text">
              <Typography className="pageIndex__navigators__item__text__title">
                Expenses Setup
              </Typography>
              <Typography className="pageIndex__navigators__item__text__subTitle">
                Manage and create other expenses
              </Typography>
            </Box>

            <Box className="pageIndex__navigators__item__notifAndArrow">
              <Box></Box>
              <ArrowCircleRight className="pageIndex__navigators__item__notifAndArrow__arrow" />
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }
  return <Outlet />;
}

export default CustomerManagement;
