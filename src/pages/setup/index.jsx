import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import CommonPageIndex from "../../components/CommonPageIndex";
import { ArrowCircleRight } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

function Setup() {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname === "/product-setup") {
    return (
      <Box className="pageIndex">
        <Box className="pageIndex__banner">
          <Typography className="pageIndex__banner__title">
            Product Setup
          </Typography>
        </Box>

        <Box className="pageIndex__navigators">
          <Box
            className="pageIndex__navigators__item"
            onClick={() => navigate("products")}
          >
            <Box className="pageIndex__navigators__item__text">
              <Typography className="pageIndex__navigators__item__text__title">
                Products
              </Typography>
              <Typography className="pageIndex__navigators__item__text__subTitle">
                Manage and product items and their price change
              </Typography>
            </Box>

            <Box className="pageIndex__navigators__item__notifAndArrow">
              <Box></Box>
              <ArrowCircleRight className="pageIndex__navigators__item__notifAndArrow__arrow" />
            </Box>
          </Box>

          <Box
            className="pageIndex__navigators__item"
            onClick={() => navigate("product-category")}
          >
            <Box className="pageIndex__navigators__item__text">
              <Typography className="pageIndex__navigators__item__text__title">
                Product Category
              </Typography>
              <Typography className="pageIndex__navigators__item__text__subTitle">
                Manage and create product category
              </Typography>
            </Box>

            <Box className="pageIndex__navigators__item__notifAndArrow">
              <Box></Box>
              <ArrowCircleRight className="pageIndex__navigators__item__notifAndArrow__arrow" />
            </Box>
          </Box>

          <Box
            className="pageIndex__navigators__item"
            onClick={() => navigate("product-sub-category")}
          >
            <Box className="pageIndex__navigators__item__text">
              <Typography className="pageIndex__navigators__item__text__title">
                Product Sub Category
              </Typography>
              <Typography className="pageIndex__navigators__item__text__subTitle">
                Manage and create product sub category
              </Typography>
            </Box>

            <Box className="pageIndex__navigators__item__notifAndArrow">
              <Box></Box>
              <ArrowCircleRight className="pageIndex__navigators__item__notifAndArrow__arrow" />
            </Box>
          </Box>

          <Box
            className="pageIndex__navigators__item"
            onClick={() => navigate("meat-type")}
          >
            <Box className="pageIndex__navigators__item__text">
              <Typography className="pageIndex__navigators__item__text__title">
                Meat Type
              </Typography>
              <Typography className="pageIndex__navigators__item__text__subTitle">
                Manage and create meat types
              </Typography>
            </Box>

            <Box className="pageIndex__navigators__item__notifAndArrow">
              <Box></Box>
              <ArrowCircleRight className="pageIndex__navigators__item__notifAndArrow__arrow" />
            </Box>
          </Box>

          <Box
            className="pageIndex__navigators__item"
            onClick={() => navigate("uom")}
          >
            <Box className="pageIndex__navigators__item__text">
              <Typography className="pageIndex__navigators__item__text__title">
                Unit of Measurements
              </Typography>
              <Typography className="pageIndex__navigators__item__text__subTitle">
                Manage and create unit of measurements
              </Typography>
            </Box>

            <Box className="pageIndex__navigators__item__notifAndArrow">
              <Box></Box>
              <ArrowCircleRight className="pageIndex__navigators__item__notifAndArrow__arrow" />
            </Box>
          </Box>

          <Box
            className="pageIndex__navigators__item"
            onClick={() => navigate("price-mode-setup")}
          >
            <Box className="pageIndex__navigators__item__text">
              <Typography className="pageIndex__navigators__item__text__title">
                Price Mode Setup
              </Typography>
              <Typography className="pageIndex__navigators__item__text__subTitle">
                Manage and create price modes
              </Typography>
            </Box>

            <Box className="pageIndex__navigators__item__notifAndArrow">
              <Box></Box>
              <ArrowCircleRight className="pageIndex__navigators__item__notifAndArrow__arrow" />
            </Box>
          </Box>

          <Box
            className="pageIndex__navigators__item"
            onClick={() => navigate("price-mode-management")}
          >
            <Box className="pageIndex__navigators__item__text">
              <Typography className="pageIndex__navigators__item__text__title">
                Price Mode Management
              </Typography>
              <Typography className="pageIndex__navigators__item__text__subTitle">
                Tagging of items and price change for each price mode
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

export default Setup;
