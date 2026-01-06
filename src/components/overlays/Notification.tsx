import React from 'react';
import { useTranslation } from 'react-i18next';
import { useEscapeKey } from '../../hooks/common/useEscapeKey';
import { IconError, IconSuccess } from '../ui/Icons';

type NotificationVariant = 'error' | 'success';

interface NotificationProps {
  id?: string;
  isOpen?: boolean;
  variant?: NotificationVariant;
  title?: string;
  message?: string;
  closeLabel?: string;
  showTitle?: boolean;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ 
  id = 'notification',
  isOpen = true,
  variant = 'error',
  title, 
  message, 
  closeLabel, 
  showTitle = true,
  onClose 
}) => {
  const { t } = useTranslation();
  
  useEscapeKey(onClose);

  const finalCloseLabel = closeLabel || t('close') || 'Close';
  
  const getVariantConfig = () => {
    switch (variant) {
      case 'success':
        return {
          iconBg: 'bg-success-50',
          iconColor: 'text-success-600',
          btnClass: 'bg-success-600 hover:bg-success-700 active:bg-success-800',
          defaultTitle: 'Success',
          Icon: IconSuccess
        };
      case 'error':
      default:
        return {
          iconBg: 'bg-error-50',
          iconColor: 'text-error-600',
          btnClass: 'bg-error-600 hover:bg-error-700 active:bg-error-800',
          defaultTitle: 'Error',
          Icon: IconError
        };
    }
  };

  const config = getVariantConfig();
  const finalTitle = title || config.defaultTitle;
  const IconComponent = config.Icon;

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @keyframes notification-pop {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      <div 
        className="fixed inset-0 z-[1050] flex items-center justify-center bg-neutral-950/50 backdrop-blur-[1px] transition-opacity p-4"
        onClick={(e) => {
           if (e.target === e.currentTarget) onClose();
        }}
        id={id}
        role="dialog"
        aria-modal="true"
      >
        <div 
          className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden text-center p-6"
        >
          <div className="flex flex-col items-center justify-center">
            
            <div 
              className={`
                w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mb-4 
                ${config.iconBg} ${config.iconColor}
              `}
              style={{ animation: 'notification-pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
            >
              <IconComponent className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            {showTitle && (
              <h3 className="text-xl sm:text-display-xs font-bold text-neutral-950 mb-2 leading-tight">
                {finalTitle}
              </h3>
            )}

            <div 
              className="text-sm sm:text-md text-neutral-500 mb-6 leading-relaxed text-center px-2"
              dangerouslySetInnerHTML={{ __html: message || '' }}
            />

            <button
              type="button"
              onClick={onClose}
              className={`
                w-full sm:w-auto min-w-[8rem] px-6 py-3 sm:py-2.5 
                rounded-lg font-bold text-sm text-white
                border-none cursor-pointer outline-none shadow-none
                transition-all duration-200 ease-in-out
                active:scale-[0.98] 
                ${config.btnClass}
              `}
            >
              {finalCloseLabel}
            </button>

          </div>
        </div>
      </div>
    </>
  );
};

export default Notification;