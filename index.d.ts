import * as React from "react";
import ResizeObserver from "resize-observer-polyfill";

export type StickyBoxMode = "relative" | "stickyBottom" | "stickyTop";

interface StickyBoxProps {
  offsetTop?: number;
  offsetBottom?: number;
  bottom?: boolean;
  onChangeMode?: (oldMode: StickyBoxMode | undefined, newMode: StickyBoxMode) => any;
  style?: React.CSSProperties;
  className?: string;
  children: React.ReactNode;
}

export interface StickyBoxInstance {
  mode: StickyBoxMode;
  node: HTMLElement;
  scrollPane: HTMLElement | Window;
  parentHeight: number;
  naturalTop: number;
  nodeHeight: number;
  viewportHeight: number;
  offset: number;
  latestScrollY: number;
}

declare const IStickyBox: React.ComponentClass<StickyBoxProps>;

export {IStickyBox as default};
