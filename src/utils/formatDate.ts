export type FormatDateOptions = Intl.DateTimeFormatOptions & {
  locale?: string;
};

const defaultOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

const normalizeDate = (value: Date | string | number) => {
  if (value instanceof Date) {
    return value;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
};

export const formatDate = (
  value: Date | string | number,
  options: FormatDateOptions = {},
) => {
  const { locale = "id-ID", ...formatOptions } = options;
  const date = normalizeDate(value);
  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat(locale, {
    ...defaultOptions,
    ...formatOptions,
  }).format(date);
};