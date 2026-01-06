import React, { useEffect, useState, useCallback } from "react";
import { IconCheckCircle, IconXCircle, IconInfo, IconX } from "../ui/Icons";

interface NotificationProps {
  message: string;
  variant?: "success" | "error" | "info";
  duration?: number;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({
  message,
  variant = "info",
  duration = 4000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  }, [onClose]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, handleClose]);

  const styles = {
    success: {
      container: "border-success-500 bg-success-50",
      icon: <IconCheckCircle className="w-5 h-5 text-success-500" />,
      title: "Success",
      text: "text-neutral-900",
      closeBtn: "text-neutral-400 hover:text-neutral-600",
    },
    error: {
      container: "border-error-500 bg-error-50",
      icon: <IconXCircle className="w-5 h-5 text-error-500" />,
      title: "Error",
      text: "text-neutral-900",
      closeBtn: "text-neutral-400 hover:text-neutral-600",
    },
    info: {
      container: "border-primary-500 bg-primary-50",
      icon: <IconInfo className="w-5 h-5 text-primary-500" />,
      title: "Information",
      text: "text-neutral-900",
      closeBtn: "text-neutral-400 hover:text-neutral-600",
    },
  };

  const currentStyle = styles[variant];
  const animationClass = isVisible
    ? "animate-fade-in-down"
    : "animate-fade-out-up opacity-0";

  return (
    <div
      className={`fixed top-5 right-5 z-[100] flex w-[calc(100%-40px)] sm:w-[350px] transition-all duration-300 ${animationClass}`}
    >
      <div
        className={`
          relative flex w-full items-center overflow-hidden rounded-lg border 
          shadow-[0px_4px_20px_0px_#0000001A] 
          min-h-[62px] p-3
          ${currentStyle.container}
        `}
      >
        <div className="flex items-start gap-3 w-full h-full">
          <div className="flex-shrink-0 mt-0.5">{currentStyle.icon}</div>

          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <h3
              className={`text-sm font-semibold leading-none mb-1 ${currentStyle.text}`}
            >
              {currentStyle.title}
            </h3>
            <p className="text-sm text-neutral-600 leading-snug break-words">
              {message}
            </p>
          </div>

          <div className="flex-shrink-0 ml-1 self-start -mt-1">
            <button
              onClick={handleClose}
              className={`inline-flex p-1 rounded-md bg-transparent focus:outline-none transition-colors ${currentStyle.closeBtn}`}
            >
              <span className="sr-only">Close</span>
              <IconX className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
