"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import AuthHeader from "@/components/auth/AuthHeader";
import ProgressSteps from "@/components/auth/ProgressSteps";
import AuthButton from "@/components/auth/AuthButton";
import ErrorMessage from "@/components/auth/ErrorMessage";

import {
  signUpSchema,
  type SignUpInput,
  signUpFieldSchemas,
} from "@/lib/validations/auth";
import { z } from "zod";
import FirstStepForm from "@/components/auth/signup/FirstStepForm";
import SecondStepForm from "@/components/auth/signup/SecondStepForm";
import SignInLink from "@/components/auth/SignInLink";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-8">
      <div className="max-w-md w-full space-y-8 p-4 sm:p-6 md:p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
        <AuthHeader
          title="Create your account"
          subtitle="Join us to start your journey"
        />

        <ProgressSteps currentStep={step} totalSteps={totalSteps} />

        {error && <ErrorMessage message={error.message} />}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {step === 1 ? (
            <FirstStepForm
              formData={formData}
              formErrors={formErrors}
              handleInputChange={handleInputChange}
              onImageSelect={(file) =>
                setFormData((prev) => ({ ...prev, profilePicture: file }))
              }
            />
          ) : (
            <SecondStepForm
              formData={formData}
              formErrors={formErrors}
              handleInputChange={handleInputChange}
            />
          )}

          <div className="flex justify-between">
            {step > 1 && (
              <AuthButton variant="secondary" onClick={() => setStep(step - 1)}>
                Back
              </AuthButton>
            )}
            <AuthButton
              type="submit"
              variant="primary"
              fullWidth={step === 1}
              disabled={status !== "idle"}
              loading={status !== "idle"}
              loadingText={
                status === "validating"
                  ? "Validating..."
                  : status === "submitting"
                  ? "Creating Account..."
                  : "Signing In..."
              }
            >
              {step < totalSteps ? "Continue" : "Create Account"}
            </AuthButton>
          </div>
        </form>

        <SignInLink />
      </div>
    </div>
  );
}
