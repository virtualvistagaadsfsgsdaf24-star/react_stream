import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../../utils/cn";
import { IconFlagUS, IconFlagID, IconCheck } from "../ui/Icons";
import { useEscapeKey } from "../../hooks/common/useEscapeKey";
import { useClickOutside } from "../../hooks/common/useClickOutside";

interface LanguageProps {
  isOpen: boolean;
  onClose: () => void;
}

const Language: React.FC<LanguageProps> = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const [selectedLang, setSelectedLang] = useState(i18n.language);
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEscapeKey(() => {
    if (isOpen) onClose();
  });

  const modalRef = useClickOutside(() => {
    if (isOpen) onClose();
  });

  const handleSave = () => {
    i18n.changeLanguage(selectedLang);
    onClose();
  };

  if (!isVisible) return null;

  const options = [
    { code: "en", label: "English (US)", icon: IconFlagUS },
    { code: "id", label: "Indonesia", icon: IconFlagID },
  ];

  const isNoChange = selectedLang === i18n.language;
  const animationClass = isOpen
    ? "animate-fade-in-down"
    : "animate-fade-out-up opacity-0";

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 transition-opacity duration-300",
        isOpen ? "opacity-100" : "opacity-0"
      )}
    >
      <div
        ref={modalRef}
        className={cn(
          "w-full max-w-lg rounded-2xl bg-white shadow-xl flex flex-col p-6 gap-5",
          animationClass
        )}
      >
        <h3 className="text-lg font-semibold text-neutral-950 leading-none tracking-tight">
          {t("change_language")}
        </h3>

        <div className="flex flex-col gap-4">
          {options.map((option) => {
            const isSelected = selectedLang === option.code;
            const FlagIcon = option.icon;

            return (
              <button
                key={option.code}
                onClick={() => setSelectedLang(option.code)}
                disabled={isSelected}
                className={cn(
                  "flex items-center justify-between w-full h-16 px-3 py-3 rounded-lg transition-all",
                  "shadow-sm bg-white",
                  isSelected
                    ? "border border-primary-600 cursor-default"
                    : "border border-transparent hover:bg-neutral-50 cursor-pointer"
                )}
              >
                <div className="flex items-center gap-4">
                  <FlagIcon className="w-10 h-10" />
                  <span className="text-sm font-medium text-neutral-950 tracking-tight">
                    {option.label}
                  </span>
                </div>

                {isSelected && (
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary-100 border border-primary-600 text-primary-600">
                    <IconCheck className="w-2 h-2" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex justify-end gap-2.5 mt-2">
          <button
            onClick={onClose}
            className="w-24 h-8 rounded-md border border-primary-600 text-primary-600 text-sm font-medium hover:bg-primary-50 transition-colors flex items-center justify-center"
          >
            {t("cancel")}
          </button>

          <button
            onClick={handleSave}
            disabled={isNoChange}
            className={cn(
              "w-24 h-8 rounded-md text-sm font-medium flex items-center justify-center shadow-sm transition-colors",
              isNoChange
                ? "bg-neutral-300 text-neutral-500 cursor-not-allowed"
                : "bg-primary-600 text-white hover:bg-primary-700"
            )}
          >
            {t("save")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Language;
