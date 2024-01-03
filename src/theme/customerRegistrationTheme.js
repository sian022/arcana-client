import { createTheme } from "@mui/material";

export const customerRegistrationTheme = createTheme({
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          "& input": {
            textTransform: "uppercase",
          },
        },
      },
    },
  },
});
