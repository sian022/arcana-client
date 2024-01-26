import React from "react";
import CommonPageIndex from "../../components/CommonPageIndex";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { ArrowCircleRight } from "@mui/icons-material";

function SalesManagement() {
  // return (
  //   <CommonPageIndex pathname="/user-management" title="User Management" />
  // );
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname === "/sales-management") {
    return (
      <Box className="pageIndex">
        <Box className="pageIndex__banner">
          <Typography className="pageIndex__banner__title">
            Sales Management
          </Typography>
        </Box>

        <Box className="pageIndex__navigators">
          <Box
            className="pageIndex__navigators__item"
            onClick={() => navigate("sales-transaction")}
          >
            <Box className="pageIndex__navigators__item__text">
              <Typography className="pageIndex__navigators__item__text__title">
                Sales Transaction
              </Typography>
              <Typography className="pageIndex__navigators__item__text__subTitle">
                POS and attaching of CI photo
              </Typography>
            </Box>

            <Box className="pageIndex__navigators__item__notifAndArrow">
              <Box></Box>
              <ArrowCircleRight className="pageIndex__navigators__item__notifAndArrow__arrow" />
            </Box>
          </Box>

          <Box
            className="pageIndex__navigators__item"
            onClick={() => navigate("payment-transaction")}
          >
            <Box className="pageIndex__navigators__item__text">
              <Typography className="pageIndex__navigators__item__text__title">
                Payment Transaction
              </Typography>
              <Typography className="pageIndex__navigators__item__text__subTitle">
                Manage and create payments
              </Typography>
            </Box>

            <Box className="pageIndex__navigators__item__notifAndArrow">
              <Box></Box>
              <ArrowCircleRight className="pageIndex__navigators__item__notifAndArrow__arrow" />
            </Box>
          </Box>

          <Box
            className="pageIndex__navigators__item"
            onClick={() => navigate("special-discount")}
          >
            <Box className="pageIndex__navigators__item__text">
              <Typography className="pageIndex__navigators__item__text__title">
                Special Discount
              </Typography>
              <Typography className="pageIndex__navigators__item__text__subTitle">
                Manage and create special discounts
              </Typography>
            </Box>

            <Box className="pageIndex__navigators__item__notifAndArrow">
              <Box></Box>
              <ArrowCircleRight className="pageIndex__navigators__item__notifAndArrow__arrow" />
            </Box>
          </Box>

          <Box
            className="pageIndex__navigators__item"
            onClick={() => navigate("advance-payment")}
          >
            <Box className="pageIndex__navigators__item__text">
              <Typography className="pageIndex__navigators__item__text__title">
                Advance Payment
              </Typography>
              <Typography className="pageIndex__navigators__item__text__subTitle">
                Manage and create advance payments
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

export default SalesManagement;
