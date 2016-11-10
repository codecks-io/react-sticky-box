require("./style.less");

import React from "react";
import ReactDOM from "react-dom";
import StickyBox from "react-sticky-box";
import range from "lodash.range";

const page = (
  <div className="page-container">
    <div className="top-bar">
      TOP BAR
    </div>
    <div className="content-container">
      <div className="content">
        <div className="content-body">
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
  quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
  consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
  cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
  proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </div>
        <div className="side-by-side">
          <StickyBox className="content-sidebar" width={200}>
            {range(20).map(i =><p key={i}>Sidebar Item {i}</p>)}
          </StickyBox>
          <div className="content-body">
            {range(15).map(i => <p key={i}>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
    proident, sunt in culpa qui officia deserunt mollit anim id est laborum. {i}</p>)}
          </div>
          <StickyBox className="content-sidebar" width={200}>
            {range(5).map(i =><p key={i}>Sidebar Item {i}</p>)}
          </StickyBox>
        </div>
        <div className="content-body">
          {range(5).map(i => <p key={i}>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
    proident, sunt in culpa qui officia deserunt mollit anim id est laborum. {i}</p>)}
        </div>
      </div>
    </div>
  </div>
);

window.document.addEventListener("DOMContentLoaded", () => {
  const appEl = window.document.getElementById("app");
  ReactDOM.render(page, appEl);
});


