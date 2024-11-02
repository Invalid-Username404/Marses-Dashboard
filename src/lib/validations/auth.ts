import { z } from "zod";

// Base schema for individual field validation
const signUpFields = {
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter"),
  confirmPassword: z.string(),
  terms: z.boolean(),
  profilePicture: z.instanceof(File).nullable(),
};

// Export individual field schemas for single-field validation
export const signUpFieldSchemas = signUpFields;

// Export the complete schema with refinements for full form validation
export const signUpSchema = z
  .object(signUpFields)
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.terms === true, {
    message: "You must accept the terms and conditions",
    path: ["terms"],
  });

export type SignUpInput = z.infer<typeof signUpSchema>;
