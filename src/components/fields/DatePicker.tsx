import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../../utils/cn";
import { formatDate } from "../../utils/formatDate";
import { type Language, languageMap } from "../../utils/languages";
import {
  IconCalendar,
  IconCaretDoubleLeft,
  IconCaretDoubleRight,
  IconCaretLeft,
  IconCaretRight,
} from "../ui/Icons";

type DatePickerProps = {
  id?: string;
  value: Date | null;
  onChangeAction: (date: Date) => void;
  placeholder: string;
  language: Language;
  buttonClassName?: string;
  panelClassName?: string;
  panelMaxWidth?: number;
  disabled?: boolean;
};

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const DEFAULT_PANEL_MAX_WIDTH = 352;

export const DatePicker = ({
  id,
  value,
  onChangeAction,
  placeholder,
  language,
  buttonClassName,
  panelClassName,
  panelMaxWidth,
  disabled = false,
}: DatePickerProps) => {
  const locale = languageMap[language]?.locale ?? "en-US";
  const [open, setOpen] = useState(false);
  const [monthOffset, setMonthOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [internalDate, setInternalDate] = useState<Date | null>(value);
  const [panelWidth, setPanelWidth] = useState<number>();
  const baseDate = value ?? internalDate ?? new Date();

  const baseYear = baseDate.getFullYear();
  const baseMonth = baseDate.getMonth();
  const panelMonth = useMemo(
    () => new Date(baseYear, baseMonth + monthOffset, 1),
    [baseYear, baseMonth, monthOffset],
  );

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const weekDayLabels = useMemo(() => {
    const base = new Date(2024, 0, 7);
    return Array.from({ length: 7 }, (_, index) =>
      new Intl.DateTimeFormat(locale, { weekday: "short" }).format(
        new Date(base.getFullYear(), base.getMonth(), base.getDate() + index),
      ),
    );
  }, [locale]);

  const calendarDays = useMemo(() => {
    const year = panelMonth.getFullYear();
    const month = panelMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const startWeekday = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (Date | null)[] = [];

    for (let i = 0; i < startWeekday; i += 1) cells.push(null);
    for (let day = 1; day <= daysInMonth; day += 1) cells.push(new Date(year, month, day));
    while (cells.length % 7 !== 0) cells.push(null);

    return cells;
  }, [panelMonth]);

  const displayedDate = value ?? internalDate;
  const formattedValue = displayedDate ? formatDate(displayedDate, { locale }) : placeholder;

  useEffect(() => {
    const updatePanelWidth = () => {
      const maxWidth = panelMaxWidth ?? DEFAULT_PANEL_MAX_WIDTH;
      const triggerWidth = buttonRef.current?.offsetWidth ?? maxWidth;
      const viewportWidth = typeof window !== "undefined" ? window.innerWidth - 32 : maxWidth;
      const nextWidth = Math.min(maxWidth, triggerWidth, viewportWidth);
      setPanelWidth(nextWidth);
    };
    updatePanelWidth();
    window.addEventListener("resize", updatePanelWidth);
    return () => window.removeEventListener("resize", updatePanelWidth);
  }, [panelMaxWidth]);

  const shiftMonth = (step: number) => setMonthOffset((previous) => previous + step);

  const handleSelect = (selected: Date) => {
    setInternalDate(selected);
    setMonthOffset(0);
    onChangeAction(selected);
    setOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        ref={buttonRef}
        type="button"
        id={id}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        disabled={disabled}
        className={cn(
          "flex h-11 w-full items-center justify-between rounded-xl border border-neutral-200 bg-white px-4 text-left text-sm font-semibold outline-none transition",
          "focus:border-primary-400 focus:ring-2 focus:ring-primary-100",
          disabled ? "cursor-not-allowed bg-neutral-50 text-neutral-400" : "text-neutral-700",
          !displayedDate ? "text-neutral-400" : "text-neutral-700",
          buttonClassName,
        )}
      >
        <span className="truncate">{formattedValue}</span>
        <IconCalendar className="w-[15px] h-[15.62px] text-neutral-400" />
      </button>

      {open && (
        <div
          className={cn(
            "absolute left-1/2 top-full z-20 mt-2 max-w-full -translate-x-1/2 rounded-2xl border border-neutral-200 bg-white p-4 text-neutral-700 shadow-xl",
            panelClassName,
          )}
          style={{
            width: panelWidth ?? panelMaxWidth ?? DEFAULT_PANEL_MAX_WIDTH,
            maxWidth: panelMaxWidth ?? DEFAULT_PANEL_MAX_WIDTH,
          }}
        >
          <div className="mb-3 flex items-center justify-between gap-2 text-sm font-semibold text-neutral-800">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition hover:border-primary-400"
                onClick={() => shiftMonth(-12)}
              >
                <IconCaretDoubleLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition hover:border-primary-400"
                onClick={() => shiftMonth(-1)}
              >
                <IconCaretLeft className="w-3.5 h-3.5" />
              </button>
            </div>
            <span className="flex-1 text-center">
              {new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(panelMonth)}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition hover:border-primary-400"
                onClick={() => shiftMonth(1)}
              >
                <IconCaretRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition hover:border-primary-400"
                onClick={() => shiftMonth(12)}
              >
                <IconCaretDoubleRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-neutral-400">
            {weekDayLabels.map((label) => <span key={label}>{label}</span>)}
          </div>

          <div className="mt-2 grid grid-cols-7 gap-1 text-sm">
            {calendarDays.map((date, index) => {
              if (!date) return <div key={`empty-${index}`} className="h-9" />;
              const selected = displayedDate ? isSameDay(date, displayedDate) : false;
              return (
                <button
                  type="button"
                  key={date.toISOString()}
                  className={cn(
                    "flex h-9 w-full items-center justify-center rounded-xl transition",
                    selected
                      ? "bg-primary-600 font-semibold text-white shadow"
                      : "text-neutral-700 hover:bg-primary-50"
                  )}
                  onClick={() => handleSelect(date)}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};