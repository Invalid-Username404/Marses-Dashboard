import { motion, AnimatePresence } from "framer-motion";

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-3 rounded-lg bg-red-50 text-red-600 text-sm"
          role="alert"
        >
          <p>{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
