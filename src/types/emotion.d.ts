// emotion.d.ts (place in your src folder or types folder)
import "@emotion/react";

declare module "@emotion/react" {
  export interface Theme {
    breakpoints: {
      sm: string;
      md: string;
      lg: string;
    };
    colors: {
      primary: string;
      secondary: string;
      background: string;
      surface: string;
      text: string;
      textSecondary: string;
      border: string;
      disabled: {
        background: string;
        foreground: string;
      };
    };
    spacing: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
    };
    radii: {
      sm: number;
      md: number;
      lg: number;
    };
    typography: {
      fontFamily: string;
      fontSize: {
        sm: number;
        md: number;
        lg: number;
      };
      fontWeight: {
        regular: number;
        medium: number;
        bold: number;
      };
      lineHeight: {
        body: number;
        heading: number;
      };
    };
    zIndices: {
      dropdown: number;
      modal: number;
      tooltip: number;
    };
    containerWidths: {
      narrow: number;
      content: number;
      wide: number;
      modal: number;
    };
  }
}
