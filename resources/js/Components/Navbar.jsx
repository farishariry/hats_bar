import { useState } from 'react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed w-full z-50 top-0 left-0 p-6 flex justify-between items-start">
            {/* Hamburger Menu (Top Left) */}
            <div className="relative">
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-white hover:text-hats-red transition-colors duration-300 focus:outline-none"
                >
                    {/* Icon Hamburger Elegan */}
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                    <div className="absolute top-10 left-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-xl w-48 py-2 mt-2 animate-fade-in-down">
                        {['ABOUT', 'MENU', 'EVENTS', 'ACCOUNT'].map((item, index) => (
                            <a 
                                key={index} 
                                href={item === 'ACCOUNT' ? '/login' : `#${item.toLowerCase()}`}
                                className="block px-4 py-2 text-white font-bold hover:bg-hats-red hover:text-white transition-all duration-200"
                            >
                                <span className="text-xs text-hats-red mr-2 align-top group-hover:text-white">{index + 1}.</span>
                                {item}
                            </a>
                        ))}
                    </div>
                )}
            </div>

            {/* Logo Tengah (HUD Style) */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl px-6 py-2 shadow-lg shadow-hats-red/20 transform hover:scale-105 transition-transform duration-300 cursor-pointer">
                {/* Placeholder Image/Logo */}
                <div className="flex flex-col items-center">
                    <div className="h-8 w-16 bg-gradient-to-b from-blue-200 to-green-300 rounded-md border border-gray-200 relative overflow-hidden">
                         {/* Visualisasi Awan/Bukit Sederhana dengan CSS */}
                         <div className="absolute bottom-0 w-full h-1/2 bg-hats-green rounded-t-full"></div>
                         <div className="absolute top-1 left-2 w-4 h-4 bg-white rounded-full opacity-80"></div>
                    </div>
                </div>
            </div>

            {/* Empty Div untuk balancing flex layout */}
            <div className="w-8"></div>
        </nav>
    );
}