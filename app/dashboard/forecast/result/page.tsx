'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ForecastResultsTable from './tableforecast';
import TableForecastTimeSeries from './tableforecasttimeseries';
import WinterForecast from './winterforecast';
import SingleMovingAverage from './singlemovingaverage'; // Import SMA

interface ForecastData {
    monthData: {
        period: number;
        month: string;
        demand: string;
    }[];
    targetPeriod: number;
    problemType: string;
    forecastingType: string;
}

export default function ForecastResult() {
    const router = useRouter();
    const [forecastData, setForecastData] = useState<ForecastData | null>(null);

    useEffect(() => {
        const savedData = localStorage.getItem('forecastData');

        if (savedData) {
            setForecastData(JSON.parse(savedData) as ForecastData);
        } else {
            router.push('/dashboard/forecast');
        }
    }, []);

    if (!forecastData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">Loading...</h2>
                    <p className="text-gray-600">Please wait while we process your data</p>
                </div>
            </div>
        );
    }

    const renderTable = () => {
        if (forecastData.problemType === 'Time_Series_Forecasting') {
            if (forecastData.forecastingType === 'Single Exponential Smoothing') {
                return <TableForecastTimeSeries />;
            } else if (forecastData.forecastingType === 'Winter Series') {
                return <WinterForecast />;
            } else if (forecastData.forecastingType === 'Single Moving Average') {
                return <SingleMovingAverage />;
            }
        }

        return <ForecastResultsTable monthOptions={forecastData.monthData} />;
    };

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
                    {renderTable()}
                </div>
            </div>
        </div>
    );
}
