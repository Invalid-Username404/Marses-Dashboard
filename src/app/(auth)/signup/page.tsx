"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProfilePicture from "@/components/ProfilePicture";
import { signIn } from "next-auth/react";
import {
  signUpSchema,
  type SignUpInput,
  signUpFieldSchemas,
} from "@/lib/validations/auth";
import { z } from "zod";

type ErrorState = {
  message: string;
  field?: string;
  type: "validation" | "server" | "auth";
};

export default function SignUp() {
  const [step, setStep] = useState(1);
  const totalSteps = 2;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);
  const [status, setStatus] = useState<
    "idle" | "validating" | "submitting" | "signing-in"
  >("idle");
  const [formData, setFormData] = useState<SignUpInput>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
    profilePicture: null as File | null,
  });
  const router = useRouter();
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Real-time validation
    const error = validateField(name, value);
    setFormErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const validateField = (name: string, value: any) => {
    try {
      const fieldSchema =
        signUpFieldSchemas[name as keyof typeof signUpFieldSchemas];
      if (!fieldSchema) return "";

      fieldSchema.parse(value);
      setError(null);
      setStatus("idle");
      return "";
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError({
          message: error.errors[0].message,
          field: String(name),
          type: "validation",
        });
        setStatus("idle");
        return error.errors[0].message;
      }
      setStatus("idle");
      return "Invalid input";
    }
  };

  const validateStep = () => {
    try {
      if (step === 1) {
        const { firstName, lastName, email } = formData;
        z.object({
          firstName: signUpFieldSchemas.firstName,
          lastName: signUpFieldSchemas.lastName,
          email: signUpFieldSchemas.email,
        }).parse({ firstName, lastName, email });
      } else {
        signUpSchema.parse(formData);
      }
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError({
          message: error.errors[0].message,
          field: String(error.errors[0].path[0]),
          type: "validation",
        });
      } else {
        setError({
          message: "Validation failed",
          type: "server",
        });
      }
      setStatus("idle");
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setStatus("validating");

    if (!validateStep()) return;

    if (step < totalSteps) {
      setStep(step + 1);
      setStatus("idle");
      return;
    }

    setStatus("submitting");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("firstName", formData.firstName);
      formDataToSend.append("lastName", formData.lastName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      if (formData.profilePicture) {
        formDataToSend.append("profilePicture", formData.profilePicture);
      }

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create account");
      }

      setStatus("signing-in");

      const signInResult = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (signInResult?.error) {
        throw new Error("Account created but failed to sign in automatically");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setError({
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        type: "server",
      });
      setStatus("idle");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-4 sm:p-6 md:p-8 bg-white rounded-2xl shadow-lg">
        {/* Logo and Header */}
        <div className="flex flex-col items-center space-y-6">
          <Image
            src="/icons/logo.svg"
            alt="logo"
            width={80}
            height={80}
            className="w-auto h-auto"
          />
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Join us to start your journey
            </p>
          </div>
        </div>

        {/* Progress Steps - Make more responsive */}
        <div className="flex justify-center items-center gap-1 sm:gap-2 py-4">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center 
                  justify-center text-sm sm:text-base transition-colors ${
                    step > index
                      ? "bg-blue-600 text-white"
                      : step === index + 1
                      ? "bg-blue-100 text-blue-600 border-2 border-blue-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
              >
                {index + 1}
              </div>
              {index < totalSteps - 1 && (
                <div
                  className={`w-8 sm:w-12 h-1 mx-1 sm:mx-2 transition-colors ${
                    step > index + 1 ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Sign Up Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {step === 1 ? (
            <div className="space-y-6">
              <ProfilePicture
                onImageSelect={(file) =>
                  setFormData((prev) => ({ ...prev, profilePicture: file }))
                }
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="text-sm font-medium text-gray-700"
                  >
                    First name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 
                           rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           placeholder:text-gray-400 dark:placeholder:text-gray-500
                           transition-colors"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                  {formErrors.firstName && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="text-sm font-medium text-gray-700"
                  >
                    Last name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 
                           rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           placeholder:text-gray-400 dark:placeholder:text-gray-500
                           transition-colors"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                  {formErrors.lastName && (
                    <p className="mt-1 text-sm text-red-600">
                      {formErrors.lastName}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
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
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.email}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 
                         rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         placeholder:text-gray-400 dark:placeholder:text-gray-500
                         transition-colors"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                {formErrors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.password}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-gray-700"
                >
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 
                         rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         placeholder:text-gray-400 dark:placeholder:text-gray-500
                         transition-colors"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                {formErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.confirmPassword}
                  </p>
                )}
              </div>
              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                  checked={formData.terms}
                  onChange={handleInputChange}
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-blue-600 hover:text-blue-500"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-blue-600 hover:text-blue-500"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </div>
          )}

          <div className="flex justify-between">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 text-sm font-medium text-blue-600 hover:text-blue-500
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                       transition-colors"
              >
                Back
              </button>
            )}
            <button
              type="submit"
              disabled={status !== "idle"}
              className={`${
                step === 1 ? "w-full" : "px-6"
              } py-3 text-sm font-medium text-white bg-blue-600 
                     hover:bg-blue-700 rounded-xl shadow-sm
                     focus:outline-none focus:ring-2 focus:ring-offset-2 
                     focus:ring-blue-500 transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center`}
            >
              {status !== "idle" ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-3"
                    viewBox="0 0 24 24"
                  >
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
                  {status === "validating" && "Validating..."}
                  {status === "submitting" && "Creating Account..."}
                  {status === "signing-in" && "Signing In..."}
                </>
              ) : step < totalSteps ? (
                "Continue"
              ) : (
                "Create Account"
              )}
            </button>
          </div>
        </form>

        {/* Sign in link */}
        <div className="text-center text-sm">
          <span className="text-gray-600">Already have an account?</span>{" "}
          <Link
            href="/signin"
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
