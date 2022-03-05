import {useState} from "react";
import StickyBox from "react-sticky-box";
import styles from "./styles.module.css";

const Sidebar = ({elements}) => {
  const [expanded, setExpanded] = useState();
  return (
    <div className={styles.sidebar}>
      <div className={styles.label}>Sidebar</div>
      {expanded && (
        <div className={styles.fauxNav}>
          {Array.from(new Array(elements), (_, i) => (
            <div key={i} className={styles.fauxNavElement} />
          ))}
        </div>
      )}
      <button onClick={() => setExpanded((v) => !v)}>{expanded ? "collapse" : "expand"}</button>
    </div>
  );
};

export const CollapseContent = () => {
  const [expanded, setExpanded] = useState(true);
  return (
    <div className={styles.baseContent}>
      {Array.from(new Array(expanded ? 30 : 15), (_, i) => (
        <div key={i} className={styles.fauxNavElement} />
      ))}
      <button onClick={() => setExpanded((v) => !v)}>{expanded ? "collapse" : "expand"}</button>
    </div>
  );
};

export const StickySidebar = ({elements, offsetTop, offsetBottom}) => (
  <StickyBox offsetTop={offsetTop} offsetBottom={offsetBottom}>
    <Sidebar elements={elements} />
  </StickyBox>
);

export const BottomStickySidebar = ({elements, offsetTop, offsetBottom, style}) => (
  <StickyBox offsetTop={offsetTop} offsetBottom={offsetBottom} bottom style={style}>
    <Sidebar elements={elements} />
  </StickyBox>
);

export const StickyWord = ({style, word, offsetTop, offsetBottom, bottom}) => (
  <StickyBox offsetTop={offsetTop} offsetBottom={offsetBottom} style={style} bottom={bottom}>
    {word}
  </StickyBox>
);

export default Sidebar;
