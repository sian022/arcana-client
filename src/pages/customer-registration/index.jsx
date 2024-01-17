import React, { useContext } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import CommonPageIndex from "../../components/CommonPageIndex";
import { Box, Typography } from "@mui/material";
import { ArrowCircleRight } from "@mui/icons-material";
import { AppContext } from "../../context/AppContext";

function CustomerRegistration() {
  const location = useLocation();
  const navigate = useNavigate();

  const { notifications } = useContext(AppContext);

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

            <Box className="pageIndex__navigators__item__notifAndArrow">
              {!!notifications?.prospect && !notifications?.prospect !== 0 ? (
                <Box className="notificationsLarge">
                  {notifications?.prospect}
                </Box>
              ) : (
                <Box></Box>
              )}
              <ArrowCircleRight className="pageIndex__navigators__item__notifAndArrow__arrow" />
            </Box>
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

            <Box className="pageIndex__navigators__item__notifAndArrow">
              {!!notifications?.rejectedClient &&
              !notifications?.rejectedClient !== 0 ? (
                <Box className="notificationsLarge">
                  {notifications?.rejectedClient}
                </Box>
              ) : (
                <Box></Box>
              )}
              <ArrowCircleRight className="pageIndex__navigators__item__notifAndArrow__arrow" />
            </Box>
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

            <Box className="pageIndex__navigators__item__notifAndArrow">
              {!!notifications?.rejectedListingFee &&
              !notifications?.rejectedListingFee !== 0 ? (
                <Box className="notificationsLarge">
                  {notifications?.rejectedListingFee}
                </Box>
              ) : (
                <Box></Box>
              )}
              <ArrowCircleRight className="pageIndex__navigators__item__notifAndArrow__arrow" />
            </Box>
          </Box>

          <Box
            className="pageIndex__navigators__item"
            onClick={() => navigate("other-expenses")}
          >
            <Box className="pageIndex__navigators__item__text">
              <Typography className="pageIndex__navigators__item__text__title">
                Other Expenses
              </Typography>
              <Typography className="pageIndex__navigators__item__text__subTitle">
                Requesting and tracking of other expenses
              </Typography>
            </Box>

            <Box className="pageIndex__navigators__item__notifAndArrow">
              {!!notifications?.rejectedExpenses &&
              !notifications?.rejectedExpenses !== 0 ? (
                <Box className="notificationsLarge">
                  {notifications?.rejectedExpenses}
                </Box>
              ) : (
                <Box></Box>
              )}
              <ArrowCircleRight className="pageIndex__navigators__item__notifAndArrow__arrow" />
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }
  return <Outlet />;
}

export default CustomerRegistration;
