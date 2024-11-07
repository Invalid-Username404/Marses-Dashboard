import { SignUpInput } from "@/lib/validations/auth";
import AuthInput from "../AuthInput";
import ProfilePictureUpload from "@/components/auth/signup/ProfilePictureUpload";

interface FirstStepFormProps {
  formData: SignUpInput;
  formErrors: Record<string, string>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageSelect: (file: File | null) => void;
}

export default function FirstStepForm({
  formData,
  formErrors,
  handleInputChange,
  onImageSelect,
}: FirstStepFormProps) {
  return (
    <div className="space-y-6">
      <ProfilePictureUpload
        currentImage={formData.profilePicture}
        onImageSelect={onImageSelect}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AuthInput
          id="firstName"
          name="firstName"
          type="text"
          label="First name"
          value={formData.firstName}
          onChange={handleInputChange}
          error={formErrors.firstName}
          required
          placeholder="John"
          autoComplete="given-name"
        />

        <AuthInput
          id="lastName"
          name="lastName"
          type="text"
          label="Last name"
          value={formData.lastName}
          onChange={handleInputChange}
          error={formErrors.lastName}
          required
          placeholder="Doe"
          autoComplete="family-name"
        />
      </div>

      <AuthInput
        id="email"
        name="email"
        type="email"
        label="Email address"
        value={formData.email}
        onChange={handleInputChange}
        error={formErrors.email}
        required
        placeholder="john@example.com"
        autoComplete="email"
      />
    </div>
  );
}
