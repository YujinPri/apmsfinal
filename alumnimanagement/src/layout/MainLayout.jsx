import React from "react";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
function MainLayout({ children }) {

  return (
    <div>
      {/* <Topbar /> */}
      <Sidebar />
      <div>{children}</div>
    </div>
  );
}
export default MainLayout;
