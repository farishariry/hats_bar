import { Link, Head, useForm } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios'; // Import Axios untuk ambil data API

export default function Welcome({ auth }) {
    // --- STATE ---
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [menuItems, setMenuItems] = useState([]); // Tempat menyimpan data menu dari DB
    const [loading, setLoading] = useState(true);   // Status loading

    // --- 1. FETCH DATA MENU DARI API (Saat halaman dibuka) ---
    useEffect(() => {
        axios.get('/api/menu-items')
            .then(response => {
                setMenuItems(response.data); // Simpan data ke state
                setLoading(false);
            })
            .catch(error => {
                console.error("Gagal ambil menu:", error);
                setLoading(false);
            });
    }, []);

    // Pisahkan Menu berdasarkan Kategori
    const cocktails = menuItems.filter(item => item.category === 'beverage');
    const foods = menuItems.filter(item => item.category === 'food');

    // --- 2. LOGIC FORM RESERVASI ---
    const { data, setData, post, processing, reset } = useForm({
        name: '',
        phone: '',
        date_time: '',
        guests: '',
    });

    const submitReservation = (e) => {
        e.preventDefault();
        
        // Pisahkan tanggal dan jam dari input datetime-local
        const [date, time] = data.date_time.split('T');

        post(route('reservations.store'), {
            data: {
                name: data.name,
                phone: data.phone,
                pax: data.guests,
                reservation_date: date,
                reservation_time: time,
            },
            onSuccess: () => {
                reset();
                alert('RESERVASI BERHASIL! Data sudah masuk database.');
            },
            onError: (errors) => {
                alert('Gagal reservasi. Cek inputan anda.');
                console.log(errors);
            }
        });
    };

    // --- LOGIC SCROLL & NAVIGASI ---
    const cocktailRef = useRef(null);
    const foodRef = useRef(null);

    const scroll = (ref, direction) => {
        if (ref.current) {
            const scrollAmount = 300;
            ref.current.scrollBy({ 
                left: direction === 'left' ? -scrollAmount : scrollAmount, 
                behavior: 'smooth' 
            });
        }
    };

    const scrollToSection = (id) => {
        setIsNavOpen(false);
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
            <Head title="HATS - The Cocktail Bar" />

            <div className="bg-[#4a0505] min-h-screen font-sans text-white selection:bg-black selection:text-[#820d0e] overflow-x-hidden">
                
                {/* --- NAVIGATION HUD --- */}
                <div className="fixed top-0 left-0 w-full flex justify-center pt-6 z-50 pointer-events-none">
                    <h1 className="text-5xl font-black tracking-tighter uppercase text-white drop-shadow-lg pointer-events-auto">HATS</h1>
                </div>

                <button onClick={() => setIsNavOpen(!isNavOpen)} className="fixed top-8 left-8 z-50 flex flex-col justify-between h-5 w-8 focus:outline-none group">
                    <span className={`h-[3px] w-full bg-white rounded-full transition-all duration-300 ${isNavOpen ? 'rotate-45 translate-y-[9px]' : ''}`}></span>
                    <span className={`h-[3px] w-full bg-white rounded-full transition-all duration-300 ${isNavOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`h-[3px] w-full bg-white rounded-full transition-all duration-300 ${isNavOpen ? '-rotate-45 -translate-y-[9px]' : ''}`}></span>
                </button>

                {/* OVERLAY MENU */}
                <div className={`fixed inset-0 bg-[#2d0202]/95 backdrop-blur-md z-40 transition-transform duration-500 ease-in-out flex items-center px-12 md:px-24 ${isNavOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="flex flex-col space-y-6 w-full max-w-2xl">
                        {[{ id: 'about-section', label: 'ABOUT', num: '1.' }, { id: 'discovery-section', label: 'MENU', num: '2.' }, { id: 'reservation-form', label: 'RESERVATION', num: '3.' }].map((item) => (
                            <button key={item.label} onClick={() => scrollToSection(item.id)} className="text-left group flex items-center gap-6">
                                <span className="text-xl font-light text-red-300 group-hover:text-white transition">{item.num}</span>
                                <div className="text-white hover:text-[#820d0e] text-4xl md:text-6xl font-bold uppercase tracking-tight transition origin-left">{item.label}</div>
                            </button>
                        ))}
                        <div className="text-left group flex items-center gap-6">
                            <span className="text-xl font-light text-red-300 group-hover:text-white transition">4.</span>
                            <Link href={auth.user ? route('dashboard') : route('login')} className="text-white hover:text-[#820d0e] text-4xl md:text-6xl font-bold uppercase tracking-tight transition origin-left">ACCOUNT</Link>
                        </div>
                    </div>
                </div>

                {/* ROTATING BADGE */}
                <button onClick={() => scrollToSection('reservation-form')} className="fixed bottom-8 right-8 z-50 w-28 h-28 md:w-32 md:h-32 group cursor-pointer animate-spin-slow">
                     <div className="relative w-full h-full">
                        <svg viewBox="0 0 100 100" className="w-full h-full fill-white">
                            <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="transparent" />
                            <text fontSize="11.5" fontWeight="bold" letterSpacing="2"><textPath xlinkHref="#circlePath">HIT YOUR TABLE NOW! • HIT YOUR TABLE NOW! •</textPath></text>
                        </svg>
                    </div>
                </button>

                {/* --- SECTIONS --- */}
                <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
                    <img src="/images/hero-bg.jpg" alt="Hero" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#4a0505] via-transparent to-black/80"></div>
                </section>

                <section id="about-section" className="py-24 px-6 md:px-20 bg-gradient-to-b from-[#4a0505] to-[#2b0202] flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 space-y-8">
                        <h2 className="text-4xl md:text-5xl font-bold leading-tight">A space for the newest addition to the Iskandarsyah strip.</h2>
                        <p className="text-lg text-gray-300 font-light leading-relaxed">HATS draws patrons with imaginative sorbets and cocktails that one would expect from award-winning mixologists.</p>
                    </div>
                    <div className="flex-1 flex justify-center"><img src="/images/about-cocktail.png" alt="Cocktail" className="w-64 md:w-80 object-contain drop-shadow-2xl rotate-3 hover:rotate-0 transition duration-700" /></div>
                </section>

                <section id="discovery-section" className="bg-[#4a0505]">
                    {[{ title: 'COCKTAILS', id: 'cocktails-section' }, { title: 'FOODS', id: 'foods-section' }, { title: 'RESERVATION', id: 'reservation-form' }].map((item) => (
                        <div key={item.title} className="border-t border-white/20 hover:bg-white/5 transition duration-300 group cursor-pointer" onClick={() => scrollToSection(item.id)}>
                            <div className="max-w-7xl mx-auto px-6 py-12 flex justify-between items-end">
                                <h2 className="text-4xl md:text-6xl font-light tracking-tight group-hover:font-bold transition-all duration-300">{item.title}</h2>
                                <span className="text-xs tracking-widest uppercase opacity-60 group-hover:opacity-100 mb-2">Discover More</span>
                            </div>
                        </div>
                    ))}
                </section>

                {/* --- COCKTAILS SECTION --- */}
                <section id="cocktails-section" className="py-20 bg-[#5e0707] border-t border-white/10">
                    <div className="px-6 mb-12 text-center"><h2 className="text-4xl font-bold tracking-widest mb-2">COCKTAILS</h2></div>
                    <div className="relative group">
                        <button onClick={() => scroll(cocktailRef, 'left')} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-[#820d0e] text-white flex items-center justify-center">←</button>
                        
                        <div ref={cocktailRef} className="flex overflow-x-auto gap-8 px-12 pb-10 snap-x scrollbar-hide">
                            {loading ? <p className="text-center w-full">Loading Menu...</p> : cocktails.map((item) => (
                                <div key={item.id} className="min-w-[280px] md:min-w-[320px] snap-center h-96 rounded-2xl overflow-hidden relative shadow-2xl group-card">
                                    <img src={item.image_url} className="w-full h-full object-cover transition duration-500 hover:scale-110" alt={item.name} />
                                    <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black to-transparent p-6 pt-20">
                                        <h3 className="text-2xl font-bold uppercase">{item.name}</h3>
                                        <p className="text-sm opacity-80 mt-1">IDR {parseInt(item.price).toLocaleString('id-ID')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button onClick={() => scroll(cocktailRef, 'right')} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-[#820d0e] text-white flex items-center justify-center">→</button>
                    </div>
                </section>

                {/* --- FOODS SECTION --- */}
                <section id="foods-section" className="py-20 bg-[#4a0505]">
                    <div className="px-6 mb-12 text-center"><h2 className="text-4xl font-bold tracking-widest mb-2">FOODS</h2></div>
                    <div className="relative group">
                        <button onClick={() => scroll(foodRef, 'left')} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-[#820d0e] text-white flex items-center justify-center">←</button>
                        
                        <div ref={foodRef} className="flex overflow-x-auto gap-8 px-12 pb-10 snap-x scrollbar-hide">
                        {loading ? <p className="text-center w-full">Loading Menu...</p> : foods.map((item) => (
                                <div key={item.id} className="min-w-[280px] md:min-w-[320px] snap-center h-80 rounded-2xl overflow-hidden relative shadow-2xl bg-black">
                                    <img src={item.image_url} className="w-full h-full object-cover transition duration-500 hover:scale-110 opacity-80" alt={item.name} />
                                    <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/90 to-transparent">
                                        <h3 className="text-xl font-bold uppercase leading-tight">{item.name}</h3>
                                        <p className="text-sm opacity-80 mt-1">IDR {parseInt(item.price).toLocaleString('id-ID')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button onClick={() => scroll(foodRef, 'right')} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-[#820d0e] text-white flex items-center justify-center">→</button>
                    </div>
                </section>

                {/* --- RESERVATION FORM --- */}
                <section id="reservation-form" className="py-24 px-4 bg-[#2d0202] flex justify-center">
                    <div className="bg-white text-[#4a0505] w-full max-w-4xl rounded-[2rem] p-8 md:p-16 shadow-2xl relative">
                        <h3 className="text-3xl md:text-5xl font-bold uppercase mb-2 text-[#820d0e]">Reserve Your Table</h3>
                        <p className="text-gray-500 mb-12 text-sm md:text-base">Fill the form and you will be recontacted via WhatsApp.</p>

                        <form onSubmit={submitReservation} className="space-y-10">
                            <div className="group">
                                <label className="block text-[#820d0e] text-sm font-bold uppercase tracking-wider mb-2">Name</label>
                                <input type="text" required value={data.name} onChange={e => setData('name', e.target.value)} className="w-full border-0 border-b-2 border-[#820d0e] bg-transparent py-2 px-0 text-xl font-medium focus:ring-0" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="group">
                                    <label className="block text-[#820d0e] text-sm font-bold uppercase tracking-wider mb-2">WhatsApp Number</label>
                                    <input type="tel" required value={data.phone} onChange={e => setData('phone', e.target.value)} className="w-full border-0 border-b-2 border-[#820d0e] bg-transparent py-2 px-0 text-xl font-medium focus:ring-0" />
                                </div>
                                <div className="group">
                                    <label className="block text-[#820d0e] text-sm font-bold uppercase tracking-wider mb-2">Pax</label>
                                    <input type="number" required value={data.guests} onChange={e => setData('guests', e.target.value)} className="w-full border-0 border-b-2 border-[#820d0e] bg-transparent py-2 px-0 text-xl font-medium focus:ring-0" />
                                </div>
                            </div>
                            <div className="group">
                                <label className="block text-[#820d0e] text-sm font-bold uppercase tracking-wider mb-2">Date & Time</label>
                                <input type="datetime-local" required value={data.date_time} onChange={e => setData('date_time', e.target.value)} className="w-full border-0 border-b-2 border-[#820d0e] bg-transparent py-2 px-0 text-xl font-medium focus:ring-0 text-gray-700" />
                            </div>
                            <div className="pt-8">
                                <button disabled={processing} className="w-full py-4 bg-[#820d0e] text-white font-bold text-xl uppercase tracking-widest rounded-full hover:bg-black transition duration-300 shadow-xl">
                                    {processing ? 'Sending...' : 'Book A Table'}
                                </button>
                            </div>
                        </form>
                    </div>
                </section>

                <footer className="bg-black py-8 text-center text-xs text-gray-600 border-t border-white/10">© 2025 HATS BAR.</footer>
                <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; } .animate-spin-slow { animation: spin 15s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </div>
        </>
    );
}