import { Head, Link } from '@inertiajs/react';
import QRCode from "react-qr-code";
import { useState } from 'react';

export default function Dashboard({ auth }) {
    const user = auth.user;
    const [showQR, setShowQR] = useState(false);

    // Logic stamp progress
    const totalStamps = 10;
    const currentStamps = user.stamps || 0; 
    
    const stampsArray = Array.from({ length: totalStamps }, (_, i) => i + 1);

    return (
        <>
            <Head title="My Account - HATS" />

            <div className="min-h-screen bg-[#660000] flex flex-col items-center justify-center relative overflow-hidden font-sans text-white">
                
                <div className="absolute inset-0 bg-gradient-to-b from-[#8B0000] to-[#4a0000] opacity-80"></div>

                <div className="z-10 text-center mb-12">
                    <h1 className="text-5xl font-black tracking-widest uppercase drop-shadow-lg mb-4">ACCOUNT</h1>
                    <p className="text-2xl font-light tracking-wide">
                        Hii, <span className="font-bold border-b border-white/50 pb-1">{user.name}</span>
                    </p>
                </div>

                {/* Stamp progress */}
                <div className="z-10 w-full max-w-4xl px-4 mb-16">
                    <div className="bg-white rounded-full p-4 md:p-6 shadow-2xl relative flex items-center justify-between">
                        
                        <div className="absolute -top-10 left-6 bg-white text-[#8B0000] font-bold px-3 py-1 rounded-full text-sm shadow-lg">
                            {currentStamps}/{totalStamps}
                        </div>

                        <div className="flex justify-between w-full gap-2 md:gap-4 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                            {stampsArray.map((num) => (
                                <div 
                                    key={num}
                                    className={`
                                        w-12 h-12 md:w-16 md:h-16 rounded-full flex-shrink-0 border-4 border-[#8B0000] transition-all duration-500
                                        ${num <= currentStamps ? 'bg-[#8B0000] shadow-[0_0_15px_rgba(139,0,0,0.6)] scale-100' : 'bg-transparent scale-90 opacity-40'}
                                    `}
                                ></div>
                            ))}
                        </div>
                    </div>
                    <p className="text-center mt-4 text-sm font-bold tracking-[0.2em] opacity-70">STAMP PROGRESS</p>
                </div>

                {/* Tombol QR */}
                <div className="z-10">
                    <button onClick={() => setShowQR(true)} className="relative group w-32 h-32 flex items-center justify-center">
                        <div className="absolute inset-0 bg-[#a31616] group-hover:bg-[#c41c1c] transition-colors duration-300 shadow-xl" 
                             style={{ clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' }}>
                        </div>
                        <span className="relative z-10 font-bold text-xl tracking-widest">QR</span>
                    </button>
                </div>

                {/* Tombol back & logout */}
                <div className="z-10 mt-12 flex gap-4">
                    <Link href="/" className="bg-white text-[#8B0000] px-6 py-2 rounded-full font-bold hover:bg-gray-200 transition">
                        ← BACK HOME
                    </Link>
                    <Link href={route('logout')} method="post" as="button" className="border border-white px-6 py-2 rounded-full font-bold hover:bg-white/10 transition">
                        LOGOUT
                    </Link>
                </div>

                {/* Pop up QR */}
                {showQR && (
                    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-white p-8 rounded-3xl max-w-sm w-full text-center relative animate-fade-in-up">
                            <h2 className="text-[#8B0000] text-3xl font-black mb-2">MY QR</h2>
                            <p className="text-gray-500 mb-6 text-sm">Show this to the staff to get stamps.</p>
                            
                            <div className="bg-gray-100 p-4 rounded-xl inline-block mb-6">
                                <QRCode 
                                    value={user.member_code || 'HATS-MEMBER'} 
                                    size={200}
                                    fgColor="#8B0000"
                                />
                            </div>
                            <p className="font-mono text-gray-400 text-xs mb-6">{user.member_code}</p>

                            <button 
                                onClick={() => setShowQR(false)}
                                className="bg-[#8B0000] text-white w-full py-3 rounded-xl font-bold hover:bg-[#660000] transition"
                            >
                                CLOSE
                            </button>
                        </div>
                    </div>
                )}
            </div>
            
            <style>{`
                .animate-fade-in-up { animation: fadeInUp 0.3s ease-out forwards; }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
            `}</style>
        </>
    );
}