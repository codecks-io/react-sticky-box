import React from "react";
import getPrefix from "./get-prefix";
import Measure from "react-measure";
import ResizeObserver from 'resize-observer-polyfill';

function getScrollParent(node) {
  let offsetParent = node;
  while ((offsetParent = offsetParent.offsetParent)) {
    const overflowYVal = getComputedStyle(offsetParent, null).getPropertyValue("overflow-y");
    if (overflowYVal === "auto" || overflowYVal === "scroll") return offsetParent;
  }
  return window;
}

function getTotalOffsetTop(node) {
  if (node === window) return 0;
  const docElem = document.documentElement;
  return node.getBoundingClientRect().top + (window.pageYOffset || docElem.scrollTop) - (docElem.clientTop || 0);
}

const allBoxes = {};
let nextBoxId = 1;
export function updateAll() {
  Object.keys(allBoxes).forEach(b => allBoxes[b].handleScroll());
}

export default class StickyBox extends React.Component {

  static propTypes = {
    width: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.oneOf(["measure"])
    ]).isRequired
  }

  state = {
    height: 1,
    measuredWidth: null
  }

  componentDidMount() {
    this.transformMethod = getPrefix("transform", this.node);
    if (!this.transformMethod) return;

    this.latestScrollY = 999999;
    this.mode = "notSet";

    this.computedParentStyle = getComputedStyle(this.node.parentNode.parentNode, null);
    this.scrollPane = getScrollParent(this.node);


    this.scrollPane.addEventListener("scroll", this.handleScroll);
    this.scrollPane.addEventListener("mousewheel", this.handleScroll);
    this.ro = new ResizeObserver(this.handleScroll);
    this.ro.observe(this.node.parentNode.parentNode);

    this.handleScroll();
    this.myId = nextBoxId++;
    allBoxes[this.myId] = this;
    this.setWidth();

  }

  componentDidUpdate(prevProps) {
    if (prevProps.width !== this.props.width) this.setWidth();
  }


  componentWillUnmount() {
    if (!this.transformMethod) return;
    delete allBoxes[this.myId];
    this.removeFixedListener();

    this.scrollPane.removeEventListener("scroll", this.handleScroll);
    this.scrollPane.removeEventListener("mousewheel", this.handleScroll);
    this.ro.disconnect();
  }

  setWidth() {
    if (this.props.width !== "measure") {
      const compStyle = getComputedStyle(this.node);
      const reducePadding = compStyle.getPropertyValue("box-sizing") === "content-box" ? (
        parseInt(compStyle.getPropertyValue("padding-left"), 10) + parseInt(compStyle.getPropertyValue("padding-right"), 10)
      ) : 0;
      this.node.style.width = `${this.props.width - reducePadding}px`;
    }
  }

  handleScroll = ({quickCheck} = {}) => {
    if (this.calculatedScrollPosThisTick) return;

    const scrollY = this.scrollPane === window ? this.scrollPane.scrollY : this.scrollPane.scrollTop;
    if (quickCheck && scrollY === this.latestScrollY) return;

    this.calculatedScrollPosThisTick = true;
    setTimeout(() => {this.calculatedScrollPosThisTick = false; });

    const {bottom} = this.props;

    const containerHeight = this.node.parentNode.parentNode.offsetHeight;
    const parentPaddingTop = parseInt(this.computedParentStyle.getPropertyValue("padding-top"), 10);
    const parentPaddingBottom = parseInt(this.computedParentStyle.getPropertyValue("padding-bottom"), 10);

    const verticalMargin = parentPaddingTop + parentPaddingBottom;

    const scrollDelta = scrollY - this.latestScrollY;
    this.latestScrollY = scrollY;

    const nodeHeight = this.node.getBoundingClientRect().height + verticalMargin;
    const parentTop = getTotalOffsetTop(this.node.parentNode.parentNode);
    const viewPortHeight = this.scrollPane === window ? window.innerHeight : this.scrollPane.offsetHeight;
    const scrollPaneOffsetTop = getTotalOffsetTop(this.scrollPane);
    const scrollPaneOffsetTopWithScroll = scrollPaneOffsetTop + window.scrollY;

    let targetMode = this.mode;
    let nextOffset = this.plainOffset;
    if (!bottom && scrollPaneOffsetTopWithScroll <= parentTop + parentPaddingTop) { // if can't go further up, don't go further up!
      targetMode = "absolute";
      nextOffset = 0;
    } else if (
      !bottom
      && parentTop + containerHeight - Math.min(viewPortHeight + parentPaddingBottom, nodeHeight - parentPaddingTop) <= scrollPaneOffsetTopWithScroll
      && scrollPaneOffsetTopWithScroll !== parentTop + parentPaddingTop + scrollY
    ) { // if can't go further down, don't go further down!
      nextOffset = containerHeight - nodeHeight;
      targetMode = "absolute";
    } else if (bottom && containerHeight + parentTop - parentPaddingBottom < scrollPaneOffsetTopWithScroll + viewPortHeight) { // if can't go further down, don't go further down!
      nextOffset = containerHeight - nodeHeight;
      targetMode = "absolute";
    } else if (bottom && Math.max(viewPortHeight + parentPaddingBottom, nodeHeight - parentPaddingTop) - parentTop + scrollPaneOffsetTopWithScroll < nodeHeight) { // if can't go further up, don't go further up!
      targetMode = "absolute";
      nextOffset = 0;
    } else {
      if (this.mode === "notSet") {
        targetMode = "absolute";
        nextOffset = bottom
          ? scrollPaneOffsetTopWithScroll - parentTop - parentPaddingTop + viewPortHeight - nodeHeight + verticalMargin
          : viewPortHeight >= nodeHeight ? scrollPaneOffsetTopWithScroll - parentTop - parentPaddingTop : 0;
      } else {
        if (viewPortHeight >= nodeHeight) { // if node smaller than window
          targetMode = bottom ? "fixedBottom" : "fixedTop";
        } else if (scrollDelta < 0) { // scroll up and node taller than window
          if (this.mode === "fixedBottom") {
            targetMode = "absolute";
            nextOffset = scrollPaneOffsetTopWithScroll - parentTop - nodeHeight + viewPortHeight + parentPaddingBottom;
          } else if (this.mode === "absolute") {
            if (scrollPaneOffsetTopWithScroll <= parentTop + this.plainOffset + parentPaddingTop) {
              targetMode = "fixedTop";
            }
          }
        } else if (scrollDelta > 0) { // scroll down and node taller than window
          if (this.mode === "fixedTop") {
            targetMode = "absolute";
            nextOffset = scrollPaneOffsetTopWithScroll - parentTop - parentPaddingTop;
          } else if (this.mode === "absolute") {
            if (scrollPaneOffsetTopWithScroll + viewPortHeight >= nodeHeight + parentTop + this.plainOffset - parentPaddingBottom) {
              targetMode = "fixedBottom";
            }
          }
        }
      }
    }

    let nextBottom = 0;
    if (targetMode === "absolute") {
      this.plainOffset = nextOffset;
      nextOffset = nextOffset + this.node.parentNode.parentNode.offsetTop + parentPaddingTop;
    } else if (targetMode === "fixedBottom") {
      nextBottom = viewPortHeight - nodeHeight + verticalMargin;
    }

    if (
      targetMode !== this.mode
      || targetMode === "absolute" && this.offset !== nextOffset
      || targetMode === "fixedBottom" && this.lastBottom !== nextBottom
    ) {
      // console.log("targetMode", targetMode);
      if (targetMode === "fixedTop") {
        this.node.style.top = `${scrollPaneOffsetTop}px`;
        this.node.style.position = "fixed";
        this.node.style[this.transformMethod] = `translate3d(0, 0px, 0)`;
        this.addFixedListener();
      } else if (targetMode === "fixedBottom") {
        this.node.style.top = `${scrollPaneOffsetTop}px`;
        this.node.style.position = "fixed";
        this.node.style[this.transformMethod] = `translate3d(0, ${nextBottom}px, 0)`;
        this.lastBottom = nextBottom;
        this.addFixedListener();
      } else if (targetMode === "absolute") {
        this.node.style.top = "0";
        this.node.style.position = "absolute";
        this.node.style[this.transformMethod] = `translate3d(0, ${nextOffset}px, 0)`;
        this.offset = nextOffset;
        this.removeFixedListener();
      }
      this.mode = targetMode;
    }
  }

  // we need to add this listener since fixed positioned element won't propagate their mousewheel event to the scroll pane below
  // (at least if the scrollpane is not the window)
  addFixedListener() {
    if (!this.hasFixedListener && this.scrollPane !== window) {
      this.node.addEventListener("mousewheel", this.handleMouseWheelOnFixed);
      this.hasFixedListener = true;
    }
  }

  removeFixedListener() {
    if (this.hasFixedListener && this.scrollPane !== window) {
      this.node.removeEventListener("mousewheel", this.handleMouseWheelOnFixed);
      this.hasFixedListener = false;
    }
  }

  handleMouseWheelOnFixed = (e) => {
    this.scrollPane.scrollTop += e.deltaY;
  }

  render() {
    const {width, children, bottom: _, ...rest} = this.props;
    const {height, measuredWidth} = this.state;
    if (width === "measure") {
      return (
        <div style={measuredWidth === null ? {} : {width: measuredWidth, height}}>
          <Measure whiteList={["height", "width"]} onMeasure={({height: h, width: w}) => this.setState({height: h, measuredWidth: w})}>
            <div ref={n => {this.node = n; }} {...rest}>{children}</div>
          </Measure>
        </div>
      );
    } else {
      return (
        <div style={{width, height}}>
          <Measure whiteList={["height"]} onMeasure={({height: h}) => this.setState({height: h})}>
            <div ref={n => {this.node = n; }} {...rest}>{children}</div>
          </Measure>
        </div>
      );
    }
  }
}
