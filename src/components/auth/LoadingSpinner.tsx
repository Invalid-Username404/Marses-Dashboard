import { motion } from "framer-motion";

export default function LoadingSpinner() {
  return (
    <motion.div
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="status"
      aria-label="Loading"
    />
  );
}
