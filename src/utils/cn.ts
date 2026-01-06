type ClassValue =
  | string
  | number
  | null
  | undefined
  | ClassValue[]
  | Record<string, boolean | null | undefined>;

const toArray = (value: ClassValue): string[] => {
  if (!value && value !== 0) {
    return [];
  }

  if (typeof value === "string" || typeof value === "number") {
    return [`${value}`];
  }

  if (Array.isArray(value)) {
    return value.flatMap(toArray);
  }

  return Object.entries(value)
    .filter(([, condition]) => Boolean(condition))
    .map(([className]) => className);
};

export const cn = (...inputs: ClassValue[]) =>
  inputs.flatMap(toArray).join(" ");