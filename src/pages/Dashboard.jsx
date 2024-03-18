import { Box, Tooltip, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import "../assets/styles/dashboard.styles.scss";
import {
  ArrowDownward,
  ArrowUpward,
  Group,
  Info,
  KeyboardDoubleArrowRight,
  Schedule,
  SupervisorAccount,
} from "@mui/icons-material";
import { BarChart } from "@mui/x-charts";
import { dummyDataset, dummyInventoryData } from "../utils/DummyData";
import { useNavigate } from "react-router-dom";
import { transformName } from "../utils/CustomFunctions";
import Register from "../assets/images/Register.svg";
import Sales from "../assets/images/Sales.svg";
import Inventory from "../assets/images/Inventory.svg";
import DashboardSkeleton from "../components/skeletons/DashboardSkeleton";
import { useGetDashboardDataQuery } from "../features/dashboard/api/dashboardApi";

function Dashboard() {
  //Hooks
  const navigate = useNavigate();
  const fullName = useSelector((state) => state.login.fullname);

  // RTK Query
  const { data, isFetching } = useGetDashboardDataQuery();

  //Functions
  const valueFormatterSeries = (value) =>
    `₱${value?.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionsDigits: 2,
    })}`;

  const valueFormatterTick = (value) => {
    if (value >= 1e9) {
      return (value / 1e9).toFixed(1) + "B";
    } else if (value >= 1e6) {
      return (value / 1e6).toFixed(1) + "M";
    } else if (value >= 1e3) {
      return (value / 1e3).toFixed(1) + "K";
    } else {
      return value.toString();
    }
  };

  if (isFetching) {
    return <DashboardSkeleton />;
  }

  return (
    <Box className="dashboard">
      <Box className="dashboard__top">
        <Box className="dashboard__top__greetingCard">
          <Typography className="dashboard__top__greetingCard__greeting">
            Fresh morning!
          </Typography>

          <Box className="dashboard__top__greetingCard__content">
            <Box className="dashboard__top__greetingCard__content__nameContainer">
              <Typography className="dashboard__top__greetingCard__content__nameContainer__name">
                {transformName(fullName) || "user"}
              </Typography>
            </Box>

            <Box className="dashboard__top__greetingCard__content__messageContainer">
              <Typography className="dashboard__top__greetingCard__content__messageContainer__message">
                Here&apos;s what&apos;s happening
              </Typography>
            </Box>
          </Box>
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
                +20 today
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

              {/* <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  views={["year"]}
                  label="Year"
                  slotProps={{
                    textField: {
                      size: "small",
                    },
                  }}
                  sx={{ width: "120px" }}
                  value={chartYear}
                  onChange={(e) => setChartYear(e.target.value)}
                />
              </LocalizationProvider> */}
            </Box>

            <BarChart
              dataset={dummyDataset}
              xAxis={[{ scaleType: "band", dataKey: "month" }]}
              yAxis={[{ valueFormatter: valueFormatterTick }]}
              series={[
                { dataKey: "amount", valueFormatter: valueFormatterSeries },
              ]}
              colors={["#544d91", "#243448"]}
              skipAnimation
            />
          </Box>

          <Box className="dashboard__body__left__quickLinks">
            <Box
              className="dashboard__body__left__quickLinks__firstCard"
              onClick={() => navigate("customer-registration/registration")}
            >
              <Box className="dashboard__body__left__quickLinks__firstCard__left">
                <Typography className="dashboard__body__left__quickLinks__firstCard__left__title">
                  Register a customer
                </Typography>

                <Box className="dashboard__body__left__quickLinks__firstCard__left__arrow">
                  <KeyboardDoubleArrowRight />
                </Box>
              </Box>

              <Box className="dashboard__body__left__quickLinks__firstCard__imageContainer">
                <img src={Register} alt="registration" />
              </Box>
            </Box>

            <Box
              className="dashboard__body__left__quickLinks__secondCard"
              onClick={() => navigate("sales-management/sales-transaction")}
            >
              <Box className="dashboard__body__left__quickLinks__secondCard__left">
                <Typography className="dashboard__body__left__quickLinks__secondCard__left__title">
                  Create a sales order
                </Typography>

                <Box className="dashboard__body__left__quickLinks__secondCard__left__arrow">
                  <KeyboardDoubleArrowRight />
                </Box>
              </Box>

              <Box className="dashboard__body__left__quickLinks__secondCard__imageContainer">
                <img src={Sales} alt="sales" />
              </Box>
            </Box>

            <Box
              className="dashboard__body__left__quickLinks__thirdCard"
              onClick={() => navigate("inventory-management/mrp")}
            >
              <Box className="dashboard__body__left__quickLinks__thirdCard__left">
                <Typography className="dashboard__body__left__quickLinks__thirdCard__left__title">
                  Manage the inventory
                </Typography>

                <Box className="dashboard__body__left__quickLinks__thirdCard__left__arrow">
                  <KeyboardDoubleArrowRight />
                </Box>
              </Box>

              <Box className="dashboard__body__left__quickLinks__thirdCard__imageContainer">
                <img src={Inventory} alt="inventory" />
              </Box>
            </Box>
          </Box>
        </Box>

        <Box className="dashboard__body__widget">
          <Typography className="dashboard__body__widget__title">
            Near Expiry Overview
          </Typography>

          <Box className="dashboard__body__widget__content">
            {dummyInventoryData
              .sort((a, b) => {
                const ratioA = (a.nearExpiry / a.totalStock) * 100;
                const ratioB = (b.nearExpiry / b.totalStock) * 100;

                return ratioB - ratioA;
              })
              .map((item) => (
                <Box
                  key={item.id}
                  className="dashboard__body__widget__content__item"
                >
                  <Tooltip
                    title={item.itemDescription}
                    sx={{ cursor: "pointer" }}
                    placement="top"
                    PopperProps={{
                      popperOptions: {
                        modifiers: [
                          {
                            name: "offset",
                            options: {
                              offset: [-2, -5],
                            },
                          },
                        ],
                      },
                    }}
                  >
                    <Box className="dashboard__body__widget__content__item__label">
                      <Typography className="dashboard__body__widget__content__item__label__text">
                        {item.itemCode}
                      </Typography>

                      <Info fontSize="" sx={{ color: "gray" }} />
                    </Box>
                  </Tooltip>

                  <Tooltip
                    title={`${item.nearExpiry} over ${item.totalStock} stocks are near expiry`}
                    placement="top"
                  >
                    <Box className="dashboard__body__widget__content__item__full">
                      <Box
                        className="dashboard__body__widget__content__item__full__fill"
                        sx={{
                          width: `${
                            (item.nearExpiry / item.totalStock) * 100
                          }%`,
                        }}
                      />
                    </Box>
                  </Tooltip>
                </Box>
              ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
