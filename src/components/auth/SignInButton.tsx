import { motion } from "framer-motion";

interface SignInButtonProps {
  loading: boolean;
}

export default function SignInButton({ loading }: SignInButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      type="submit"
      disabled={loading}
      className="w-full flex justify-center items-center px-4 py-3 border border-transparent 
        text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        "Sign in"
      )}
    </motion.button>
  );
}
