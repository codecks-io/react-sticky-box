import styles from "./styles.module.css";

const Body = ({big, children}) => (
  <div className={big ? styles.bigBody : styles.body}>{children}</div>
);
const Row = ({children, alignItems}) => (
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
const Content = ({children, size = "md"}) => <div className={contentBySize[size]}>{children}</div>;
const Bg = ({children}) => <div className={styles.bg}>{children}</div>;

const CodeBox = ({children}) => <div className={styles.codeBox}>{children}</div>;

const codeResultBySize = {
  sm: styles.codeBoxResultSm,
  md: styles.codeBoxResultMd,
  lg: styles.codeBoxResultLg,
};
const CodeBoxResult = ({children, size = "md"}) => (
  <div className={codeResultBySize[size]}>{children}</div>
);
const CodeBoxCode = ({children}) => <div className={styles.codeBoxCode}>{children}</div>;

export {Row, Body, Content, CodeBox, CodeBoxResult, CodeBoxCode, Bg};
