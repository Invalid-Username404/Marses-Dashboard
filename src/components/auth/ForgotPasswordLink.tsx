import Link from "next/link";
import { motion } from "framer-motion";

export default function ForgotPasswordLink() {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Link
        href="/forgot-password"
        className="text-sm font-medium text-blue-600 hover:text-blue-500 
          dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
      >
        Forgot your password?
      </Link>
    </motion.div>
  );
}
