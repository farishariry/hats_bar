import { Link, Head, useForm } from '@inertiajs/react';
import { useState, useRef } from 'react';

export default function Welcome({ auth, menuItems }) {
    // --- STATE & LOGIC ---
    const [isNavOpen, setIsNavOpen] = useState(false);
    
    // Logic Form Reservasi
    const { data, setData, post, processing, reset } = useForm({
        name: '',
        phone: '', // Sesuai request: Phone number buat follow up
        date_time: '',
        guests: '',
    });

    const submitReservation = (e) => {
        e.preventDefault();
        
        // PISAHKAN date_time
        const [reservation_date, reservation_time] = data.date_time.split('T');

        // Gunakan post dengan payload yang sudah di-map/transform
        post(route('reservations.store'), {
            // Data yang dikirimkan ke Laravel sudah di-map ke nama field yang benar
            data: {
                name: data.name,
                phone: data.phone,
                pax: data.guests, // MAP: guests -> pax
                reservation_date: reservation_date,
                reservation_time: reservation_time,
                email: 'guest@hats.bar' // Email dummy karena tidak ada field di form
            },
            onSuccess: () => {
                reset();
                // Controller akan mengarahkan ke halaman sukses
            },
            onError: (e) => {
                 // Tampilkan error validasi dari Laravel
                 alert(`RESERVASI GAGAL. Cek kembali input Anda: ${Object.values(e).flat().join(', ')}`);
            },
        });
    };

    // Refs untuk Carousel Scroll
    const cocktailRef = useRef(null);
    const foodRef = useRef(null);

    // Fungsi Scroll Carousel (Kiri/Kanan)
    const scroll = (ref, direction) => {
        if (ref.current) {
            const { current } = ref;
            const scrollAmount = 300; // Jarak scroll
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    // Fungsi Navigasi Scroll Halaman
    const scrollToSection = (id) => {
        setIsNavOpen(false);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Filter Menu (Pisah Food & Cocktail)
    const cocktails = menuItems.filter(item => item.category === 'beverage');
    const foods = menuItems.filter(item => item.category === 'food');

    return (
        <>
            <Head title="HATS - The Cocktail Bar" />

            <div className="bg-[#4a0505] min-h-screen font-sans text-white selection:bg-black selection:text-[#820d0e] overflow-x-hidden">
                
                {/* ======================= FIXED OVERLAY ELEMENTS ======================= */}
                
                {/* 1. LOGO TENGAH */}
                <div className="fixed top-0 left-0 w-full flex justify-center pt-6 z-50 pointer-events-none">
                    <h1 className="text-5xl font-black tracking-tighter uppercase text-white drop-shadow-lg pointer-events-auto">
                        HATS
                    </h1>
                </div>

                {/* 2. HAMBURGER MENU (KIRI ATAS) - SESUAI DESIGN */}
                <button 
                    onClick={() => setIsNavOpen(!isNavOpen)}
                    className="fixed top-8 left-8 z-50 flex flex-col justify-between h-5 w-8 focus:outline-none group"
                >
                    <span className={`h-[3px] w-full bg-white rounded-full transition-all duration-300 ${isNavOpen ? 'rotate-45 translate-y-[9px]' : ''}`}></span>
                    <span className={`h-[3px] w-full bg-white rounded-full transition-all duration-300 ${isNavOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`h-[3px] w-full bg-white rounded-full transition-all duration-300 ${isNavOpen ? '-rotate-45 -translate-y-[9px]' : ''}`}></span>
                </button>

                {/* 3. MENU OVERLAY LIST */}
                {/* 3. MENU OVERLAY LIST (YANG SUDAH DIPERBAIKI) */}
                <div className={`fixed inset-0 bg-[#2d0202]/95 backdrop-blur-md z-40 transition-transform duration-500 ease-in-out flex items-center px-12 md:px-24 ${isNavOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="flex flex-col space-y-6 w-full max-w-2xl">
                        
                        {/* A. NAVIGASI SCROLL (About, Menu, Events) */}
                        {[
                            { id: 'about-section', label: 'ABOUT', num: '1.' },
                            { id: 'discovery-section', label: 'MENU', num: '2.' },
                            { id: 'location-section', label: 'EVENTS', num: '3.' },
                        ].map((item) => (
                            <button 
                                key={item.label} 
                                onClick={() => scrollToSection(item.id)} 
                                className="text-left group flex items-center gap-6"
                            >
                                <span className="text-xl font-light text-red-300 group-hover:text-white transition">{item.num}</span>
                                <div className="text-white hover:text-[#820d0e] text-4xl md:text-6xl font-bold uppercase tracking-tight transition origin-left">
                                    {item.label}
                                </div>
                            </button>
                        ))}

                        {/* B. NAVIGASI ACCOUNT (Beda Sendiri - Pindah Halaman) */}
                        <div className="text-left group flex items-center gap-6">
                            <span className="text-xl font-light text-red-300 group-hover:text-white transition">4.</span>
                            
                            {/* Logic: Kalau user ada, ke Dashboard. Kalau tidak, ke Login */}
                            <Link 
                                href={auth.user ? route('dashboard') : route('login')} 
                                className="text-white hover:text-[#820d0e] text-4xl md:text-6xl font-bold uppercase tracking-tight transition origin-left">
                                ACCOUNT
                            </Link>
                        </div>

                    </div>
                </div>

                {/* 4. ROTATING BADGE (KANAN BAWAH) */}
                <button onClick={() => scrollToSection('reservation-form')} className="fixed bottom-8 right-8 z-50 w-28 h-28 md:w-32 md:h-32 group cursor-pointer">
                     <div className="relative w-full h-full animate-spin-slow">
                        <svg viewBox="0 0 100 100" className="w-full h-full fill-white">
                            <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="transparent" />
                            <text fontSize="11.5" fontWeight="bold" letterSpacing="2">
                                <textPath xlinkHref="#circlePath">HIT YOUR TABLE NOW! • HIT YOUR TABLE NOW! •</textPath>
                            </text>
                        </svg>
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-[#cf191b] rounded-full group-hover:scale-110 transition shadow-lg shadow-red-900/50"></div>
                </button>

                {/* ======================= CONTENT SECTIONS ======================= */}

                {/* 1. HERO SECTION */}
                <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
                    <img src="/images/hero-bg.jpg" alt="Hero" className="absolute inset-0 w-full h-full object-cover opacity-60" />                    <div className="absolute inset-0 bg-gradient-to-t from-[#4a0505] via-transparent to-black/80"></div>
                </section>

                {/* 2. ABOUT SECTION (Gradient Red) */}
                <section id="about-section" className="py-24 px-6 md:px-20 bg-gradient-to-b from-[#4a0505] to-[#2b0202] flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 space-y-8">
                        <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                            A space for the newest addition to the Iskandarsyah strip.
                        </h2>
                        <p className="text-lg text-gray-300 font-light leading-relaxed">
                            HATS draws patrons with imaginative sorbets and cocktails that one would expect from award-winning mixologists.
                            <br /><br />
                            <span className="border-b border-white pb-1">The darker it gets, the higher the alcohol intensity.</span>
                        </p>
                    </div>
                    <div className="flex-1 flex justify-center">
                        {/* Foto Cocktail Pink dari desain */}
                        <img src="/images/about-cocktail.png" alt="Pink Cocktail" className="w-64 md:w-80 object-contain drop-shadow-2xl rotate-3 hover:rotate-0 transition duration-700" /></div>
                </section>

                {/* 3. BIG LINKS NAVIGATION (Text List Style) */}
                <section id="discovery-section" className="bg-[#4a0505]">
                    {[
                        { title: 'OUR LOCATION', id: 'location-section' },
                        { title: 'COCKTAILS', id: 'cocktails-section' },
                        { title: 'FOODS', id: 'foods-section' },
                        { title: 'RESERVATION', id: 'reservation-hero' } // Ganti events jadi reservation
                    ].map((item) => (
                        <div key={item.title} className="border-t border-white/20 hover:bg-white/5 transition duration-300 group cursor-pointer" onClick={() => scrollToSection(item.id)}>
                            <div className="max-w-7xl mx-auto px-6 py-12 flex justify-between items-end">
                                <h2 className="text-4xl md:text-6xl font-light tracking-tight group-hover:font-bold transition-all duration-300">{item.title}</h2>
                                <span className="text-xs tracking-widest uppercase opacity-60 group-hover:opacity-100 mb-2">Discover More</span>
                            </div>
                        </div>
                    ))}
                    <div className="border-t border-white/20"></div>
                </section>

                {/* --- LOCATION SECTION --- */}
                <section id="location-section" className="py-24 bg-[#1a0101] relative overflow-hidden">
                    <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        
                        {/* CONTAINER MAP (Embed) */}
                        {/* Class 'group' ditambahkan di sini untuk trigger hover effect */}
                        <div className="bg-gray-800 rounded-[3rem] overflow-hidden h-80 w-full md:w-96 mx-auto shadow-2xl border-4 border-white/5 group relative">
                            
                            {/* Tips: 
                            1. Paste link embed Google Maps di 'src' di bawah.
                            2. Hapus atribut width="..." dan height="..." bawaan Google.
                            3. Biarkan class Tailwind yang mengatur ukurannya.
                            */}
                            <iframe 
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.153285392132!2d106.8042811!3d-6.2435205!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f1db85f3e2cf%3A0x4e1a55bfa1d34f7a!2sHATS%20Bar!5e0!3m2!1sid!2sid!4v1764562876030!5m2!1sid!2sid" 
                                width="100%" 
                                height="100%" 
                                style={{ border: 0 }} 
                                allowFullScreen="" 
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade"
                                // Class ini bikin map jadi hitam putih, dan berwarna pas di-hover
                                className="w-full h-full grayscale group-hover:grayscale-0 transition duration-700 ease-in-out filter contrast-125"
                            ></iframe>

                            {/* Overlay Gradient sedikit biar map-nya gak terlalu terang/nabrak tema gelap */}
                            <div className="absolute inset-0 bg-[#4a0505] mix-blend-overlay opacity-20 pointer-events-none group-hover:opacity-0 transition duration-700"></div>
                        </div>

                        {/* Address Text (Biarkan tetap sama) */}
                        <div className="text-right md:text-left">
                            <h3 className="text-2xl font-bold mb-6 text-white">MELAWAI, JAKARTA SELATAN</h3>
                            <p className="text-xl md:text-3xl font-light leading-normal text-gray-300">
                                Jl. Iskandarsyah I No.9,<br/>
                                RT.5/RW.2, Melawai,<br/>
                                Kec. Kby. Baru, Kota Jakarta Selatan,<br/>
                                Daerah Khusus Ibukota Jakarta
                            </p>
                        </div>
                    </div>
</section>

                {/* 5. COCKTAILS CAROUSEL */}
                <section id="cocktails-section" className="py-20 bg-[#5e0707] border-t border-white/10">
                    <div className="px-6 mb-12 flex justify-between items-end max-w-7xl mx-auto">
                        <div className="text-center w-full">
                            <h2 className="text-4xl font-bold tracking-widest mb-2">COCKTAILS</h2>
                            <div className="w-12 h-1 bg-white mx-auto"></div>
                        </div>
                    </div>
                    
                    {/* Carousel Container */}
                    <div className="relative group">
                        {/* Tombol Kiri */}
                        <button onClick={() => scroll(cocktailRef, 'left')} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-[#820d0e] flex items-center justify-center hover:scale-110 transition shadow-lg text-white">
                            ←
                        </button>
                        
                        {/* Scroll Area */}
                        <div ref={cocktailRef} className="flex overflow-x-auto gap-8 px-12 pb-10 snap-x scrollbar-hide">
                            {cocktails.map((item) => (
                                <div key={item.id} className="min-w-[280px] md:min-w-[320px] snap-center">
                                    <div className="h-96 rounded-2xl overflow-hidden relative shadow-2xl group-card">
                                        <img src="https://images.unsplash.com/photo-1536935338725-8f319ac6f6d0?q=80&w=1976" className="w-full h-full object-cover transition duration-500 hover:scale-110" alt={item.name} />
                                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-6 pt-20">
                                            <h3 className="text-2xl font-bold uppercase">{item.name}</h3>
                                            <p className="text-sm opacity-80 mt-1">IDR {item.price / 1000}K</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Tombol Kanan */}
                        <button onClick={() => scroll(cocktailRef, 'right')} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-[#820d0e] flex items-center justify-center hover:scale-110 transition shadow-lg text-white">
                            →
                        </button>
                    </div>
                </section>

                {/* 6. FOODS CAROUSEL (Sama kayak Cocktail) */}
                <section id="foods-section" className="py-20 bg-[#4a0505]">
                    <div className="px-6 mb-12 text-center">
                        <h2 className="text-4xl font-bold tracking-widest mb-2">FOODS</h2>
                        <div className="w-12 h-1 bg-white mx-auto"></div>
                    </div>
                    
                    <div className="relative group">
                        <button onClick={() => scroll(foodRef, 'left')} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-[#820d0e] flex items-center justify-center hover:scale-110 transition shadow-lg text-white">←</button>
                        
                        <div ref={foodRef} className="flex overflow-x-auto gap-8 px-12 pb-10 snap-x scrollbar-hide">
                            {foods.map((item) => (
                                <div key={item.id} className="min-w-[280px] md:min-w-[320px] snap-center">
                                    <div className="h-80 rounded-2xl overflow-hidden relative shadow-2xl bg-black">
                                        <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780" className="w-full h-full object-cover transition duration-500 hover:scale-110 opacity-80" alt={item.name} />
                                        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/90 to-transparent">
                                            <h3 className="text-xl font-bold uppercase leading-tight">{item.name}</h3>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button onClick={() => scroll(foodRef, 'right')} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-[#820d0e] flex items-center justify-center hover:scale-110 transition shadow-lg text-white">→</button>
                    </div>
                </section>

                {/* 7. RESERVATION HERO (Image Text) */}
                <section id="reservation-hero" className="relative h-[60vh] flex items-center justify-center bg-black overflow-hidden">
                        <img src="/images/reservation-bg.jpg" className="absolute inset-0 w-full h-full object-cover opacity-50" alt="Crowd" />                    <h2 className="relative z-10 text-6xl md:text-9xl font-bold uppercase tracking-tighter mix-blend-overlay text-white opacity-80">
                        RESERVATION
                    </h2>
                </section>

                {/* 8. RESERVATION FORM (White Card Style) */}
                <section id="reservation-form" className="py-24 px-4 bg-[#2d0202] flex justify-center">
                    <div className="bg-white text-[#4a0505] w-full max-w-4xl rounded-[2rem] p-8 md:p-16 shadow-2xl relative">
                        
                        <h3 className="text-3xl md:text-5xl font-bold uppercase mb-2 text-[#820d0e]">Reserve Your Table</h3>
                        <p className="text-gray-500 mb-12 text-sm md:text-base">
                            Fill the form and you will be recontacted by the structure to confirm your table reservation.
                        </p>

                        <form onSubmit={submitReservation} className="space-y-10">
                            {/* Input Style: Garis Bawah Aja (Border Bottom) */}
                            
                            <div className="group">
                                <label className="block text-[#820d0e] text-sm font-bold uppercase tracking-wider mb-2">Name and Surname</label>
                                <input 
                                    type="text" 
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="w-full border-0 border-b-2 border-[#820d0e] bg-transparent py-2 px-0 text-xl font-medium focus:ring-0 focus:border-red-900 placeholder-gray-300 transition"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="group">
                                    <label className="block text-[#820d0e] text-sm font-bold uppercase tracking-wider mb-2">Phone Number (WhatsApp)</label>
                                    <input 
                                        type="tel" 
                                        value={data.phone}
                                        onChange={e => setData('phone', e.target.value)}
                                        className="w-full border-0 border-b-2 border-[#820d0e] bg-transparent py-2 px-0 text-xl font-medium focus:ring-0 focus:border-red-900"
                                    />
                                </div>
                                <div className="group">
                                    <label className="block text-[#820d0e] text-sm font-bold uppercase tracking-wider mb-2">How Many People?</label>
                                    <input 
                                        type="number" 
                                        value={data.guests}
                                        onChange={e => setData('guests', e.target.value)}
                                        className="w-full border-0 border-b-2 border-[#820d0e] bg-transparent py-2 px-0 text-xl font-medium focus:ring-0 focus:border-red-900"
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <label className="block text-[#820d0e] text-sm font-bold uppercase tracking-wider mb-2">Date & Time</label>
                                <input 
                                    type="datetime-local" 
                                    value={data.date_time}
                                    onChange={e => setData('date_time', e.target.value)}
                                    className="w-full border-0 border-b-2 border-[#820d0e] bg-transparent py-2 px-0 text-xl font-medium focus:ring-0 focus:border-red-900 text-gray-700"
                                />
                            </div>

                            <div className="pt-8">
                                <button disabled={processing} className="w-full py-4 bg-[#820d0e] text-white font-bold text-xl uppercase tracking-widest rounded-full hover:bg-black transition duration-300 shadow-xl">
                                    {processing ? 'Sending...' : 'Book A Table'}
                                </button>
                            </div>
                        </form>

                    </div>
                </section>

                <footer className="bg-black py-8 text-center text-xs text-gray-600 border-t border-white/10">
                    &copy; 2024 HATS BAR. DESIGNED FOR ELEGANCE.
                </footer>

            </div>

            {/* CSS UTILITIES TAMBAHAN */}
            <style>{`
                /* Sembunyikan Scrollbar tapi tetep bisa scroll */
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .animate-spin-slow {
                    animation: spin 15s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </>
    );
}