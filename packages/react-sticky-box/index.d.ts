import * as React from "react";

type UseStickyBoxOptions = {
  offsetTop?: number;
  offsetBottom?: number;
  bottom?: boolean;
};

type StickyBoxCompProps = UseStickyBoxOptions & {
  style?: React.CSSProperties;
  className?: string;
  children: React.ReactNode;
};

declare const useStickyBox: <T = any>(options?: UseStickyBoxOptions) => React.RefCallback<T>;
declare const StickyBoxComp: React.FunctionComponent<StickyBoxCompProps>;

export {StickyBoxComp as default, useStickyBox, StickyBoxCompProps, UseStickyBoxOptions};
