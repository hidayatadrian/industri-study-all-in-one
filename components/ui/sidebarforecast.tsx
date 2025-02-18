import React, { useState } from 'react';
import {
    ListPlus,
    SlidersHorizontal,
    Settings,
    Calendar,
    Puzzle,
    Share2,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
interface IconProps {
    className?: string;
}

type IconComponent = React.FC<IconProps>;

interface SidebarItemProps {
    icon: IconComponent;
    title: string;
    description: string;
    isNew?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
    icon: Icon,
    title,
    description,
    isNew
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="w-full">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between text-sm px-4 py-2 hover:bg-gray-50 rounded-lg text-gray-700 transition-colors"
            >
                <div className="flex items-center">
                    <Icon className="w-4 h-4 mr-3" />
                    <span>{title}</span>
                    {isNew && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">
                            New
                        </span>
                    )}
                </div>
                {isOpen ? (
                    <ChevronUp className="w-4 h-4" />
                ) : (
                    <ChevronDown className="w-4 h-4" />
                )}
            </button>

            {isOpen && (
                <div className="mt-2 px-4 py-3 bg-gray-50 rounded-lg ml-4 mr-2 text-sm text-gray-600">
                    {description}
                </div>
            )}
        </div>
    );
};

const ForecastSidebar = () => {
    const sidebarItems = [
        {
            icon: ListPlus,
            title: "Type of forecast",
            description: "Choose from various forecasting methods including Moving Average, Exponential Smoothing, or Linear Regression. Each method has its own strengths for different types of data patterns."
        },
        {
            icon: SlidersHorizontal,
            title: "Fill demand",
            description: "Enter historical demand data for your products or services. This data will be used as the basis for generating forecasts.",
            isNew: true
        },
        {
            icon: Settings,
            title: "Fill period",
            description: "The number of period usually will be month and automatically follow the amount of the months."
        },
        {
            icon: Calendar,
            title: "Fill Months",
            description: "Select the specific months you want to include in your forecast analysis. This helps in accounting for seasonal patterns."
        },
        {
            icon: Settings,
            title: "Do forecast",
            description: "Run the forecasting algorithm with your selected parameters. The system will process your data and generate predictions."
        },
        {
            icon: Puzzle,
            title: "Analys the result",
            description: "Review the forecast results, including accuracy metrics, confidence intervals, and visual representations of the predictions."
        },
        {
            icon: Share2,
            title: "Export to spreadsheet",
            description: "Download your forecast results in a spreadsheet format for further analysis or sharing with your team."
        }
    ];

    return (
        <div className="w-full md:w-72 p-4 md:p-6 border-b md:border-b-0 md:border-r border-gray-100">
            <h2 className="text-lg font-semibold mb-2 md:mb-4">Instruction</h2>
            <p className="text-gray-600 text-sm mb-4 md:mb-8">
                Before do forecast, make sure you to follow Instruction by fill the data needed. Such as demand, type of forecast, period.
            </p>

            <nav className="space-y-2 md:space-y-4">
                {sidebarItems.map((item, index) => (
                    <SidebarItem
                        key={index}
                        icon={item.icon}
                        title={item.title}
                        description={item.description}
                        isNew={item.isNew}
                    />
                ))}
            </nav>

            <div className="mt-6 md:mt-8 pt-4 border-t border-gray-100">
                <div className="flex items-center">
                    <div className="h-1 flex-grow bg-blue-100 rounded">
                        <div className="h-full w-1/7 bg-blue-600 rounded"></div>
                    </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">Step 1 of 7</p>
            </div>
        </div>
    );
};

export default ForecastSidebar;