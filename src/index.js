import React from "react";
import PropTypes from "prop-types";
import ResizeObserver from "resize-observer-polyfill";

const getScrollParent = node => {
  let parent = node;
  while ((parent = parent.parentElement)) {
    const overflowYVal = getComputedStyle(parent, null).getPropertyValue("overflow-y");
    if (parent === document.body) return window;
    if (overflowYVal === "auto" || overflowYVal === "scroll") return parent;
  }
  return window;
};

const offsetTill = (node, target) => {
  let current = node;
  let offset = 0;
  // If target is not an offsetParent itself, subtract its offsetTop and set correct target
  if (target.firstChild && target.firstChild.offsetParent !== target) {
    offset += node.offsetTop - target.offsetTop;
    target = node.offsetParent;
    offset += -node.offsetTop;
  }
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

// Inspired by https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md#feature-detection
let passiveArg = false;
try {
  var opts = Object.defineProperty({}, "passive", {
    // eslint-disable-next-line getter-return
    get() {
      passiveArg = {passive: true};
    },
  });
  window.addEventListener("testPassive", null, opts);
  window.removeEventListener("testPassive", null, opts);
} catch (e) {}

export default class StickyBox extends React.Component {
  constructor(props) {
    super(props);
    if (props.offset && process.env.NODE_ENV !== "production") {
      console.warn(
        `react-sticky-box's "offset" prop is deprecated. Please use "offsetTop" instead. It'll be removed in v0.8.`
      );
    }
  }

  registerContainerRef = n => {
    if (!stickyProp) return;
    this.node = n;
    if (n) {
      this.scrollPane = getScrollParent(this.node);
      this.latestScrollY = this.scrollPane === window ? window.scrollY : this.scrollPane.scrollTop;

      this.scrollPane.addEventListener("scroll", this.handleScroll, passiveArg);
      this.scrollPane.addEventListener("mousewheel", this.handleScroll, passiveArg);
      if (this.scrollPane === window) {
        window.addEventListener("resize", this.handleWindowResize);
        this.handleWindowResize();
      } else {
        this.rosp = new ResizeObserver(this.handleScrollPaneResize);
        this.rosp.observe(this.scrollPane);
        this.handleScrollPaneResize();
      }
      this.ropn = new ResizeObserver(this.handleParentNodeResize);
      this.ropn.observe(this.node.parentNode);
      this.handleParentNodeResize();

      this.ron = new ResizeObserver(this.handleNodeResize);
      this.ron.observe(this.node);
      this.handleNodeResize({initial: true});

      this.initial();
    } else {
      this.scrollPane.removeEventListener("mousewheel", this.handleScroll, passiveArg);
      this.scrollPane.removeEventListener("scroll", this.handleScroll, passiveArg);
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

  changeMode(newMode) {
    const {onChangeMode, offsetTop, offsetBottom} = this.props;
    onChangeMode(this.mode, newMode);
    this.mode = newMode;
    if (newMode === "relative") {
      this.node.style.position = "relative";
      this.node.style.top = `${this.offset}px`;
    } else {
      this.node.style.position = stickyProp;
      if (newMode === "stickyBottom") {
        this.node.style.top = `${this.viewPortHeight - this.nodeHeight - offsetBottom}px`;
      } else {
        this.node.style.top = `${offsetTop}px`;
      }
    }
    this.offset = this.getCurrentOffset();
  }

  initial() {
    const {bottom} = this.props;
    if (bottom) {
      if (this.mode !== "stickyBottom") this.changeMode("stickyBottom");
    } else {
      if (this.mode !== "stickyTop") this.changeMode("stickyTop");
    }
  }

  getCurrentOffset = () => {
    if (this.mode === "relative") return this.offset;
    const {offsetTop, offsetBottom} = this.props;
    if (this.mode === "stickyTop") {
      return Math.max(0, this.scrollPaneOffset + this.latestScrollY - this.naturalTop + offsetTop);
    }
    if (this.mode === "stickyBottom") {
      return Math.max(
        0,
        this.scrollPaneOffset +
          this.latestScrollY +
          this.viewPortHeight -
          (this.naturalTop + this.nodeHeight + offsetBottom)
      );
    }
  };

  changeToStickyBottomIfBoxTooLow(scrollY) {
    const {offsetBottom} = this.props;
    if (
      scrollY + this.scrollPaneOffset + this.viewPortHeight >=
      this.naturalTop + this.nodeHeight + this.offset + offsetBottom
    ) {
      this.changeMode("stickyBottom");
    }
  }

  handleWindowResize = () => {
    this.viewPortHeight = window.innerHeight;
    this.scrollPaneOffset = 0;
  };

  handleScrollPaneResize = () => {
    this.viewPortHeight = this.scrollPane.offsetHeight;
    if (process.env.NODE_ENV !== "production" && this.viewPortHeight === 0) {
      console.warn(
        `react-sticky-box's scroll pane has a height of 0. This seems odd. Please check this node:`,
        this.scrollPane
      );
    }
    // Only applicable if scrollPane is an offsetParent
    if (this.scrollPane.firstChild.offsetParent === this.scrollPane) {
      this.scrollPaneOffset = this.scrollPane.getBoundingClientRect().top;
    } else {
      this.scrollPaneOffset = 0;
    }
  };

  handleParentNodeResize = () => {
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
    const oldParentHeight = this.parentHeight;
    this.parentHeight = parentNode.getBoundingClientRect().height - verticalParentPadding;

    if (this.mode === "relative") {
      // If parent height decreased...
      if (oldParentHeight > this.parentHeight) {
        this.changeToStickyBottomIfBoxTooLow(this.latestScrollY);
      }
    }
    if (oldParentHeight !== this.parentHeight && this.mode === "relative") {
      this.latestScrollY = Number.POSITIVE_INFINITY;
      this.handleScroll();
    }
  };

  handleNodeResize = ({initial} = {}) => {
    const prevHeight = this.nodeHeight;
    this.nodeHeight = this.node.getBoundingClientRect().height;
    if (!initial && prevHeight !== this.nodeHeight) {
      const {offsetTop, offsetBottom} = this.props;
      if (this.nodeHeight + offsetTop + offsetBottom <= this.viewPortHeight) {
        // Just make it sticky if node smaller than viewport
        this.mode = undefined;
        this.initial();
        return;
      } else {
        const lowestPossible = this.parentHeight - this.nodeHeight;
        this.offset = Math.max(0, Math.min(lowestPossible, this.getCurrentOffset()));
        this.changeMode("relative");
      }
    }
  };

  handleScroll = () => {
    const {offsetTop, offsetBottom} = this.props;
    const scrollY = this.scrollPane === window ? window.scrollY : this.scrollPane.scrollTop;
    if (scrollY === this.latestScrollY) return;
    if (this.nodeHeight + offsetTop + offsetBottom <= this.viewPortHeight) {
      // Just make it sticky if node smaller than viewport
      this.initial();
      this.latestScrollY = scrollY;
      return;
    }
    const scrollDelta = scrollY - this.latestScrollY;
    this.offset = this.getCurrentOffset();
    if (scrollDelta > 0) {
      // scroll down
      if (this.mode === "stickyTop") {
        if (scrollY + this.scrollPaneOffset + offsetTop > this.naturalTop) {
          if (
            scrollY + this.scrollPaneOffset + this.viewPortHeight <=
            this.naturalTop + this.nodeHeight + this.offset + offsetBottom
          ) {
            this.changeMode("relative");
          } else {
            this.changeMode("stickyBottom");
          }
        }
      } else if (this.mode === "relative") {
        this.changeToStickyBottomIfBoxTooLow(scrollY);
      }
    } else {
      // scroll up
      if (this.mode === "stickyBottom") {
        if (
          this.scrollPaneOffset + scrollY + this.viewPortHeight <
          this.naturalTop + this.parentHeight + offsetBottom
        ) {
          if (this.scrollPaneOffset + scrollY + offsetTop >= this.naturalTop + this.offset) {
            this.changeMode("relative");
          } else {
            this.changeMode("stickyTop");
          }
        }
      } else if (this.mode === "relative") {
        if (this.scrollPaneOffset + scrollY + offsetTop < this.naturalTop + this.offset) {
          this.changeMode("stickyTop");
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
  offsetTop: 0,
  offsetBottom: 0,
};

StickyBox.propTypes = {
  onChangeMode: PropTypes.func,
  offsetTop: PropTypes.number,
  offsetBottom: PropTypes.number,
  bottom: PropTypes.bool,
};
