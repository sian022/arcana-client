import {
  Box,
  Button,
  Card,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import ControlledAutocomplete from "../../components/ControlledAutocomplete";
import SecondaryButton from "../../components/SecondaryButton";
import { Add, Sort } from "@mui/icons-material";

function SalesTransaction() {
  return (
    <Box className="commonPageLayout">
      <Box
        sx={{
          display: "flex",
          gap: "5px",
          border: "1px solid black",
          flex: 1,
          mb: "20px",
          flexDirection: "column",
          borderRadius: "5px",
          bgcolor: "primary.main",
        }}
      >
        <Box
          sx={{
            border: "1px solid red",
            height: "70px",
            // bgcolor: "primary.main",
          }}
        ></Box>

        <Box
          sx={{
            display: "flex",
            border: "1px solid blue",
            flex: 1,
            // px: "5px",
            mx: "5px",
            gap: "5px",
            bgcolor: "white !important",
            borderRadius: "5px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              border: "1px solid green",
              flex: 1,
              flexDirection: "column",
              gap: "5px",
            }}
          >
            <TextField size="small" label="Business Name - Owner's Name" />
            {/* <ControlledAutocomplete
              name={`clientId`}
              control={control}
              options={clientData?.regularClient || []}
              getOptionLabel={(option) =>
                option.businessName?.toUpperCase() +
                  " - " +
                  option.ownersName?.toUpperCase() || ""
              }
              disableClearable
              loading={isClientLoading}
              disabled={drawerMode === "edit"}
              isOptionEqualToValue={(option, value) => true}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  label="Business Name - Owner's Name"
                  // required
                  helperText={errors?.clientId?.message}
                  error={errors?.clientId}
                />
              )}
              onChange={(_, value) => {
                if (watch("clientId") && watch("listingItems")[0]?.itemId) {
                  onClientConfirmationOpen();
                  setConfirmationValue(value);
                  return watch("clientId");
                } else {
                  return value;
                }
              }}
            /> */}

            <Box
              sx={{
                display: "flex",
                gap: "5px",
                justifyContent: "space-between",
              }}
            >
              <TextField
                type="search"
                size="small"
                placeholder="Search"
                sx={{ width: "300px" }}
              />
              <SecondaryButton>
                <Sort />
              </SecondaryButton>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                border: "1px solid orange",
              }}
            >
              <Button
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  px: "20px",
                  py: "5px",
                  m: "5px",
                  // color: "secondary.main",
                  color: "black",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "left",
                  }}
                >
                  <Typography
                    fontSize="1.2rem"
                    fontWeight="700"
                    textTransform="none"
                  >
                    52319
                  </Typography>
                  <Typography fontSize="12px">
                    Rapsarap Chicken Nuggets 200G
                  </Typography>
                </Box>

                <Box
                  sx={{ display: "flex", gap: "20px", alignItems: "center" }}
                >
                  <Box>
                    <Typography fontWeight="700" fontSize="1.3rem">
                      ₱ 200.99
                    </Typography>
                  </Box>
                  <Add />
                </Box>

                {/* </IconButton> */}
              </Button>

              <Button
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  px: "20px",
                  py: "5px",
                  m: "5px",
                  // color: "secondary.main",
                  color: "black",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "left",
                  }}
                >
                  <Typography
                    fontSize="1.2rem"
                    fontWeight="700"
                    textTransform="none"
                  >
                    52319
                  </Typography>
                  <Typography fontSize="12px">
                    Rapsarap Chicken Nuggets 200G
                  </Typography>
                </Box>

                <Box
                  sx={{ display: "flex", gap: "20px", alignItems: "center" }}
                >
                  <Box>
                    <Typography fontWeight="700" fontSize="1.3rem">
                      ₱ 200.99
                    </Typography>
                  </Box>
                  <Add />
                </Box>

                {/* </IconButton> */}
              </Button>

              <Button
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  px: "20px",
                  py: "5px",
                  m: "5px",
                  // color: "secondary.main",
                  color: "black",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "left",
                  }}
                >
                  <Typography
                    fontSize="1.2rem"
                    fontWeight="700"
                    textTransform="none"
                  >
                    52319
                  </Typography>
                  <Typography fontSize="12px">
                    Rapsarap Chicken Nuggets 200G
                  </Typography>
                </Box>

                <Box
                  sx={{ display: "flex", gap: "20px", alignItems: "center" }}
                >
                  <Box>
                    <Typography fontWeight="700" fontSize="1.3rem">
                      ₱ 200.99
                    </Typography>
                  </Box>
                  <Add />
                </Box>

                {/* </IconButton> */}
              </Button>

              <Button
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  px: "20px",
                  py: "5px",
                  m: "5px",
                  // color: "secondary.main",
                  color: "black",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "left",
                  }}
                >
                  <Typography
                    fontSize="1.2rem"
                    fontWeight="700"
                    textTransform="none"
                  >
                    52319
                  </Typography>
                  <Typography fontSize="12px">
                    Rapsarap Chicken Nuggets 200G
                  </Typography>
                </Box>

                <Box
                  sx={{ display: "flex", gap: "20px", alignItems: "center" }}
                >
                  <Box>
                    <Typography fontWeight="700" fontSize="1.3rem">
                      ₱ 200.99
                    </Typography>
                  </Box>
                  <Add />
                </Box>

                {/* </IconButton> */}
              </Button>

              <Button
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  px: "20px",
                  py: "5px",
                  m: "5px",
                  // color: "secondary.main",
                  color: "black",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "left",
                  }}
                >
                  <Typography
                    fontSize="1.2rem"
                    fontWeight="700"
                    textTransform="none"
                  >
                    52319
                  </Typography>
                  <Typography fontSize="12px">
                    Rapsarap Chicken Nuggets 200G
                  </Typography>
                </Box>

                <Box
                  sx={{ display: "flex", gap: "20px", alignItems: "center" }}
                >
                  <Box>
                    <Typography fontWeight="700" fontSize="1.3rem">
                      ₱ 200.99
                    </Typography>
                  </Box>
                  <Add />
                </Box>

                {/* </IconButton> */}
              </Button>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              border: "1px solid green",
              width: "300px",
            }}
          ></Box>
        </Box>

        <Box
          sx={{
            border: "1px solid red",
            height: "40px",
            bgcolor: "primary.main",
          }}
        ></Box>
      </Box>
    </Box>
  );
}

export default SalesTransaction;
