import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import CommonPageIndex from "../../components/CommonPageIndex";
import { Box, Typography } from "@mui/material";
import { ArrowCircleRight } from "@mui/icons-material";

function CustomerRegistration() {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname === "/customer-registration") {
    return (
      <Box className="pageIndex">
        <Box className="pageIndex__banner">
          <Typography className="pageIndex__banner__title">
            Customer Registration
          </Typography>
        </Box>

        <Box className="pageIndex__navigators">
          <Box
            className="pageIndex__navigators__item"
            onClick={() => navigate("prospect")}
          >
            <Box className="pageIndex__navigators__item__text">
              <Typography className="pageIndex__navigators__item__text__title">
                Prospect
              </Typography>
              <Typography className="pageIndex__navigators__item__text__subTitle">
                Prospecting of potential clients through freebies
              </Typography>
            </Box>
            <ArrowCircleRight className="pageIndex__navigators__item__arrow" />
          </Box>

          <Box
            className="pageIndex__navigators__item"
            onClick={() => navigate("registration")}
          >
            <Box className="pageIndex__navigators__item__text">
              <Typography className="pageIndex__navigators__item__text__title">
                Registration
              </Typography>
              <Typography className="pageIndex__navigators__item__text__subTitle">
                Directly register clients and track their approval
              </Typography>
            </Box>
            <ArrowCircleRight className="pageIndex__navigators__item__arrow" />
          </Box>

          <Box
            className="pageIndex__navigators__item"
            onClick={() => navigate("listing-fee")}
          >
            <Box className="pageIndex__navigators__item__text">
              <Typography className="pageIndex__navigators__item__text__title">
                Listing Fee
              </Typography>
              <Typography className="pageIndex__navigators__item__text__subTitle">
                Requesting and tracking of listing fees for desired items
              </Typography>
            </Box>
            <ArrowCircleRight className="pageIndex__navigators__item__arrow" />
          </Box>
        </Box>
      </Box>
    );
  }
  return <Outlet />;
}

export default CustomerRegistration;
