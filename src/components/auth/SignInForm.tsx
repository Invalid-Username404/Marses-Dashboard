import { motion } from "framer-motion";
import Image from "next/image";
import ErrorMessage from "./ErrorMessage";
import AuthInput from "./AuthInput";
import SignUpLink from "./SignUpLink";
import ForgotPasswordLink from "./ForgotPasswordLink";
import SignInButton from "./SignInButton";
import RememberMeCheckbox from "./RememberMeCheckbox";

interface SignInFormProps {
  loading: boolean;
  error: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function SignInForm({
  loading,
  error,
  onSubmit,
}: SignInFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg"
    >
      <div className="flex flex-col items-center space-y-6">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Image
            src="/icons/logo.svg"
            alt="Marses Robotics logo"
            width={80}
            height={80}
            className="w-auto h-auto"
            priority
          />
        </motion.div>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Please sign in to your account
          </p>
        </div>
      </div>

      <ErrorMessage message={error} />

      <form className="mt-8 space-y-6" onSubmit={onSubmit} noValidate>
        <div className="space-y-4">
          <AuthInput
            id="email"
            name="email"
            type="email"
            label="Email address"
            autoComplete="email"
            required
            placeholder="Enter your email"
            disabled={loading}
          />

          <AuthInput
            id="password"
            name="password"
            type="password"
            label="Password"
            autoComplete="current-password"
            required
            placeholder="Enter your password"
            disabled={loading}
          />
        </div>

        <div className="flex items-center justify-between">
          <RememberMeCheckbox disabled={loading} />
          <ForgotPasswordLink />
        </div>

        <SignInButton loading={loading} />
        <SignUpLink />
      </form>
    </motion.div>
  );
}
