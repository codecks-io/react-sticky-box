import * as React from "react";
import ResizeObserver from "resize-observer-polyfill";

interface StickyBoxProps
  extends React.HTMLAttributes<HTMLElement> {
  offset?: number;
  offsetTop?: number;
  offsetBottom?: number;
  bottom?: boolean;
  onChangeMode?: () => void;
}

export interface StickyBoxInstance {
  mode: string;
  node: HTMLElement;
  scrollPane: HTMLElement | Window;
  parentHeight: number;
  naturalTop: number;
  nodeHeight: number;
  viewportHeight: number;
  offset: number;
  updateNode: () => void;
  switchToStickyBottom: () => void;
  ron: ResizeObserver;
  ropn: ResizeObserver;
};

declare const IStickyBox: React.ComponentClass<StickyBoxProps>;

export {IStickyBox as default};