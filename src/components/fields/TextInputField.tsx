import React, { type ChangeEvent } from "react";
import { cn } from "../../utils/cn";

type TextInputFieldProps = {
  id?: string;
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
  value: string;
  onChangeAction: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

export const TextInputField = ({
  id,
  type = "text",
  value,
  onChangeAction,
  placeholder = "",
  className,
  disabled = false,
}: TextInputFieldProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChangeAction(event.target.value);
  };

  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "h-11 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-700 outline-none transition",
          "placeholder:text-neutral-400",
          "focus:border-primary-400 focus:ring-2 focus:ring-primary-100",
          "disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-400",
          className,
        )}
      />
    </div>
  );
};