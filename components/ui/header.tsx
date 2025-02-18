import React from "react";
import {
    Bell,
    Search,
    Clock,
    UserCircle
} from "lucide-react";

const Header: React.FC = () => {
    return (
        <header className="bg-white text-black py-3 px-6 mb-5 shadow-md flex justify-between items-center">
            <div className="flex items-center gap-6">
                {/* Logo */}
                <h1 className="text-xl font-bold">Industri All-In-One</h1>

                {/* Navigation */}
                <nav className="hidden md:flex gap-6">
                    <a href="#" className="hover:underline">My Work</a>
                    <a href="#" className="hover:underline">Projects</a>
                    <a href="#" className="hover:underline">Resourcing</a>
                    <a href="#" className="hover:underline">Finance</a>
                    <a href="#" className="hover:underline">More</a>
                </nav>
            </div>

            <div className="flex items-center gap-4">
                {/* Timer */}
                <div className="text-sm hidden sm:block">0:00:00</div>

                {/* Search */}
                <button className="p-2 rounded-full hover:bg-gray-700">
                    <Search size={20} />
                </button>

                {/* Notifications */}
                <div className="relative">
                    <button className="p-2 rounded-full hover:bg-gray-700">
                        <Bell size={20} />
                    </button>
                    <span className="absolute top-0 right-0 inline-block w-4 h-4 text-xs font-bold text-white bg-red-600 rounded-full flex items-center justify-center">58</span>
                </div>

                {/* Clock */}
                <button className="p-2 rounded-full hover:bg-gray-700">
                    <Clock size={20} />
                </button>

                {/* User Icon */}
                <button className="p-2 rounded-full hover:bg-gray-700">
                    <UserCircle size={20} />
                </button>
            </div>
        </header>
    );
};

export default Header;
