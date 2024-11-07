"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Head from "next/head";
import SignInForm from "@/components/auth/SignInForm";

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
          callbackUrl: "/dashboard",
        });

        console.log("Sign in result:", result);

        if (result?.error) {
          setError(result.error);
          return;
        }

        if (result?.ok) {
          router.push("/dashboard");
        }
      } catch (err) {
        console.error("Sign in error:", err);
        setError("An unexpected error occurred");
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
        <SignInForm loading={loading} error={error} onSubmit={handleSubmit} />
      </div>
    </>
  );
}
