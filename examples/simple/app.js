require("./style.less");

import React from "react";
import ReactDOM from "react-dom";
import StickyBox from "react-sticky-box";
import range from "lodash.range";


class Page extends React.Component {

  state = {
    paragraphCount: 20
  }

  render() {
    const {paragraphCount} = this.state;

    return (
      <div>
        <h1>heading</h1>
        <div className="box2">{range(4).map(i => <p key={i}>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
      quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
      consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
      cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
      proident, sunt in culpa qui officia deserunt mollit anim id est laborum. {i}</p>)}</div>
        <div className="container">
          <StickyBox className="box1" stickToTop>{range(25).map(i => <p key={i}>sidenode {i}</p>)}</StickyBox>
          <StickyBox className="box2">{range(paragraphCount).map(i => <p key={i}>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
      quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
      consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
      cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
      proident, sunt in culpa qui officia deserunt mollit anim id est laborum. {i}</p>)}</StickyBox>
          <StickyBox className="box1" stickToTop>
            <button onClick={() => this.setState({paragraphCount: 1})}>1 Para</button>
            <button onClick={() => this.setState({paragraphCount: 20})}>20 Paras</button>
            {range(3).map(i => <p key={i}>bla sidenode {i}</p>)}
          </StickyBox>
        </div>
        <div>{range(20).map(i => <p key={i}>Stuff below {i}</p>)}</div>
      </div>
    );
  }
}

window.document.addEventListener("DOMContentLoaded", () => {
  const appEl = window.document.getElementById("app");
  ReactDOM.render(<Page/>, appEl);
});


