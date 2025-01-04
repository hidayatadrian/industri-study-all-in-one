// components/ui/Alert.tsx
'use client';

import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface AlertProps {
message: string;
description?: string;
show: boolean;
onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, description, show, onClose }) => {
    useEffect(() => {
    if (show) {
    const timer = setTimeout(() => {
    onClose();
    }, 3000); // Auto close after 3 seconds

    return () => clearTimeout(timer);
    }
    }, [show, onClose]);

    if (!show) return null;

    return (
    <div className="fixed top-4 right-4 w-96 z-50">
        <div className="bg-white rounded-lg shadow-lg border border-green-100 p-4">
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
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
