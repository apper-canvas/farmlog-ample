import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  type = "text", 
  error, 
  required, 
  options, 
  className,
  children,
  ...props 
}) => {
  return (
    <div className={cn("space-y-1", className)}>
      {label && <Label required={required}>{label}</Label>}
      {type === "select" ? (
        <Select error={error} {...props}>
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          )) || children}
        </Select>
      ) : type === "textarea" ? (
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-lg border border-secondary/30 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200 resize-none",
            error && "border-error focus:border-error focus:ring-error/20"
          )}
          {...props}
        />
      ) : (
        <Input type={type} error={error} {...props} />
      )}
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
};

export default FormField;