import React, { useEffect } from 'react';

interface NotificationProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  isVisible: boolean;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

const Notification: React.FC<NotificationProps> = ({
  type,
  message,
  isVisible,
  onClose,
  autoClose = true,
  duration = 5000
}) => {
  useEffect(() => {
    if (isVisible && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, duration, onClose]);

  if (!isVisible) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-100 border-green-400',
          text: 'text-green-700',
          icon: 'fas fa-check-circle text-green-500'
        };
      case 'error':
        return {
          bg: 'bg-red-100 border-red-400',
          text: 'text-red-700',
          icon: 'fas fa-exclamation-circle text-red-500'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-100 border-yellow-400',
          text: 'text-yellow-700',
          icon: 'fas fa-exclamation-triangle text-yellow-500'
        };
      case 'info':
        return {
          bg: 'bg-blue-100 border-blue-400',
          text: 'text-blue-700',
          icon: 'fas fa-info-circle text-blue-500'
        };
      default:
        return {
          bg: 'bg-gray-100 border-gray-400',
          text: 'text-gray-700',
          icon: 'fas fa-info-circle text-gray-500'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
      <div className={`${styles.bg} border rounded-lg p-4 shadow-lg`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <i className={`${styles.icon} text-xl`}></i>
          </div>
          <div className="ml-3 flex-1">
            <p className={`${styles.text} text-sm font-medium`}>
              {message}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              className={`${styles.text} hover:opacity-70 transition-opacity`}
              onClick={onClose}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;