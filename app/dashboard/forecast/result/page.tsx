'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ForecastResultsTable from './tableforecast';

interface MonthOption {
    period: number;
    month: string;
    demand: string;
}

export default function ForecastResult() {
    const router = useRouter();
    const [monthOptions, setMonthOptions] = useState<MonthOption[]>([]);

    useEffect(() => {
        // Mengambil data dari localStorage
        const savedData = localStorage.getItem('forecastData');
        if (savedData) {
            setMonthOptions(JSON.parse(savedData));
        } else {
            // Jika tidak ada data, kembali ke halaman forecast
            router.push('/dashboard/forecast');
        }
    }, []);

    if (monthOptions.length === 0) {
        return <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Loading...</h2>
                <p className="text-gray-600">Please wait while we process your data</p>
            </div>
        </div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold">Forecast Results</h1>
                        <button 
                            onClick={() => router.push('/dashboard/forecast')}
                            className="px-4 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                        >
                            Back to Forecast
                        </button>
                    </div>
                    <ForecastResultsTable monthOptions={monthOptions} />
                </div>
            </div>
        </div>
    );
}