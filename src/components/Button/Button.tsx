import React from "react";
import PropTypes from "prop-types";
import styles from "./Button.module.scss";

type Props = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "gold";
  size?: "small" | "medium" | "large";
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
};

export const Button = ({
  children,
  variant = "primary",
  size = "medium",
  onClick,
  disabled = false,
  type = "button",
  className = "",
}: Props) => {
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      <span>{children}</span>
    </button>
  );
};

export default Button;
