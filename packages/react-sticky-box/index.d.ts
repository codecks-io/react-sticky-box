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

type useStickyBox = <T = any>(options?: UseStickyBoxOptions) => React.RefCallback<T>;
type StickyBoxComp = React.FunctionComponent<StickyBoxCompProps>;

export {StickyBoxComp as default, useStickyBox, StickyBoxCompProps, UseStickyBoxOptions};
