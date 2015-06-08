import React from "react";
import getPrefix from "./get-prefix";

export default class OSBox {
  static displayName = "OSBox"
  static defaultProps = {initialCount: 0}

  componentDidMount() {
    this.node = React.findDOMNode(this);
    this.offset = 0;
    this.scrollY = 0;
    this.transformMethod = getPrefix("transform", this.node);
    if (!this.transformMethod) return;
    this.computedStyle = getComputedStyle(this.node, null);
    this.computedParentStyle = getComputedStyle(this.node.parentNode, null);
    window.addEventListener("scroll", ::this.handleScroll);
    window.addEventListener("mousewheel", ::this.handleScroll);
    this.handleScroll();
  }

  componentWillUnmount() {
    if (!this.transformMethod) return;
    window.removeEventListener("scroll", ::this.handleScroll);
    window.removeEventListener("mousewheel", ::this.handleScroll);
  }

  handleScroll() {
    const scrollDelta = window.scrollY - this.scrollY;
    if (!scrollDelta) return;

    this.scrollY = window.scrollY;

    // TODO: reliably convert to pixels

    const verticalMargin =
      parseInt(this.computedStyle.getPropertyValue("margin-top"), 10) +
      parseInt(this.computedStyle.getPropertyValue("margin-bottom"), 10) +
      parseInt(this.computedParentStyle.getPropertyValue("padding-top"), 10) +
      parseInt(this.computedParentStyle.getPropertyValue("padding-bottom"), 10);


    const minTop = this.node.parentNode.offsetTop;

    let newOffset = null;

    if (scrollDelta < 0) {
      // up
      if (window.innerHeight > this.node.offsetHeight + verticalMargin) {
          // if node smaller than window
        if (this.scrollY + this.offset < minTop + (this.node.offsetHeight + verticalMargin) - window.innerHeight) {
        // don't exceed the parentTop
          newOffset = 0;
        } else {
          if (this.scrollY + window.innerHeight < minTop + this.offset + this.node.offsetHeight + verticalMargin) {
            // if bottom invisble
            newOffset = this.scrollY - minTop + window.innerHeight - this.node.offsetHeight - verticalMargin;
          }
        }
      } else {
        // if node bigger than window
        if (this.scrollY < minTop) {
        // don't exceed the parentTop
          newOffset = 0;
        } else {
          if (this.scrollY < minTop + this.offset) {
            newOffset = this.scrollY - minTop;
          }
        }
      }
    } else if (scrollDelta > 0) {
      // down
      if (window.innerHeight > this.node.offsetHeight + verticalMargin) {
        // if node smaller than window
        if (this.scrollY + this.node.offsetHeight > minTop + this.node.parentNode.offsetHeight - verticalMargin) {
          // don't exceed the parentBottom
          newOffset = this.node.parentNode.offsetHeight - verticalMargin - this.node.offsetHeight;
        } else {
          if (this.scrollY > minTop + this.offset) {
            newOffset = this.scrollY - minTop;
          }
        }
      } else {
        // if node bigger than window
        if (window.innerHeight + this.scrollY > minTop + this.node.parentNode.offsetHeight) {
          // don't exceed the parentBottom
          newOffset = this.node.parentNode.offsetHeight - this.node.offsetHeight - verticalMargin;
        } else {
          if (this.scrollY + window.innerHeight > minTop + this.offset + (this.node.offsetHeight + verticalMargin)) {
            newOffset = this.scrollY - minTop + window.innerHeight - (this.node.offsetHeight + verticalMargin);
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
    return (
      <div {...this.props}/>
    );
  }
}
