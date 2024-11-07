import { motion } from "framer-motion";

interface AuthButtonProps {
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export default function AuthButton({
  type = "button",
  onClick,
  disabled = false,
  variant = "primary",
  fullWidth = false,
  loading = false,
  loadingText,
  children,
}: AuthButtonProps) {
  const baseStyles =
    "py-3 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center";

  const variantStyles = {
    primary: "text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm",
    secondary: "text-blue-600 hover:text-blue-500",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: variant === "primary" ? 1.02 : 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseStyles} ${variantStyles[variant]} ${
        fullWidth ? "w-full" : "px-6"
      }`}
    >
      {loading && (
        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {loading && loadingText ? loadingText : children}
    </motion.button>
  );
}
