import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router";
import { ThemeProvider } from "@emotion/react";
import { lightTheme, darkTheme } from "@/themes";
import NavBar from "@/components/NavBar";

function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <div css={{display:"flex", height: "100vh"}}>
        <NavBar />
        <Outlet />
      </div>
    </ThemeProvider>
  );
}

export default App;
