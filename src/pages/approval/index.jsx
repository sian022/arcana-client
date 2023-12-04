import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import CommonPageIndex from "../../components/CommonPageIndex";
import { ArrowCircleRight } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

function Approval() {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname === "/approval") {
    return (
      <Box className="pageIndex">
        <Box className="pageIndex__banner">
          <Typography className="pageIndex__banner__title">Approval</Typography>
        </Box>

        <Box className="pageIndex__navigators">
          <Box
            className="pageIndex__navigators__item"
            onClick={() => navigate("registration-approval")}
          >
            <Box className="pageIndex__navigators__item__text">
              <Typography className="pageIndex__navigators__item__text__title">
                Registration Approval
              </Typography>
              <Typography className="pageIndex__navigators__item__text__subTitle">
                Approval and rejection of client registration requests
              </Typography>
            </Box>
            <ArrowCircleRight className="pageIndex__navigators__item__arrow" />
          </Box>

          <Box
            className="pageIndex__navigators__item"
            onClick={() => navigate("sp-discount-approval")}
          >
            <Box className="pageIndex__navigators__item__text">
              <Typography className="pageIndex__navigators__item__text__title">
                Sp. Discount Approval
              </Typography>
              <Typography className="pageIndex__navigators__item__text__subTitle">
                Approval and rejection of sp. discount requests
              </Typography>
            </Box>
            <ArrowCircleRight className="pageIndex__navigators__item__arrow" />
          </Box>

          <Box
            className="pageIndex__navigators__item"
            onClick={() => navigate("listing-fee-approval")}
          >
            <Box className="pageIndex__navigators__item__text">
              <Typography className="pageIndex__navigators__item__text__title">
                Listing Fee Approval
              </Typography>
              <Typography className="pageIndex__navigators__item__text__subTitle">
                Approval and rejection of listing fee requests
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

export default Approval;
