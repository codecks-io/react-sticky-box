import styles from "./styles.module.css";

export const Body = ({big, children}) => (
  <div className={big ? styles.bigBody : styles.body}>{children}</div>
);
export const Row = ({children, alignItems}) => (
  <div className={styles.row} style={alignItems === "end" ? {alignItems: "end"} : null}>
    {children}
  </div>
);

const contentBySize = {
  xs: styles.miniContent,
  sm: styles.smallConent,
  md: styles.content,
  lg: styles.largeContent,
};
export const ContentBox = ({children, size = "md"}) => (
  <div className={contentBySize[size]}>{children}</div>
);
export const Bg = ({children}) => <div className={styles.bg}>{children}</div>;

export const CodeBox = ({children}) => <div className={styles.codeBox}>{children}</div>;

const codeResultBySize = {
  sm: styles.codeBoxResultSm,
  md: styles.codeBoxResultMd,
  lg: styles.codeBoxResultLg,
};
export const CodeBoxResult = ({children, size = "md"}) => (
  <div className={codeResultBySize[size]}>{children}</div>
);
export const CodeBoxCode = ({children}) => <div className={styles.codeBoxCode}>{children}</div>;
