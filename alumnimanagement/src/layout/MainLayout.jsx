import React from "react";
import Topbar from "../components/Topbar";
function MainLayout({ children }) {
  return (
    <div>
      <Topbar />
      <div>{children}</div>
    </div>
  );
}
export default MainLayout;
