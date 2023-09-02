import React from "react";
import "./topbar.css";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

export default function Topbar() {
  return (
    <div>
      <div className="topbar">
        <div className="topbarWrapper">
          <div className="topbarLeft">
            <div className="topbarTitle">PUP QC APMS</div>
          </div>
          <div className="topbarRight d-flex">
            <div className="topbarFunctions d-flex gap-2 pe-4 border-right">
              <span>about</span>
              <span>help</span>
            </div>
            <div className="ps-4">
              <AccountCircleIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
