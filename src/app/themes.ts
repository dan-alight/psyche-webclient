import type { Theme } from "@emotion/react";

const baseTheme = {
  spacing: {
    xs: 0.25,
    sm: 0.5,
    md: 1,
    lg: 1.5,
    xl: 2,
  },
  typography: {
    fontFamily: "",
    fontSize: {
      sm: 1,
      md: 1.2,
      lg: 1.5,
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      bold: 700,
    },
    lineHeight: {
      body: 1,
      heading: 1.5,
    },
  },
  breakpoints: {
    sm: "480px",
    md: "768px",
    lg: "1024px",
  },
  radii: {
    sm: 0.25,
    md: 0.5,
    lg: 1,
  },
  zIndices: {
    dropdown: 1,
    modal: 2,
    tooltip: 3,
  },
  containerWidths: {
    narrow: 480,
    content: 768,
    wide: 1152,
    modal: 600,
  },
};

export const lightTheme: Theme = {
  ...baseTheme,
  colors: {
    primary: "rgb(55, 226, 95)",
    secondary: "rgb(1,1,1)",
    background: "rgb(255, 255, 255)",
    surface: "rgb(212, 177, 231)",
    text: "rgb(0,0,0)",
    textSecondary: "rgb(0,0,0)",
    border: "rgb(0,0,0)",
    disabled: {
      background: "rgb(153, 153, 153)",
      foreground: "rgb(0,0,0)",
    },
    separator: "rgb(155,155,155)",
    link: {
      default: "rgb(91, 121, 97)",
      active: "rgb(0, 118, 0)",
      hover: "rgb(34, 139, 34)",
    },
    modalBackground: "rgba(255, 255, 255, 0.75)",
  },
};

export const darkTheme = {
  ...baseTheme,
  colors: {
    primary: "#6d0e0d",
    secondary: "#6c757d",
    background: "#121212",
    surface: "#1e1e1e",
    surfaceMenu: "rgba(30, 30, 30, 0.9)",
    text: "#ffffff",
    textSecondary: "#b3b3b3",
    border: "#333333",
    disabled: {
      background: "rgb(0,0,0)",
      foreground: "rgb(0,0,0)",
    },
    separator: "rgb(155,155,155)",
    link: {
      default: "rgb(55, 226, 95)",
      active: "rgb(0, 128, 0)",
      hover: "rgb(34, 139, 34)",
    },
    modalBackground: "rgba(0, 0, 0, 0.5)",
  },
};
