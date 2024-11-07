import Link from "next/link";
import { motion } from "framer-motion";

export default function SignUpLink() {
  return (
    <div className="text-center mt-4">
      <motion.div
        className="inline-block"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
        </span>
        <Link
          href="/signup"
          className="text-sm font-medium text-blue-600 hover:text-blue-500 
            dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          Sign up
        </Link>
      </motion.div>
    </div>
  );
}
