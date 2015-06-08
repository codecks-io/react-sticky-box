require("./style.less");

import React from "react";
import OSBox from "react-scroll-box";
import range from "lodash.range";

const page = (
  <div className="page-container">
    <div className="top-bar">
      TOP BAR
    </div>
    <div className="content-container">
      <div className="content">
        <OSBox className="content-sidebar">
          {range(10).map(i =><p key={i}>Hi asd as dsa {i}</p>)}
        </OSBox>
        <OSBox className="content-body">
          {range(20).map(i => <p key={i}>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
  quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
  consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
  cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
  proident, sunt in culpa qui officia deserunt mollit anim id est laborum. {i}</p>)}
        </OSBox>
      </div>
    </div>
  </div>
);

window.document.addEventListener("DOMContentLoaded", () => {
  const appEl = window.document.getElementById("app");
  React.render(page, appEl);
});


