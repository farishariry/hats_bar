import { useState } from 'react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed w-full z-50 top-0 left-0 p-6 flex justify-between items-start">
            {/* Hamburger menu */}
            <div className="relative">
                <button onClick={() => setIsOpen(!isOpen)} className="text-white hover:text-hats-red transition-colors duration-300 focus:outline-none">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>

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
        </nav>
    );
}