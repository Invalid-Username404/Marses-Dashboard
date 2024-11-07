interface AuthInputProps {
  id: string;
  name: string;
  type: string;
  label: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
}

export default function AuthInput({
  id,
  name,
  type,
  label,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  autoComplete,
  placeholder,
}: AuthInputProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        required={required}
        className={`mt-1 block w-full px-4 py-3 border ${
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-gray-300 dark:border-gray-700 focus:ring-blue-500"
        } rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
          focus:ring-2 focus:border-transparent
          placeholder:text-gray-400 dark:placeholder:text-gray-500
          transition-colors`}
        placeholder={placeholder}
        aria-describedby={`${id}-error`}
        aria-invalid={!!error}
        disabled={disabled}
      />
      {error && (
        <p
          id={`${id}-error`}
          className="mt-1 text-sm text-red-500"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
