import { ArrowCircleRight } from "@mui/icons-material";
import { Box, Card, Typography } from "@mui/material";
import React from "react";
import { Outlet, useLocation } from "react-router-dom";

function CommonPageIndex({ pathname, title }) {
  const location = useLocation();

  if (location.pathname === pathname) {
    return (
      <Box className="pageIndex">
        <Box className="pageIndex__banner">
          <Typography className="pageIndex__banner__title">{title}</Typography>
        </Box>

        <Box className="pageIndex__navigators">
          <Box className="pageIndex__navigators__item">
            <Box className="pageIndex__navigators__item__text">
              <Typography className="pageIndex__navigators__item__text__title">
                User Account
              </Typography>
              <Typography className="pageIndex__navigators__item__text__subTitle">
                Manage and create user accounts based on SEDAR
              </Typography>
            </Box>
            <ArrowCircleRight className="pageIndex__navigators__item__arrow" />
          </Box>

          <Box className="pageIndex__navigators__item">
            <Box className="pageIndex__navigators__item__text">
              <Typography className="pageIndex__navigators__item__text__title">
                User Role
              </Typography>
              <Typography className="pageIndex__navigators__item__text__subTitle">
                Manage and tag user roles
              </Typography>
            </Box>
            <ArrowCircleRight className="pageIndex__navigators__item__arrow" />
          </Box>

          <Box className="pageIndex__navigators__item">
            <Box className="pageIndex__navigators__item__text">
              <Typography className="pageIndex__navigators__item__text__title">
                Approver
              </Typography>
              <Typography className="pageIndex__navigators__item__text__subTitle">
                Manage list and ordering of approvers
              </Typography>
            </Box>
            <ArrowCircleRight className="pageIndex__navigators__item__arrow" />
          </Box>

          <Box className="pageIndex__navigators__item">
            <Box className="pageIndex__navigators__item__text">
              <Typography className="pageIndex__navigators__item__text__title">
                Company
              </Typography>
              <Typography className="pageIndex__navigators__item__text__subTitle">
                Manage and sync company to FISTO
              </Typography>
            </Box>
            <ArrowCircleRight className="pageIndex__navigators__item__arrow" />
          </Box>

          <Box className="pageIndex__navigators__item">
            <Box className="pageIndex__navigators__item__text">
              <Typography className="pageIndex__navigators__item__text__title">
                Department
              </Typography>
              <Typography className="pageIndex__navigators__item__text__subTitle">
                Manage and sync department to FISTO
              </Typography>
            </Box>
            <ArrowCircleRight className="pageIndex__navigators__item__arrow" />
          </Box>

          <Box className="pageIndex__navigators__item">
            <Box className="pageIndex__navigators__item__text">
              <Typography className="pageIndex__navigators__item__text__title">
                Location
              </Typography>
              <Typography className="pageIndex__navigators__item__text__subTitle">
                Manage and sync location to FISTO
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

export default CommonPageIndex;
