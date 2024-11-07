import { SignUpInput } from "@/lib/validations/auth";
import AuthInput from "../AuthInput";

interface SecondStepFormProps {
  formData: SignUpInput;
  formErrors: Record<string, string>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SecondStepForm({
  formData,
  formErrors,
  handleInputChange,
}: SecondStepFormProps) {
  return (
    <div className="space-y-6">
      <AuthInput
        id="password"
        name="password"
        type="password"
        label="Password"
        value={formData.password}
        onChange={handleInputChange}
        error={formErrors.password}
        required
        placeholder="••••••••"
        autoComplete="new-password"
      />

      <AuthInput
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        label="Confirm password"
        value={formData.confirmPassword}
        onChange={handleInputChange}
        error={formErrors.confirmPassword}
        required
        placeholder="••••••••"
        autoComplete="new-password"
      />

      <div className="flex items-center space-x-2">
        <input
          id="terms"
          name="terms"
          type="checkbox"
          checked={formData.terms}
          onChange={handleInputChange}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label
          htmlFor="terms"
          className="text-sm text-gray-600 dark:text-gray-400"
        >
          I agree to the{" "}
          <a
            href="/terms"
            className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="/privacy"
            className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Privacy Policy
          </a>
        </label>
      </div>
      {formErrors.terms && (
        <p className="mt-1 text-sm text-red-500">{formErrors.terms}</p>
      )}
    </div>
  );
}
