import React from "react";
import { 
  MessagesSquare, 
  Calendar, 
  ClipboardList, 
  CheckSquare, 
  BookOpen, 
  TrendingUp, 
  LayoutDashboard, 
  Target, 
  Users, 
} from "lucide-react";
import { useRouter } from 'next/navigation';
import  Header from "@/components/ui/header";

const Home: React.FC = () => {
    const router = useRouter();
    const icons = [
        { label: "Discuss", color: "bg-orange-400 hover:bg-orange-500", icon: MessagesSquare },
        { label: "Calendar", color: "bg-green-500 hover:bg-green-600", icon: Calendar },
        { label: "Appointments", color: "bg-blue-400 hover:bg-blue-500", icon: ClipboardList },
        { label: "To-do", color: "bg-purple-500 hover:bg-purple-600", icon: CheckSquare },
        { label: "Knowledge", color: "bg-gray-500 hover:bg-gray-600", icon: BookOpen },
        { label: "Forecasting", color: "bg-orange-600 hover:bg-orange-700", icon: TrendingUp },
        { label: "Aggregat Requirement", color: "bg-pink-600 hover:bg-pink-700", icon: LayoutDashboard },
        { label: "Planning", color: "bg-green-400 hover:bg-green-500", icon: Target },
        { label: "Employees", color: "bg-yellow-400 hover:bg-yellow-500", icon: Users },
    ];

    const ChangePage = (label: string) => {
        if (label === "Forecasting") {
            router.push('/dashboard/forecast');
        }
        if (label === "Aggregat Requirement") {
            router.push('/dashboard/agregatrequirement');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
            {/* Header */}
            <Header />

            {/* Icon Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
                {icons.map((icon, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center gap-2"
                    >
                        <div
                            className={`flex items-center justify-center w-28 h-28 rounded-lg text-white font-medium cursor-pointer 
                            transition-all duration-300 
                            hover:shadow-lg 
                            hover:-translate-y-1 
                            ${icon.color}`}
                            onClick={() => ChangePage(icon.label)}
                        >
                            <icon.icon size={32} />
                        </div>
                        <span className="text-gray-600 font-medium">{icon.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
