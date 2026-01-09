import type { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary";
  onClick?: () => void;
}

const Button = ({ children, variant = "primary", onClick }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`btn ${variant}`}
    >
      {children}
    </button>
  );
};

export default Button;
