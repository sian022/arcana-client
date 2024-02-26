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

function Dashboard() {
  const fullName = useSelector((state) => state.login.fullname);

  const valueFormatter = (value) =>
    `₱${value?.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionsDigits: 2,
    })}`;

  return (
    <Box className="dashboard">
      <Box className="dashboard__top">
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

        <Box className="dashboard__top__thirdCard">Something</Box>
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
            <Box className="dashboard__body__left__quickLinks__firstCard">
              Go to Customer Registration
            </Box>

            <Box className="dashboard__body__left__quickLinks__secondCard">
              Go to Sales Management
            </Box>

            <Box className="dashboard__body__left__quickLinks__thirdCard">
              Go to Inventory
            </Box>
          </Box>
        </Box>

        <Box className="dashboard__body__widget">
          <Typography className="dashboard__body__widget__title">
            Inventory
          </Typography>

          <Box className="dashboard__body__widget__content">
            {dummyInventoryData.map((item) => (
              <Box
                key={item.id}
                className="dashboard__body__widget__content__item"
              >
                <Tooltip
                  title={item.itemDescription}
                  sx={{ cursor: "pointer" }}
                >
                  <Box className="dashboard__body__widget__content__item__label">
                    <Typography className="dashboard__body__widget__content__item__label__text">
                      {item.itemCode}
                    </Typography>

                    <Info fontSize="" sx={{ color: "gray" }} />
                  </Box>
                </Tooltip>

                <Box className="dashboard__body__widget__content__item__value" />
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
