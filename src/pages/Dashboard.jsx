import { Box, Tooltip, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import "../assets/styles/dashboard.styles.scss";
import {
  ArrowDownward,
  ArrowUpward,
  Group,
  Info,
  Schedule,
  SupervisorAccount,
} from "@mui/icons-material";
import { BarChart } from "@mui/x-charts";
import { dummyDataset, dummyInventoryData } from "../utils/DummyData";
import { useNavigate } from "react-router-dom";
import { transformName } from "../utils/CustomFunctions";

function Dashboard() {
  //Hooks
  const navigate = useNavigate();
  const fullName = useSelector((state) => state.login.fullname);

  const valueFormatter = (value) =>
    `₱${value?.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionsDigits: 2,
    })}`;

  return (
    <Box className="dashboard">
      <Box className="dashboard__top">
        <Box className="dashboard__top__greetingCard">
          <Typography className="dashboard__top__greetingCard__greeting">
            Fresh morning!
          </Typography>

          <Box className="dashboard__top__greetingCard__content">
            <Typography className="dashboard__top__greetingCard__content__name">
              {transformName(fullName) || "user"}
            </Typography>

            <Typography className="dashboard__top__greetingCard__content__message">
              Here&apos;s what&apos;s happening today
            </Typography>
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
                <ArrowUpward className="dashboard__top__thirdCard__content__subContent__percent__iconUp" />

                <Typography className="dashboard__top__thirdCard__content__subContent__percent__number">
                  26%
                </Typography>
              </Box>

              <Typography className="dashboard__top__thirdCard__content__subContent__difference">
                +200 today
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
              series={[{ dataKey: "amount", valueFormatter }]}
              colors={["#544d91", "#243448"]}
            />
          </Box>

          <Box className="dashboard__body__left__quickLinks">
            <Box
              className="dashboard__body__left__quickLinks__firstCard"
              onClick={() => navigate("customer-registration/registration")}
            >
              <Typography className="dashboard__body__left__quickLinks__firstCard__title">
                Register a customer
              </Typography>
            </Box>

            <Box
              className="dashboard__body__left__quickLinks__secondCard"
              onClick={() => navigate("sales-management/sales-transaction")}
            >
              <Typography className="dashboard__body__left__quickLinks__secondCard__title">
                Create a sales order
              </Typography>
            </Box>

            <Box className="dashboard__body__left__quickLinks__thirdCard">
              <Typography
                className="dashboard__body__left__quickLinks__thirdCard__title"
                onClick={() => navigate("inventory-management/mrp")}
              >
                Manage the inventory
              </Typography>
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
  // <div>Fresh morning {fullName || "user"}!</div>;
}

export default Dashboard;
