import { createTheme } from "@mui/material";

const colorSchemes = {
  light: {
    primary: "#544d91",
    secondary: "#243448",
    accent: "#766bb9",
    error: "#F30737",
  },
};

export const theme = createTheme({
  palette: {
    primary: {
      main: colorSchemes.light.primary,
    },
    secondary: {
      main: colorSchemes.light.secondary,
    },
    accent: {
      main: colorSchemes.light.accent,
    },
    error: {
      main: colorSchemes.light.error,
    },
    white: {
      main: "#FFFFFF",
    },
  },
  typography: {
    fontFamily: null,
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          color: colorSchemes.light.secondary,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: colorSchemes.light.primary,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: `${colorSchemes.light.secondary} !important`,
          },
          "& .Mui-active .MuiOutlinedInput-notchedOutline": {
            color: `${colorSchemes.light.secondary} !important`,
            borderColor: `${colorSchemes.light.secondary} !important`,
          },
          "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
            color: `${colorSchemes.light.secondary} !important`,
            borderColor: `${colorSchemes.light.secondary} !important`,
          },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: `${colorSchemes.light.primary} !important`,
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          maxHeight: "560px",
          background: "white",
          padding: 0,
          margin: 0,
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          minWidth: 500,
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
        },
        body: {
          color: colorSchemes.light.secondary,
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
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: colorSchemes.light.secondary,
          padding: 0,
          "&:hover": {
            color: colorSchemes.light.primary,
          },
          "&:disabled": {
            color: colorSchemes.light.secondary,
            cursor: "not-allowed",
            pointerEvents: "auto",
          },
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
