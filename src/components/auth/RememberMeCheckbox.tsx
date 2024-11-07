interface RememberMeCheckboxProps {
  disabled?: boolean;
}

export default function RememberMeCheckbox({
  disabled,
}: RememberMeCheckboxProps) {
  return (
    <label className="flex items-center space-x-2 cursor-pointer group">
      <input
        type="checkbox"
        name="remember"
        disabled={disabled}
        className="w-4 h-4 rounded border-gray-300 text-blue-600 
          focus:ring-blue-500 disabled:opacity-50
          transition-colors cursor-pointer"
      />
      <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-300 transition-colors">
        Remember me
      </span>
    </label>
  );
}
