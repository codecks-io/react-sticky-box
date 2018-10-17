import React from "react";
import styles from "./styles.module.css";

export default class Sidebar extends React.Component {
  state = {
    isExpanded: false,
  };

  render() {
    const {isExpanded} = this.state;
    const {elements = 10} = this.props;
    return (
      <div className={styles.sidebar}>
        <div className={styles.label}>Sidebar</div>
        {isExpanded && (
          <div className={styles.fauxNav}>
            {Array.from(new Array(elements), (_, i) => (
              <div key={i} className={styles.fauxNavElement} />
            ))}
          </div>
        )}
        <button onClick={() => this.setState({isExpanded: !isExpanded})}>
          {isExpanded ? "collapse" : "expand"}
        </button>
      </div>
    );
  }
}
