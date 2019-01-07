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

  getOffsets() {
    const {offset: deprecatedOffset, offsetTop: propOffsetTop, offsetBottom} = this.props;
    return {
      offsetTop: propOffsetTop || deprecatedOffset,
      offsetBottom,
    };
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
      this.updateNode({initial: true});

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

  initial() {
    const {bottom} = this.props;
    const {offsetTop, offsetBottom} = this.getOffsets();
    if (bottom) {
      if (this.mode !== "stickyBottom") {
        this.props.onChangeMode(this.mode, "stickyBottom");
        this.mode = "stickyBottom";
        this.node.style.position = stickyProp;
        this.node.style.top = `${this.viewPortHeight - this.nodeHeight - offsetBottom}px`;
      }
    } else {
      if (this.mode !== "stickyTop") {
        this.props.onChangeMode(this.mode, "stickyTop");
        this.mode = "stickyTop";
        this.node.style.position = stickyProp;
        this.node.style.top = `${offsetTop}px`;
      }
    }
  }

  updateViewport = () => {
    this.viewPortHeight = window.innerHeight;
    this.scrollPaneOffset = 0;
  };

  updateScrollPane = () => {
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

  changeToStickyBottomIfBoxTooLow(scrollY) {
    const {offsetBottom} = this.getOffsets();
    if (
      scrollY + this.scrollPaneOffset + this.viewPortHeight >=
      this.naturalTop + this.nodeHeight + this.offset + offsetBottom
    ) {
      this.switchToStickyBottom();
    }
  }

  updateNode = ({initial} = {}) => {
    const prevHeight = this.nodeHeight;
    this.nodeHeight = this.node.getBoundingClientRect().height;
    if (!initial && prevHeight !== this.nodeHeight) {
      this.mode = undefined;
      const {offsetTop, offsetBottom} = this.getOffsets();
      if (this.nodeHeight + offsetTop + offsetBottom <= this.viewPortHeight) {
        // Just make it sticky if node smaller than viewport
        this.initial();
        return;
      } else {
        this.mode = "relative";
        this.node.style.position = "relative";
        const lowestPossible = this.parentHeight - this.nodeHeight;
        const current = this.scrollPaneOffset + this.latestScrollY - this.naturalTop + offsetTop;
        this.offset = Math.max(0, Math.min(lowestPossible, current));
        this.node.style.top = `${this.offset}px`;
      }
    }
  };

  handleScroll = () => {
    const {offsetTop, offsetBottom} = this.getOffsets();
    const scrollY = this.scrollPane === window ? window.scrollY : this.scrollPane.scrollTop;
    if (scrollY === this.latestScrollY) return;
    if (this.nodeHeight + offsetTop + offsetBottom <= this.viewPortHeight) {
      // Just make it sticky if node smaller than viewport
      this.initial();
      this.latestScrollY = scrollY;
      return;
    }
    const scrollDelta = scrollY - this.latestScrollY;
    if (scrollDelta > 0) {
      // scroll down
      if (this.mode === "stickyTop") {
        this.offset = Math.max(
          0,
          this.scrollPaneOffset + this.latestScrollY - this.naturalTop + offsetTop
        );
        if (scrollY + this.scrollPaneOffset + offsetTop > this.naturalTop) {
          if (
            scrollY + this.scrollPaneOffset + this.viewPortHeight <=
            this.naturalTop + this.nodeHeight + this.offset + offsetBottom
          ) {
            this.props.onChangeMode(this.mode, "relative");
            this.mode = "relative";
            this.node.style.position = "relative";
            this.node.style.top = `${this.offset}px`;
          } else {
            this.switchToStickyBottom();
          }
        }
      } else if (this.mode === "relative") {
        this.changeToStickyBottomIfBoxTooLow(scrollY);
      }
    } else {
      // scroll up
      if (this.mode === "stickyBottom") {
        this.offset = Math.max(
          0,
          this.scrollPaneOffset +
            this.latestScrollY +
            this.viewPortHeight -
            (this.naturalTop + this.nodeHeight + offsetBottom)
        );
        if (
          this.scrollPaneOffset + scrollY + this.viewPortHeight <
          this.naturalTop + this.parentHeight + offsetBottom
        ) {
          if (this.scrollPaneOffset + scrollY + offsetTop >= this.naturalTop + this.offset) {
            this.props.onChangeMode(this.mode, "relative");
            this.mode = "relative";
            this.node.style.position = "relative";
            this.node.style.top = `${this.offset}px`;
          } else {
            this.switchToStickyTop();
          }
        }
      } else if (this.mode === "relative") {
        if (this.scrollPaneOffset + scrollY + offsetTop < this.naturalTop + this.offset) {
          this.switchToStickyTop();
        }
      }
    }

    this.latestScrollY = scrollY;
  };

  switchToStickyBottom = () => {
    const {_, offsetBottom} = this.getOffsets();
    this.props.onChangeMode(this.mode, "stickyBottom");
    this.mode = "stickyBottom";
    this.node.style.position = stickyProp;
    this.node.style.top = `${this.viewPortHeight - this.nodeHeight - offsetBottom}px`;
  };

  switchToStickyTop = () => {
    const {offsetTop, _} = this.getOffsets();
    this.props.onChangeMode(this.mode, "stickyTop");
    this.mode = "stickyTop";
    this.node.style.position = stickyProp;
    this.node.style.top = `${offsetTop}px`;
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
  offset: 0,
  offsetTop: 0,
  offsetBottom: 0,
};

StickyBox.propTypes = {
  onChangeMode: PropTypes.func,
  offset: PropTypes.number, // deprecated
  offsetTop: PropTypes.number,
  offsetBottom: PropTypes.number,
  bottom: PropTypes.bool,
};
