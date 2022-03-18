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

declare function useStickyBox<T = any>(
  options?: UseStickyBoxOptions
): React.RefCallback<T>;

declare function StickyBoxComp(props: StickyBoxCompProps): JSX.Element;

export {
  StickyBoxComp as default,
  useStickyBox,
  StickyBoxCompProps,
  UseStickyBoxOptions,
};
