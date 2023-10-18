import React, { useState } from "react";
import { Box, Typography, Button, TextField } from "@mui/material";
import { useGetAllStoreTypesQuery } from "../../../features/setup/api/storeTypeApi";
import { Storefront } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedStoreType } from "../../../features/prospect/reducers/selectedStoreTypeSlice";
import PageHeaderTabs from "../../../components/PageHeaderTabs";
import ForReleasing from "./ForReleasing";
import Released from "./Released";

function Prospect() {
  const [tabViewing, setTabViewing] = useState(1);

  const selectedStoreType = useSelector(
    (state) => state.selectedStoreType.value
  );
  const dispatch = useDispatch();

  const { data } = useGetAllStoreTypesQuery();

  const prospectNavigation = [
    {
      case: 1,
      name: "For Releasing",
      // badge: totalApprovedFreebies || totalRejectedFreebies || 0,
    },
    {
      case: 2,
      name: "Released",
      // badge: totalReleasedProspects || 0,
    },
  ];

  const tabComponents = {
    1: <ForReleasing />,
    2: <Released />,
  };

  return (
    <Box className="commonPageLayout">
      {selectedStoreType ? (
        // <PageHeaderAdd pageTitle={`Prospect - ${selectedStoreType}`} />
        <PageHeaderTabs
          pageTitle={`Prospect - ${selectedStoreType}`}
          tabsList={prospectNavigation}
          tabViewing={tabViewing}
          setTabViewing={setTabViewing}
        />
      ) : (
        <Typography
          sx={{
            fontWeight: "bold",
            fontSize: "2rem",
            color: "secondary.main",
          }}
        >
          Prospect
        </Typography>
      )}

      {selectedStoreType ? (
        <>{tabComponents[tabViewing]}</>
      ) : (
        <Box
          sx={{
            display: "flex",
            my: "20px",
            // mx: "30px",
            gap: "10px",
          }}
        >
          <Button
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderRadius: "30px",
              backgroundColor: "secondary.main",
              color: "white !important",
              " &:hover": {
                bgcolor: "accent.main",
              },
            }}
            onClick={() => {
              dispatch(setSelectedStoreType("Main"));
            }}
          >
            <Storefront sx={{ fontSize: "400px" }} />
            <Typography sx={{ fontSize: "30px", fontWeight: "600" }}>
              Main
            </Typography>
          </Button>

          <Box
            sx={{
              flex: "1",
              height: "500px",
              margin: "auto",
              borderRadius: "20px",
              display: "flex",
              gap: "20px",
              maxWidth: "900px",
              flexWrap: "wrap",
              justifyContent: "center",
              // alignItems: "center",
              overflow: "auto",
            }}
          >
            {data?.storeTypes?.map((item) => (
              <Button
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  borderRadius: "30px",
                  backgroundColor: "secondary.main",
                  color: "white !important",
                  " &:hover": {
                    bgcolor: "accent.main",
                  },
                }}
              >
                <Storefront sx={{ fontSize: "150px" }} />
                <Typography sx={{ fontSize: "20px", fontWeight: "600" }}>
                  {item.storeTypeName}
                </Typography>
              </Button>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default Prospect;
