import {
  ArrowDownward,
  ArrowUpward,
  BarChart,
  Group,
  Info,
  KeyboardDoubleArrowRight,
  Schedule,
  SupervisorAccount,
} from "@mui/icons-material";
import { Box, Skeleton, Typography } from "@mui/material";
import { dummyDataset } from "../../utils/DummyData";

function DashboardSkeleton() {
  <Box className="dashboard">
    <Box className="dashboard__top">
      <Box className="dashboard__top__greetingCard">
        <Skeleton />
      </Box>

      <Box className="dashboard__top__firstCard">
        <Box className="dashboard__top__firstCard__title">
          <Box className="dashboard__top__firstCard__title__icon">
            <Group sx={{ fontSize: "0.95rem" }} />
          </Box>

          <Typography>Total Customers</Typography>
        </Box>

        <Box className="dashboard__top__firstCard__content">
          <Typography className="dashboard__top__firstCard__content__mainContent">
            {(1000).toLocaleString()}
          </Typography>

          <Box className="dashboard__top__firstCard__content__subContent">
            <Box className="dashboard__top__firstCard__content__subContent__percent">
              <ArrowUpward className="dashboard__top__firstCard__content__subContent__percent__iconUp" />

              <Typography className="dashboard__top__firstCard__content__subContent__percent__number">
                26%
              </Typography>
            </Box>

            <Typography className="dashboard__top__firstCard__content__subContent__difference">
              +200 today
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box className="dashboard__top__secondCard">
        <Box className="dashboard__top__secondCard__title">
          <Box className="dashboard__top__secondCard__title__icon">
            <SupervisorAccount sx={{ fontSize: "0.95rem" }} />
          </Box>

          <Typography>Prospects</Typography>
        </Box>

        <Box className="dashboard__top__secondCard__content">
          <Typography className="dashboard__top__secondCard__content__mainContent">
            {(124).toLocaleString()}
          </Typography>

          <Box className="dashboard__top__secondCard__content__subContent">
            <Box className="dashboard__top__secondCard__content__subContent__percent">
              <ArrowDownward className="dashboard__top__secondCard__content__subContent__percent__iconDown" />

              <Typography className="dashboard__top__secondCard__content__subContent__percent__number">
                26%
              </Typography>
            </Box>

            <Typography className="dashboard__top__secondCard__content__subContent__difference">
              -200 today
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box className="dashboard__top__thirdCard">
        <Box className="dashboard__top__thirdCard__title">
          <Box className="dashboard__top__thirdCard__title__icon">
            <Schedule sx={{ fontSize: "0.95rem" }} />
          </Box>

          <Typography>Pending Transactions</Typography>
        </Box>
        <Box className="dashboard__top__thirdCard__content">
          <Typography className="dashboard__top__thirdCard__content__mainContent">
            {(22).toLocaleString()}
          </Typography>

          <Box className="dashboard__top__thirdCard__content__subContent">
            <Box className="dashboard__top__thirdCard__content__subContent__percent">
              <Info className="dashboard__top__thirdCard__content__subContent__percent__iconDown" />

              <Typography className="dashboard__top__thirdCard__content__subContent__percent__number">
                4
              </Typography>
            </Box>

            <Typography className="dashboard__top__thirdCard__content__subContent__difference">
              overdue payments
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>

    <Box className="dashboard__body">
      <Box className="dashboard__body__left">
        <Box className="dashboard__body__left__chart">
          <Box className="dashboard__body__left__chart__header">
            <Typography>Total Revenue Per Month</Typography>
          </Box>

          <BarChart
            dataset={dummyDataset}
            xAxis={[{ scaleType: "band", dataKey: "month" }]}
            series={[{ dataKey: "amount" }]}
            colors={["#544d91", "#243448"]}
            // skipAnimation
          />
        </Box>

        <Box className="dashboard__body__left__quickLinks">
          <Box className="dashboard__body__left__quickLinks__firstCard">
            <Box className="dashboard__body__left__quickLinks__firstCard__left">
              <Typography className="dashboard__body__left__quickLinks__firstCard__left__title">
                Register a customer
              </Typography>

              <Box className="dashboard__body__left__quickLinks__firstCard__left__arrow">
                <KeyboardDoubleArrowRight />
              </Box>
            </Box>
          </Box>

          <Box className="dashboard__body__left__quickLinks__secondCard">
            <Box className="dashboard__body__left__quickLinks__secondCard__left">
              <Typography className="dashboard__body__left__quickLinks__secondCard__left__title">
                Create a sales order
              </Typography>

              <Box className="dashboard__body__left__quickLinks__secondCard__left__arrow">
                <KeyboardDoubleArrowRight />
              </Box>
            </Box>

            <Box className="dashboard__body__left__quickLinks__secondCard__imageContainer"></Box>
          </Box>

          <Box className="dashboard__body__left__quickLinks__thirdCard">
            <Box className="dashboard__body__left__quickLinks__thirdCard__left">
              <Typography className="dashboard__body__left__quickLinks__thirdCard__left__title">
                Manage the inventory
              </Typography>

              <Box className="dashboard__body__left__quickLinks__thirdCard__left__arrow">
                <KeyboardDoubleArrowRight />
              </Box>
            </Box>

            <Box className="dashboard__body__left__quickLinks__thirdCard__imageContainer"></Box>
          </Box>
        </Box>
      </Box>

      <Box className="dashboard__body__widget">
        <Typography className="dashboard__body__widget__title">
          Near Expiry Overview
        </Typography>

        <Box className="dashboard__body__widget__content"></Box>
      </Box>
    </Box>
  </Box>;
}

export default DashboardSkeleton;
