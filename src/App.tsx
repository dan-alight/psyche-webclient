import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router";

function App() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default App;
