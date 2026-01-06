import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../../utils/cn";

export type SearchableOption = {
  code: string;
  label: string;
};

type SearchableOptionDropdownProps = {
  options: SearchableOption[];
  selectedCode?: string;
  selectedLabel?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  codeHeader?: string;
  labelHeader?: string;
  buttonClassName?: string;
  panelClassName?: string;
  onSelectAction: (option: SearchableOption) => void;
  matchTriggerWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
};

const Chevron = ({ open }: { open: boolean }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    strokeWidth={1.5} 
    stroke="currentColor" 
    className={cn(
      "w-[15px] h-[15.62px] text-current transition-transform duration-200", 
      open ? "rotate-180" : ""
    )}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
  </svg>
);

const Spinner = () => (
  <svg viewBox="0 0 24 24" className="w-[15px] h-[15.62px] animate-spin text-current" aria-hidden="true" focusable="false">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v3a5 5 0 0 0-5 5H4z" />
  </svg>
);

export const SearchableOptionDropdown = ({
  options,
  selectedCode,
  selectedLabel,
  placeholder = "Select option",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found",
  codeHeader = "Code",
  labelHeader = "Name",
  buttonClassName,
  panelClassName = "w-[360px]",
  onSelectAction,
  matchTriggerWidth = false,
  disabled = false,
  loading = false,
}: SearchableOptionDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [panelWidth, setPanelWidth] = useState<number>();
  
  useEffect(() => {
    if (!matchTriggerWidth) return;
    const updateWidth = () => {
      if (buttonRef.current) setPanelWidth(buttonRef.current.offsetWidth);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [matchTriggerWidth]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // FIX: Menghapus useEffect yang mereset query di sini (Penyebab Warning ESLint)
  
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const filteredOptions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return options;
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(normalized) || option.code.toLowerCase().includes(normalized),
    );
  }, [options, query]);

  const selectedOption = useMemo(
    () => options.find((option) => option.code === selectedCode),
    [options, selectedCode],
  );

  const hasSelection = Boolean(selectedOption || selectedLabel);
  const displayLabel = selectedLabel ?? selectedOption?.label ?? placeholder;

  // Logic: Matikan bg-white jika ada bg- custom
  const hasCustomBg = buttonClassName?.includes("bg-");

  return (
    <div className="relative" ref={containerRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          if (disabled || loading) return;
          
          // FIX: Reset query disini sebelum toggle state
          if (!open) setQuery(""); 
          
          setOpen((prev) => !prev);
        }}
        disabled={disabled || loading}
        className={cn(
          "flex h-11 w-full items-center justify-between gap-2 rounded-xl border border-neutral-200 px-4 text-sm font-semibold outline-none transition",
          
          // Default Background Logic:
          !hasCustomBg && !disabled && !loading ? "bg-white" : "",

          // Focus State
          "focus:border-primary-400 focus:ring-2 focus:ring-primary-100",
          
          // Disabled State
          disabled || loading
            ? "cursor-not-allowed bg-neutral-50 text-neutral-400"
            : "cursor-pointer hover:border-primary-300",
            
          // Text Color Logic
          !hasSelection && !buttonClassName?.includes("text-") ? "text-neutral-400" : "",
          hasSelection && !buttonClassName?.includes("text-") ? "text-neutral-700" : "",
          
          buttonClassName,
        )}
      >
        <span className="truncate">{displayLabel}</span>
        {loading ? <Spinner /> : <Chevron open={open} />}
      </button>

      {open && (
        <div
          className={cn(
            "absolute left-0 top-[calc(100%+8px)] z-50 rounded-2xl border border-neutral-200 bg-white p-3 shadow-lg",
            panelClassName,
          )}
          style={matchTriggerWidth ? { width: panelWidth } : undefined}
        >
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            className="mb-3 w-full rounded-full border border-neutral-200 px-4 py-2 text-sm text-neutral-700 outline-none focus:border-primary-400 placeholder:text-neutral-400"
            autoFocus
          />
          <div className="max-h-60 overflow-y-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-xs font-semibold uppercase text-neutral-400">
                  <th className="px-3 py-1 text-left whitespace-nowrap">{codeHeader}</th>
                  <th className="px-3 py-1 text-left">{labelHeader}</th>
                </tr>
              </thead>
              <tbody>
                {filteredOptions.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="px-2 py-3 text-center text-sm text-neutral-400">{emptyMessage}</td>
                  </tr>
                ) : (
                  filteredOptions.map((option) => {
                    const isSelected = option.code === selectedCode;
                    return (
                      <tr
                        key={option.code}
                        onClick={() => {
                          onSelectAction(option);
                          setOpen(false);
                        }}
                        className={cn(
                          "cursor-pointer text-sm transition-colors",
                          isSelected 
                            ? "bg-primary-50 font-semibold text-primary-700" 
                            : "text-neutral-700 hover:bg-neutral-50"
                        )}
                      >
                        <td className="px-3 py-2 whitespace-nowrap font-semibold text-neutral-500">{option.code}</td>
                        <td className="px-3 py-2"><span className="block truncate">{option.label}</span></td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};