import { Link } from '@inertiajs/react';

export default function Guest({ children }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 relative overflow-hidden">
            
            {/* Gambar background */}
            <div 
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `url('/images/guestlayout-bg.jpg')`, 
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"></div>
            </div>

            {/* Logo */}
            <div className="relative z-10 mb-6">
                <Link href="/">
                    <img src="/images/logo.png" alt="HATS Logo" className="h-24 w-auto drop-shadow-lg" />          
                </Link>
            </div>

            {/* Form container */}
            <div className="relative z-10 w-full sm:max-w-md mt-6 px-8 py-10 bg-[#2d0202]/80 backdrop-blur-md shadow-2xl border border-white/10 sm:rounded-[2rem] overflow-hidden">
                {children}
            </div>

        </div>
    );
}