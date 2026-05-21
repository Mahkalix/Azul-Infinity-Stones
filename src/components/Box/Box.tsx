import React from "react";
import styles from "./Box.module.scss";

type Props = {
  children: React.ReactNode;
  title?: string;
  className?: string;
};

export const Box = ({ children, title, className = "" }: Props) => {
  return (
    <div className={`${styles.box} ${className}`}>
      {title && <h4 className={styles.title}>{title}</h4>}
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default Box;
