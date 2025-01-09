import React, { useState } from 'react';
import { X } from 'lucide-react';
import ForecastSidebar from '@/components/ui/sidebarforecast';
import { useRouter } from 'next/navigation';

interface MonthOption {
    period: number;
    month: string;
    demand: string;
}

const PollCreationPage = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('Linear Regression');
    const [selectedProblem, setSelectedProblem] = useState<string>('Linear_Regression');
    const router = useRouter();
    const [monthOptions, setMonthOptions] = useState<MonthOption[]>([
        { period: 1, month: '', demand: '' }
    ]);

    const isDropdownDisabled = selectedProblem !== 'Time_Series_Forecasting'; // Aktifkan jika Time Series Forecasting dipilih

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedProblem(event.target.value);
        setIsDropdownOpen(false); // Tutup dropdown jika ada perubahan tipe problem
    };

    const toggleDropdown = () => {
        if (!isDropdownDisabled) {
            setIsDropdownOpen(!isDropdownOpen);
        }
    };

    const selectLanguage = (language: string) => {
        setSelectedLanguage(language);
        setIsDropdownOpen(false);
    };

    const handleSolve = () => {
        const isValid = monthOptions.every(
            (option) => option.month.trim() !== '' && option.demand.trim() !== ''
        );

        if (isValid) {
            localStorage.setItem('forecastData', JSON.stringify(monthOptions));
            router.push('/dashboard/forecast/result');
        } else {
            alert('Please fill in all month and demand values');
        }
    };

    const addMonth = () => {
        setMonthOptions([
            ...monthOptions,
            { period: monthOptions.length + 1, month: '', demand: '' }
        ]);
    };

    const removeMonth = (index: number) => {
        const updatedOptions = monthOptions
            .filter((_, i) => i !== index)
            .map((option, i) => ({ ...option, period: i + 1 }));
        setMonthOptions(updatedOptions);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-2 md:p-4 flex justify-center items-start">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl flex flex-col md:flex-row">
                {/* Left Sidebar */}
                <ForecastSidebar />

                {/* Main Content */}
                <div className="flex-1 p-4 md:p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold">Type of Problem</h2>
                        <button className="text-gray-400 hover:text-gray-600">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-4 md:space-y-6">
                        {/* Radio Buttons */}
                        <fieldset className="mb-5">
                            <legend className="sr-only">Type of Problem</legend>
                            <div className="flex items-center mb-4">
                                <input
                                    id="problem-option-1"
                                    type="radio"
                                    name="problem_type"
                                    value="Linear_Regression"
                                    className="h-4 w-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
                                    checked={selectedProblem === 'Linear_Regression'}
                                    onChange={handleChange}
                                />
                                <label
                                    htmlFor="problem-option-1"
                                    className="text-sm font-medium text-gray-900 ml-2 block"
                                >
                                    Linear Regression
                                </label>
                            </div>
                            <div className="flex items-center mb-4">
                                <input
                                    id="problem-option-2"
                                    type="radio"
                                    name="problem_type"
                                    value="Time_Series_Forecasting"
                                    className="h-4 w-4 border-gray-300 focus:ring-2 focus:ring-blue-300"
                                    checked={selectedProblem === 'Time_Series_Forecasting'}
                                    onChange={handleChange}
                                />
                                <label
                                    htmlFor="problem-option-2"
                                    className="text-sm font-medium text-gray-900 ml-2 block"
                                >
                                    Time Series Forecasting
                                </label>
                            </div>
                        </fieldset>

                        {/* Dropdown */}
                        <h2 className="font-semibold mb-4">Type of Time Series Forecasting</h2>
                        <div className="h-10 bg-white flex border border-gray-200 rounded items-center">
                            <input
                                value={selectedLanguage}
                                className="px-4 appearance-none outline-none text-gray-800 w-full"
                                readOnly
                            />
                            <button
                                onClick={() => setSelectedLanguage('')}
                                className={`cursor-pointer outline-none focus:outline-none transition-all text-gray-300 hover:text-gray-600 ${
                                    isDropdownDisabled ? 'cursor-not-allowed' : ''
                                }`}
                                disabled={isDropdownDisabled}
                            >
                                <svg
                                    className="w-4 h-4 mx-2 fill-current"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                            <button
                                onClick={toggleDropdown}
                                className={`cursor-pointer outline-none focus:outline-none border-l border-gray-200 transition-all text-gray-300 hover:text-gray-600 ${
                                    isDropdownDisabled ? 'cursor-not-allowed' : ''
                                }`}
                                disabled={isDropdownDisabled}
                            >
                                <svg
                                    className="w-4 h-4 mx-2 fill-current"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="18 15 12 9 6 15"></polyline>
                                </svg>
                            </button>
                        </div>

                        {isDropdownOpen && !isDropdownDisabled && (
                            <div className="absolute rounded shadow bg-white overflow-hidden flex flex-col w-full mt-1 border border-gray-200">
                                {['Single Exponential Smoothing', 'Winter Series'].map(
                                    (language) => (
                                        <div
                                            key={language}
                                            className="cursor-pointer group border-t first:border-t-0"
                                        >
                                            <a
                                                onClick={() => selectLanguage(language)}
                                                className={`block p-2 border-transparent border-l-4 group-hover:border-blue-600 group-hover:bg-gray-100 ${
                                                    selectedLanguage === language
                                                        ? 'border-blue-600'
                                                        : ''
                                                }`}
                                            >
                                                {language}
                                            </a>
                                        </div>
                                    )
                                )}
                            </div>
                        )}

                        {/* Add Month Section */}
                        <div>
                            <p className="text-sm font-medium mb-3">Add Months (Period)</p>
                            <div className="space-y-3">
                                {monthOptions.map((option, index) => (
                                    <div key={index} className="flex items-center space-x-3">
                                        <span className="w-8 text-center font-medium text-gray-600">
                                            {option.period}
                                        </span>
                                        <input
                                            type="text"
                                            placeholder="January"
                                            className="w-1/3 p-3 border border-gray-200 rounded-lg"
                                            value={option.month}
                                            onChange={(e) => {
                                                const newOptions = [...monthOptions];
                                                newOptions[index].month = e.target.value;
                                                setMonthOptions(newOptions);
                                            }}
                                        />
                                        <input
                                            type="number"
                                            placeholder="Demand"
                                            className="w-1/3 p-3 border border-gray-200 rounded-lg"
                                            value={option.demand}
                                            onChange={(e) => {
                                                const newOptions = [...monthOptions];
                                                newOptions[index].demand = e.target.value;
                                                setMonthOptions(newOptions);
                                            }}
                                        />
                                        <button
                                            onClick={() => removeMonth(index)}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={addMonth}
                                    className="text-blue-600 text-sm font-medium hover:text-blue-700"
                                >
                                    + Add Month
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            onClick={() => {
                                setMonthOptions([{ period: 1, month: '', demand: '' }]);
                            }}
                        >
                            Reset
                        </button>
                        <button
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                            onClick={() => handleSolve()}
                        >
                            Solve
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PollCreationPage;
