import React from "react";
import ResizeObserver from "resize-observer-polyfill";

const getScrollParent = node => {
  let offsetParent = node;
  while ((offsetParent = offsetParent.offsetParent)) {
    const overflowYVal = getComputedStyle(offsetParent, null).getPropertyValue("overflow-y");
    if (overflowYVal === "auto" || overflowYVal === "scroll") return offsetParent;
  }
  return window;
};

const offsetTill = (node, target) => {
  let current = node;
  let offset = 0;
  do {
    offset += current.offsetTop;
    current = current.offsetParent;
  } while (current && current !== target);
  return offset;
};

let stickyProp = null;
if (window.CSS && window.CSS.supports) {
  if (window.CSS.supports("position", "sticky")) stickyProp = "sticky";
  else if (window.CSS.supports("position", "-webkit-sticky")) stickyProp = "-webkit-sticky";
}

export default class StickyBox extends React.Component {
  registerContainerRef = n => {
    if (!stickyProp) return;
    this.node = n;
    if (n) {
      this.scrollPane = getScrollParent(this.node);
      this.latestScrollY = this.scrollPane === window ? window.scrollY : this.scrollPane.scrollTop;
      this.scrollPane.addEventListener("scroll", this.handleScroll);
      this.scrollPane.addEventListener("mousewheel", this.handleScroll);
      if (this.scrollPane === window) {
        window.addEventListener("resize", this.updateViewport);
        this.updateViewport();
      } else {
        this.rosp = new ResizeObserver(this.updateScrollPane);
        this.rosp.observe(this.scrollPane);
        this.updateScrollPane();
      }
      this.ropn = new ResizeObserver(this.updateParentNode);
      this.ropn.observe(this.node.parentNode);
      this.updateParentNode();

      this.ron = new ResizeObserver(this.updateNode);
      this.ron.observe(this.node);
      this.updateNode();

      this.initial();
    } else {
      this.scrollPane.removeEventListener("mousewheel", this.handleScroll);
      this.scrollPane.removeEventListener("scroll", this.handleScroll);
      if (this.scrollPane === window) {
        window.removeEventListener("resize", this.getMeasurements);
      } else {
        this.rosp.disconnect();
      }
      this.ropn.disconnect();
      this.ron.disconnect();
      this.scrollPane = null;
    }
  };

  initial() {
    const {bottom} = this.props;
    if (bottom) {
      if (this.mode !== "stickyBottom") {
        this.mode = "stickyBottom";
        this.node.style.position = stickyProp;
        this.node.style.top = `${this.viewPortHeight - this.nodeHeight}px`;
      }
    } else {
      if (this.mode !== "stickyTop") {
        this.mode = "stickyTop";
        this.node.style.position = stickyProp;
        this.node.style.top = 0;
      }
    }
  }

  updateViewport = () => {
    this.viewPortHeight = window.innerHeight;
    this.scrollPaneOffset = 0;
  };

  updateScrollPane = () => {
    this.viewPortHeight = this.scrollPane.offsetHeight;
    this.scrollPaneOffset = this.scrollPane.getBoundingClientRect().top;
  };

  updateParentNode = () => {
    const parentNode = this.node.parentNode;
    const computedParentStyle = getComputedStyle(parentNode, null);
    const parentPaddingTop = parseInt(computedParentStyle.getPropertyValue("padding-top"), 10);
    const parentPaddingBottom = parseInt(
      computedParentStyle.getPropertyValue("padding-bottom"),
      10
    );
    const verticalParentPadding = parentPaddingTop + parentPaddingBottom;
    this.naturalTop =
      offsetTill(parentNode, this.scrollPane) + parentPaddingTop + this.scrollPaneOffset;
    this.parentHeight = parentNode.getBoundingClientRect().height - verticalParentPadding;
  };

  updateNode = () => {
    this.nodeHeight = this.node.getBoundingClientRect().height;
  };

  handleScroll = () => {
    const scrollY = this.scrollPane === window ? window.scrollY : this.scrollPane.scrollTop;
    if (scrollY === this.latestScrollY) return;
    if (this.nodeHeight <= this.viewPortHeight) {
      // Just make it sticky if node smaller than viewport
      this.initial();
      return;
    }
    const scrollDelta = scrollY - this.latestScrollY;
    if (scrollDelta > 0) {
      // scroll down
      if (this.mode === "stickyTop") {
        if (scrollY + this.scrollPaneOffset > this.naturalTop) {
          this.mode = "relative";
          this.node.style.position = "relative";
          this.offset = Math.max(0, this.scrollPaneOffset + this.latestScrollY - this.naturalTop);
          this.node.style.top = `${this.offset}px`;
        }
      } else if (this.mode === "relative") {
        if (
          scrollY + this.scrollPaneOffset + this.viewPortHeight >
          this.naturalTop + this.nodeHeight + this.offset
        ) {
          this.mode = "stickyBottom";
          this.node.style.position = stickyProp;
          this.node.style.top = `${this.viewPortHeight - this.nodeHeight}px`;
        }
      }
    } else {
      // scroll up
      if (this.mode === "stickyBottom") {
        if (
          this.scrollPaneOffset + scrollY + this.viewPortHeight <
          this.naturalTop + this.parentHeight
        ) {
          this.mode = "relative";
          this.node.style.position = "relative";
          this.offset =
            this.scrollPaneOffset +
            this.latestScrollY +
            this.viewPortHeight -
            (this.naturalTop + this.nodeHeight);
          this.node.style.top = `${this.offset}px`;
        }
      } else if (this.mode === "relative") {
        if (this.scrollPaneOffset + scrollY < this.naturalTop + this.offset) {
          this.mode = "stickyTop";
          this.node.style.position = stickyProp;
          this.node.style.top = 0;
        }
      }
    }

    this.latestScrollY = scrollY;
  };

  render() {
    const {children, className, style} = this.props;
    return (
      <div className={className} style={style} ref={this.registerContainerRef}>
        {children}
      </div>
    );
  }
}
