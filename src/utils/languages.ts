export type Language = "id" | "en";

export const languageMap: Record<Language, { locale: string }> = {
  id: { locale: "id-ID" },
  en: { locale: "en-US" },
};