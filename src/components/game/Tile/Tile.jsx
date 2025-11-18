import React from "react";
import PropTypes from "prop-types";
import { STONE_COLORS } from "../../../constants";
import styles from "./Tile.module.scss";

export const Tile = ({ stoneType, size = "medium", className = "" }) => {
  const color = STONE_COLORS[stoneType];

  return (
    <div
      className={`${styles.tile} ${styles[size]} ${className}`}
      style={{ backgroundColor: color }}
      data-stone-type={stoneType}
    >
      <div className={styles.glow} style={{ backgroundColor: color }} />
    </div>
  );
};

Tile.propTypes = {
  stoneType: PropTypes.string.isRequired,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  className: PropTypes.string,
};

export default Tile;
