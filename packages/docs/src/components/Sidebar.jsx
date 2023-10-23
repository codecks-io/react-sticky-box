import {useState} from "react";
import StickyBox from "react-sticky-box";
import styles from "./styles.module.css";

const Sidebar = ({elements, preElements}) => {
  const [expanded, setExpanded] = useState();
  return (
    <div className={styles.sidebar}>
      <div className={styles.label}>Sidebar</div>
      {preElements &&
        Array.from(new Array(preElements), (_, i) => (
          <div key={i} className={styles.fauxNavElement} />
        ))}
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

export const CollapseContent = ({elements = 30}) => {
  const [expanded, setExpanded] = useState(true);
  return (
    <div className={styles.baseContent}>
      {Array.from(new Array(expanded ? elements : 15), (_, i) => (
        <div key={i} className={styles.fauxNavElement} />
      ))}
      <button onClick={() => setExpanded((v) => !v)}>{expanded ? "collapse" : "expand"}</button>
    </div>
  );
};

export const StickySidebar = ({offsetTop, offsetBottom, ...rest}) => (
  <StickyBox offsetTop={offsetTop} offsetBottom={offsetBottom}>
    <Sidebar {...rest} />
  </StickyBox>
);

export const BottomStickySidebar = ({offsetTop, offsetBottom, style, ...rest}) => (
  <StickyBox offsetTop={offsetTop} offsetBottom={offsetBottom} bottom style={style}>
    <Sidebar {...rest} />
  </StickyBox>
);

export const StickyWord = ({style, word, offsetTop, offsetBottom, bottom}) => (
  <StickyBox offsetTop={offsetTop} offsetBottom={offsetBottom} style={style} bottom={bottom}>
    {word}
  </StickyBox>
);

export default Sidebar;
