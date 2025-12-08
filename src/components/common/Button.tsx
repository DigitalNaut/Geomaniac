import type { DetailedHTMLProps, ButtonHTMLAttributes, PropsWithChildren } from "react";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { twMerge } from "tailwind-merge";

const buttonStyles = {
  primary: "bg-blue-500 hover:bg-blue-400 text-white",
  secondary: "bg-slate-600 hover:bg-slate-500 text-white",
  danger: "bg-red-500 hover:bg-red-400 text-white",
};

type ButtonProps = PropsWithChildren<DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>> & {
  variant?: keyof typeof buttonStyles;
};

function Button({ children, className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      role="button"
      className={twMerge(
        "flex cursor-pointer items-center justify-center gap-2 rounded-full px-4 py-1 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent",
        buttonStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

type IconProps = {
  icon: IconDefinition;
};

Button.Icon = function Icon({ icon }: IconProps) {
  return <FontAwesomeIcon icon={icon} />;
};

export default Button;
