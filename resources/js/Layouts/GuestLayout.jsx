import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-[#4a0505] text-white">
            <div className="mb-6">
                <Link href="/">
                   <img src="/images/logo.png" alt="HATS Logo" className="h-24 w-auto drop-shadow-lg" />
                </Link>
            </div>

            <div className="w-full sm:max-w-md mt-6 px-6 py-8 bg-[#2d0202] shadow-2xl overflow-hidden sm:rounded-3xl border border-white/10">
                {children}
            </div>
        </div>
    );
}