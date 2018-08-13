import React from "react";
import PropTypes from "prop-types";
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
if (typeof CSS !== "undefined" && CSS.supports) {
  if (CSS.supports("position", "sticky")) stickyProp = "sticky";
  else if (CSS.supports("position", "-webkit-sticky")) stickyProp = "-webkit-sticky";
}

export default class StickyBox extends React.Component {
  static defaultProps = {
    offset: 0,
  };

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
    const {bottom, offset} = this.props;
    if (bottom) {
      if (this.mode !== "stickyBottom") {
        this.props.onChangeMode(this.this.mode, "stickyBottom");
        this.mode = "stickyBottom";
        this.node.style.position = stickyProp;
        this.node.style.top = `${this.viewPortHeight - this.nodeHeight}px`;
      }
    } else {
      if (this.mode !== "stickyTop") {
        this.props.onChangeMode(this.this.mode, "stickyTop");
        this.mode = "stickyTop";
        this.node.style.position = stickyProp;
        this.node.style.top = `${offset}px`;
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
    const {offset} = this.props;
    const scrollY = this.scrollPane === window ? window.scrollY : this.scrollPane.scrollTop;
    if (scrollY === this.latestScrollY) return;
    if (this.nodeHeight + offset <= this.viewPortHeight) {
      // Just make it sticky if node smaller than viewport
      this.initial();
      return;
    }
    const scrollDelta = scrollY - this.latestScrollY;
    if (scrollDelta > 0) {
      // scroll down
      if (this.mode === "stickyTop") {
        if (scrollY + this.scrollPaneOffset + offset > this.naturalTop) {
          this.props.onChangeMode(this.mode, "relative");
          this.mode = "relative";
          this.node.style.position = "relative";
          this.offset = Math.max(
            0,
            this.scrollPaneOffset + this.latestScrollY - this.naturalTop + offset
          );
          this.node.style.top = `${this.offset}px`;
        }
      } else if (this.mode === "relative") {
        if (
          scrollY + this.scrollPaneOffset + this.viewPortHeight >
          this.naturalTop + this.nodeHeight + this.offset
        ) {
          this.props.onChangeMode(this.mode, "stickyBottom");
          this.mode = "stickyBottom";
          this.node.style.position = stickyProp;
          this.node.style.top = `${this.viewPortHeight - this.nodeHeight}px`;
        }
      }
    } else {
      // scroll up
      if (this.mode === "stickyBottom") {
        if (
          this.scrollPaneOffset + scrollY + this.viewPortHeight + offset <
          this.naturalTop + this.parentHeight
        ) {
          this.props.onChangeMode(this.mode, "relative");
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
        if (this.scrollPaneOffset + scrollY + offset < this.naturalTop + this.offset) {
          this.props.onChangeMode(this.mode, "stickyTop");
          this.mode = "stickyTop";
          this.node.style.position = stickyProp;
          this.node.style.top = `${offset}px`;
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

StickyBox.defaultProps = {
  onChangeMode: () => {},
};

StickyBox.propTypes = {
  onChangeMode: PropTypes.func,
};
