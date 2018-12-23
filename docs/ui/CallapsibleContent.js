import React from "react";
import styles from "./styles.module.css";

export default class CallapsibleContent extends React.Component {
  state = {
    isExpanded: this.props.isExpandedInitially,
  };

  render() {
    const {isExpanded} = this.state;
    return (
      <div className={styles.flexibleHeightContent}>
        {Array.from(new Array(isExpanded ? 30 : 15), (_, i) => (
          <div key={i} className={styles.fauxNavElement} />
        ))}
        <button onClick={() => this.setState({isExpanded: !isExpanded})}>
          {isExpanded ? "collapse" : "expand"}
        </button>
      </div>
    );
  }
}
