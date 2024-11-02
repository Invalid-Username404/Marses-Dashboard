"use client";
import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Head from "next/head";

// Loading spinner component
const LoadingSpinner = () => (
  <motion.div
    className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    role="status"
    aria-label="Loading"
  />
);

// Error message component
const ErrorMessage = ({ message }: { message: string }) => (
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

export default function Signin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError("");
      setLoading(true);

      try {
        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if (!email || !password) {
          setError("Please fill in all fields");
          return;
        }

        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          setError("Invalid email or password");
          return;
        }

        if (result?.ok) {
          const params = new URLSearchParams(window.location.search);
          const callbackUrl = params.get("callbackUrl") || "/dashboard";

          const decodedCallbackUrl = decodeURIComponent(callbackUrl);

          router.replace(decodedCallbackUrl);
        }
      } catch (err) {
        console.error("Sign in error:", err);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  return (
    <>
      <Head>
        <title>Sign In - Marses Robotics</title>
        <meta
          name="description"
          content="Sign in to your Marses Robotics account"
        />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg"
        >
          {/* Logo and Header */}
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

          {/* Error Message */}
          <ErrorMessage message={error} />

          {/* Sign In Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 
                           rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           placeholder:text-gray-400 dark:placeholder:text-gray-500
                           transition-colors"
                  placeholder="Enter your email"
                  aria-describedby="email-error"
                  disabled={loading}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 
                           rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           placeholder:text-gray-400 dark:placeholder:text-gray-500
                           transition-colors"
                  placeholder="Enter your password"
                  aria-describedby="password-error"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 rounded border-gray-300 
                           focus:ring-blue-500 dark:border-gray-600 
                           dark:focus:ring-blue-600"
                  disabled={loading}
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 text-sm text-gray-600 dark:text-gray-400"
                >
                  Remember me
                </label>
              </div>

              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-500 
                         dark:text-blue-400 dark:hover:text-blue-300 
                         transition-colors"
              >
                Forgot your password?
              </Link>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 
                       border border-transparent rounded-xl shadow-sm text-sm 
                       font-medium text-white bg-blue-600 hover:bg-blue-700 
                       focus:outline-none focus:ring-2 focus:ring-offset-2 
                       focus:ring-blue-500 disabled:opacity-50 
                       disabled:cursor-not-allowed transition-colors"
            >
              {loading ? <LoadingSpinner /> : "Sign in"}
            </motion.button>
          </form>

          {/* Sign up link */}
          <div className="text-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Don't have an account?
            </span>{" "}
            <Link
              href="/signup"
              className="font-medium text-blue-600 hover:text-blue-500 
                       dark:text-blue-400 dark:hover:text-blue-300 
                       transition-colors"
            >
              Sign up
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}
