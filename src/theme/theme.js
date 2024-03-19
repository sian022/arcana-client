import { createTheme } from "@mui/material";

const colorSchemes = {
  light: {
    primary: "#544d91",
    primaryLight: "#EAE9F4",
    secondary: "#243448",
    tertiary: "#008080",
    accent: "#766bb9",
    error: "#BB0000",
    warning: "#D89C00",
    success: "#009c7a",
    notification: "#F30737",
    // error: "#F30737",
  },
};

export const theme = createTheme({
  palette: {
    primary: {
      main: colorSchemes.light.primary,
      light: colorSchemes.light.primaryLight,
    },
    secondary: {
      main: colorSchemes.light.secondary,
    },
    tertiary: {
      main: colorSchemes.light.tertiary,
    },
    accent: {
      main: colorSchemes.light.accent,
    },
    error: {
      main: colorSchemes.light.error,
    },
    success: {
      main: colorSchemes.light.success,
    },
    warning: {
      main: colorSchemes.light.warning,
    },
    notification: {
      main: colorSchemes.light.notification,
    },
    white: {
      main: "#FFFFFF",
    },
  },

  typography: {
    fontFamily: null,
  },

  components: {
    MuiButton: {
      variants: [
        {
          props: { size: "extraSmall" },
          style: { fontSize: "12px", fontWeight: "500", padding: "4px 8px" },
        },
      ],
    },

    MuiInputBase: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          color: colorSchemes.light.secondary,
          backgroundColor: ownerState?.formControl?.required
            ? "#f3f1ff"
            : ownerState?.formControl?.disabled
            ? "#f1f1f1"
            : "null",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: colorSchemes.light.primary,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: `${colorSchemes.light.secondary} !important`,
          },
          "& .Mui-active .MuiOutlinedInput-notchedOutline, & .Mui-focused .MuiOutlinedInput-notchedOutline":
            {
              color: `${colorSchemes.light.secondary} !important`,
              borderColor: `${colorSchemes.light.secondary} !important`,
            },

          // "& input": {
          //   textTransform: "uppercase",
          // },
        }),
      },
    },

    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: `${colorSchemes.light.primary}`,
        },
      },
    },

    MuiTableContainer: {
      styleOverrides: {
        root: {
          height: "calc(100vh - 270px)",
          // height: "calc(100vh - 330px)",
          background: "white",
          padding: 0,
          margin: 0,
        },
      },
    },

    MuiTable: {
      styleOverrides: {
        root: {
          // minWidth: 500,
          whiteSpace: "nowrap",
        },
      },
    },

    MuiTableHead: {
      styleOverrides: {
        root: {
          background: colorSchemes.light.primary,
          position: "sticky",
          top: 0,
          zIndex: 1,
        },
      },
    },

    MuiTableBody: {
      maxHeight: "370px",
    },

    MuiTableCell: {
      styleOverrides: {
        head: {
          color: "white",
          fontWeight: "600",
        },
        body: {
          color: colorSchemes.light.secondary,
          fontWeight: "500",
        },
      },
    },

    MuiTablePagination: {
      styleOverrides: {
        root: {
          backgroundColor: colorSchemes.light.primary,
          border: "2px",
          position: "sticky",
          bottom: 0,
          zIndex: 1,
          color: "white",
        },
        selectIcon: {
          color: "white",
        },
        actions: {
          color: "white !important",
        },
      },
    },

    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: colorSchemes.light.secondary,
          padding: 0,
        },
      },
    },

    MuiRadio: {
      styleOverrides: {
        root: {
          color: colorSchemes.light.secondary,
        },
      },
    },
  },
});
