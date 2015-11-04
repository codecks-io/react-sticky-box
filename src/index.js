import React from "react";
import getPrefix from "./get-prefix";

function getScrollParent(node) {
  let offsetParent = node;
  while ((offsetParent = offsetParent.offsetParent)) {
    const overflowYVal = getComputedStyle(offsetParent, null).getPropertyValue("overflow-y");
    if (overflowYVal === "auto" || overflowYVal === "scroll") return offsetParent;
  }
  return window;
}

function getTotalOffsetTopUntil(node, targetNode) {
  let offsetParent = node, top = 0;
  while (offsetParent && offsetParent !== targetNode) {
    top += offsetParent.offsetTop;
    offsetParent = offsetParent.offsetParent;
  }
  return top;
}

export default class OSBox extends React.Component {
  static displayName = "OSBox"

  static propTypes = {
    stickToTop: React.PropTypes.bool
  }

  static defaultProps = {
    stickToTop: false
  }

  componentDidMount() {
    this.node = this.refs.container;
    this.transformMethod = getPrefix("transform", this.node);
    if (!this.transformMethod) return;

    this.offset = 0;
    this.lastScrollY = 0;

    this.computedStyle = getComputedStyle(this.node, null);
    this.computedParentStyle = getComputedStyle(this.node.parentNode, null);
    this.scrollPane = getScrollParent(this.node);

    this.thisBoundHandleScroll = ::this.handleScroll;

    this.scrollPane.addEventListener("scroll", this.thisBoundHandleScroll);
    this.scrollPane.addEventListener("mousewheel", this.thisBoundHandleScroll);
    this.handleScroll();
  }

  componentWillUnmount() {
    if (!this.transformMethod) return;
    this.scrollPane.removeEventListener("scroll", this.thisBoundHandleScroll);
    this.scrollPane.removeEventListener("mousewheel", this.thisBoundHandleScroll);
  }

  handleScroll() {
    const currentScrollY = this.scrollPane === window ? this.scrollPane.scrollY : this.scrollPane.scrollTop;
    const scrollDelta = currentScrollY - this.lastScrollY;
    if (!scrollDelta) return;

    this.lastScrollY = currentScrollY;

    // TODO: reliably convert to pixels

    const verticalMargin =
      parseInt(this.computedStyle.getPropertyValue("margin-top"), 10) +
      parseInt(this.computedStyle.getPropertyValue("margin-bottom"), 10) +
      parseInt(this.computedParentStyle.getPropertyValue("padding-top"), 10) +
      parseInt(this.computedParentStyle.getPropertyValue("padding-bottom"), 10);

    const minTop = getTotalOffsetTopUntil(this.node.offsetParent, this.scrollPane);

    let newOffset = null;
    const scrollPaneHeight = this.scrollPane === window ? window.innerHeight : this.scrollPane.offsetHeight;

    if (scrollDelta < 0) {
      // up
      if (scrollPaneHeight > this.node.offsetHeight + verticalMargin) {
        // if node smaller than window
        if (this.props.stickToTop) {
          if (currentScrollY < minTop) {
            newOffset = 0;
          } else {
            if (currentScrollY + this.node.offsetHeight < minTop + this.node.parentNode.offsetHeight - verticalMargin) {
              newOffset = currentScrollY - minTop;
            }
          }
        } else {
          if (currentScrollY + this.offset < minTop + (this.node.offsetHeight + verticalMargin) - scrollPaneHeight) {
            // don't exceed the parentTop
            newOffset = 0;
          } else {
            if (currentScrollY + scrollPaneHeight < minTop + this.offset + this.node.offsetHeight + verticalMargin) {
              // if bottom invisble
              newOffset = currentScrollY - minTop + scrollPaneHeight - this.node.offsetHeight - verticalMargin;
            }
          }
        }
      } else {
        // if node bigger than window
        if (currentScrollY < minTop) {
          // don't exceed the parentTop
          newOffset = 0;
        } else {
          if (currentScrollY < minTop + this.offset) {
            newOffset = currentScrollY - minTop;
          }
        }
      }
    } else if (scrollDelta > 0) {
      // down
      if (scrollPaneHeight > this.node.offsetHeight + verticalMargin) {
        // if node smaller than window
        if (currentScrollY + this.node.offsetHeight > minTop + this.node.parentNode.offsetHeight - verticalMargin) {
          // don't exceed the parentBottom
          newOffset = this.node.parentNode.offsetHeight - verticalMargin - this.node.offsetHeight;
        } else {
          if (currentScrollY > minTop + this.offset) {
            newOffset = currentScrollY - minTop;
          }
        }
      } else {
        // if node bigger than window
        if (scrollPaneHeight + currentScrollY > minTop + this.node.parentNode.offsetHeight) {
          // don't exceed the parentBottom
          newOffset = this.node.parentNode.offsetHeight - this.node.offsetHeight - verticalMargin;
        } else {
          if (currentScrollY + scrollPaneHeight > minTop + this.offset + (this.node.offsetHeight + verticalMargin)) {
            newOffset = currentScrollY - minTop + scrollPaneHeight - (this.node.offsetHeight + verticalMargin);
          }
        }
      }
    }
    if (newOffset !== null && this.offset !== newOffset) {
      this.node.style[this.transformMethod] = `translate3d(0, ${newOffset}px,0)`;
      this.offset = newOffset;
    }
  }

  render() {
    const {stickToTop, ...rest} = this.props;
    return (
      <div {...rest} ref="container"/>
    );
  }
}
