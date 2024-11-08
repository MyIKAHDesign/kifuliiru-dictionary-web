import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  placeholder: string;
  required?: boolean;
  isTextarea?: boolean;
}

export function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  isTextarea = false,
}: InputFieldProps) {
  const Component = isTextarea ? Textarea : Input;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Component
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full ${isTextarea ? "min-h-[120px]" : ""}`}
      />
    </div>
  );
}
