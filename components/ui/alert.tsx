// components/ui/Alert.tsx
'use client';

import React, { useEffect } from 'react';
import { CheckCircle2, X, ShieldX } from 'lucide-react';

interface AlertProps {
    message: string;
    description?: string;
    show: boolean;
    onClose: () => void;
    variant?: 'success' | 'error';  // Changed from 'type' to 'variant' to avoid confusion with HTML type attribute
}

const Alert: React.FC<AlertProps> = ({
    message,
    description,
    show,
    onClose,
    variant = 'success'  // Default to success if not specified
}) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    if (!show) return null;

    return (
        <div className="fixed top-4 right-4 w-96 z-50">
            <div className={`bg-white rounded-lg shadow-lg border ${variant === 'success' ? 'border-green-100' : 'border-red-100'
                } p-4`}>
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        {variant === 'success' ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                            <ShieldX className="h-5 w-5 text-red-500" />
                        )}
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{message}</p>
                        {description && (
                            <p className="mt-1 text-sm text-gray-500">{description}</p>
                        )}
                    </div>
                    <button onClick={onClose} className="flex-shrink-0 text-gray-400 hover:text-gray-500">
                        <X className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Alert;