import { type ChangeEvent } from "react";
import { cn } from "../../utils/cn";

type TextAreaFieldProps = {
  id?: string;
  value: string;
  onChangeAction: (value: string) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
  disabled?: boolean;
};

export const TextAreaField = ({
  id,
  value,
  onChangeAction,
  placeholder = "",
  className,
  rows,
  disabled = false,
}: TextAreaFieldProps) => {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChangeAction(event.target.value);
  };

  return (
    <div className="relative">
      <textarea
        id={id}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={cn(
          "min-h-[112px] w-full resize-none rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-700 outline-none transition",
          "placeholder:text-neutral-400",
          "focus:border-primary-400 focus:ring-2 focus:ring-primary-100",
          "disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-400",
          className,
        )}
      />
    </div>
  );
};