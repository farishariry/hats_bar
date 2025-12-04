import { Link, Head, useForm } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

export default function Welcome({ auth }) {

    const [isNavOpen, setIsNavOpen] = useState(false);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fethc data menu dari API
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

    // Pemisahan kategori menu
    const cocktails = menuItems.filter(item => item.category === 'beverage');
    const foods = menuItems.filter(item => item.category === 'food');

    // Logic form reservasi
    const { data, setData, post, processing, reset } = useForm({
        name: '',
        phone: '',
        date_time: '',
        guests: '',
    });

    const submitReservation = (e) => {
        e.preventDefault();
        
        // Konversi date & time
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

    // Logic scroll dan navigasi
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
                
                {/* HUD */}
                <div className="fixed top-0 left-0 w-full flex justify-center pt-6 z-50 pointer-events-none">
                    <img src="/images/logo.png" alt="HATS Logo" className="h-16 md:h-24 object-contain drop-shadow-2xl pointer-events-auto transition-transform hover:scale-105 cursor-pointer"/>
                </div>

                <button onClick={() => setIsNavOpen(!isNavOpen)} className="fixed top-8 left-8 z-50 flex flex-col justify-between h-5 w-8 focus:outline-none group">
                    <span className={`h-[3px] w-full bg-white rounded-full transition-all duration-300 ${isNavOpen ? 'rotate-45 translate-y-[9px]' : ''}`}></span>
                    <span className={`h-[3px] w-full bg-white rounded-full transition-all duration-300 ${isNavOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`h-[3px] w-full bg-white rounded-full transition-all duration-300 ${isNavOpen ? '-rotate-45 -translate-y-[9px]' : ''}`}></span>
                </button>

                {/* Hamburger */}
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

                {/* Badge berputar */}
                <button onClick={() => scrollToSection('reservation-form')} className="fixed bottom-8 right-8 z-50 w-28 h-28 md:w-32 md:h-32 group cursor-pointer animate-spin-slow">
                    <div className="relative w-full h-full flex items-center justify-center">
                        
                        <svg viewBox="0 0 100 100" className="w-full h-full fill-white absolute inset-0">
                            <path id="circlePath" d="M 50, 50 m -32, 0 a 32,32 0 1,1 64,0 a 32,32 0 1,1 -64,0" fill="transparent" />
                            <text fontSize="8" fontWeight="bold" letterSpacing="5.5">
                                <textPath xlinkHref="#circlePath">
                                    HIT YOUR TABLE NOW!
                                </textPath>
                            </text>
                        </svg>

                        <div className="w-12 h-12 rounded-full shadow-lg z-10 bg-gradient-to-br from-[#FF5500] to-[#8B0000]"></div>        
            
                    </div>
                </button>

                <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
                    <img src="/images/hero-bg.jpg" alt="Hero" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#4a0505] via-transparent to-black/80"></div>
                    <h3 className="relative z-10 text-4xl md:text-6xl lg:text-4xl font-bold text-center leading-tight max-w-4xl px-6">The Cocktail Bar That Embraces Duality</h3>
                </section>
                
                {/* About Section */}
                <section id="about-section" className="py-24 px-6 md:px-20 bg-gradient-to-b from-[#4a0505] to-[#2b0202] flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 space-y-8">
                        <h2 className="text-4xl md:text-5xl font-bold leading-tight">A space for the newest addition to the Iskandarsyah strip.</h2>
                        <p className="text-lg text-gray-300 font-light leading-relaxed">HATS draws patrons with imaginative sorbets and cocktails that one would expect from award-winning mixologists.</p>
                    </div>
                    <div className="flex-1 flex justify-center"><img src="/images/about-cocktail.png" alt="Cocktail" className="w-64 md:w-80 object-contain drop-shadow-2xl rotate-3 hover:rotate-0 transition duration-700" /></div>
                </section>
                
                {/* Discovery Section */}
                <section id="discovery-section" className="bg-[#4a0505]">
                    {[{title: 'LOCATION', id: 'location-section' }, { title: 'COCKTAILS', id: 'cocktails-section' }, { title: 'FOODS', id: 'foods-section' }, { title: 'RESERVATION', id: 'reservation-form' }].map((item) => (
                        <div key={item.title} className="border-t border-white/20 hover:bg-white/5 transition duration-300 group cursor-pointer" onClick={() => scrollToSection(item.id)}>
                            <div className="max-w-7xl mx-auto px-6 py-12 flex justify-between items-end">
                                <h2 className="text-4xl md:text-6xl font-light tracking-tight group-hover:font-bold transition-all duration-300">{item.title}</h2>
                                <span className="text-xs tracking-widest uppercase opacity-60 group-hover:opacity-100 mb-2">Discover More</span>
                            </div>
                        </div>
                    ))}
                </section>
                
                {/* Location Section */}
                <section id="location-section" className="relative min-h-screen flex items-center justify-center p-6 bg-black">
    
                    <img src="/images/location-bg.jpg" alt="Bar Interior" className="absolute inset-0 w-full h-full object-cover opacity-50 md:opacity-70"/>

                    <div className="relative z-10 w-full max-w-5xl bg-black/80 backdrop-blur-sm p-8 md:p-12 rounded-[2rem] shadow-2xl text-white border border-white/10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                            <div className="h-64 md:h-80 w-full rounded-xl overflow-hidden shadow-xl border-4 border-white/5">
                                <iframe title="HATS Location" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.153285439503!2d106.8017061749906!3d-6.24352049374482!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f1db85f3e2cf%3A0x4e1a55bfa1d34f7a!2sHATS%20Bar!5e0!3m2!1sid!2sid!4v1764816428499!5m2!1sid!2sid" width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy"></iframe>
                            </div>

                            <div className="text-right md:text-left">
                                <h3 className="text-2xl font-bold mb-4 text-red-400">MELAWAI, JAKARTA SELATAN</h3>
                                <p className="text-xl md:text-3xl font-light leading-snug">
                                    Jl. Iskandarsyah I No.9,<br/>
                                    RT.5/RW.2, Melawai,<br/>
                                    Kec. Kby. Baru, Kota Jakarta Selatan,<br/>
                                    Daerah Khusus Ibukota Jakarta
                                </p>
                            </div>

                        </div>
                    </div>
                </section>

                {/* Cocktails Section */}
                <section id="cocktails-section" className="py-20 bg-[#4a0505]">
                    <div className="px-6 mb-12 text-center"><h2 className="text-4xl font-bold tracking-widest mb-2">COCKTAILS</h2></div>
                    
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#4a0505] to-transparent pointer-events-none z-[5]"></div>
                        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#4a0505] to-transparent pointer-events-none z-[5]"></div>

                        <button onClick={() => scroll(cocktailRef, 'left')} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-[#820d0e] text-white flex items-center justify-center">←</button>
                        
                        <div ref={cocktailRef} className="flex overflow-x-auto gap-8 px-12 pb-10 snap-x scrollbar-hide">
                        {loading ? <p className="text-center w-full">Loading Menu...</p> : cocktails.map((item) => (
                                <div key={item.id} className="min-w-[280px] md:min-w-[320px] snap-center h-80 rounded-2xl overflow-hidden relative shadow-2xl bg-black">
                                    <img src={item.image_url} className="w-full h-full object-cover transition duration-500 hover:scale-110 opacity-80" alt={item.name} />
                                    <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/90 to-transparent">
                                        <h3 className="text-xl font-bold leading-tight">{item.name}</h3>
                                        <p className="text-sm opacity-80 mt-1">{parseInt(item.price).toLocaleString('id-ID')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button onClick={() => scroll(foodRef, 'right')} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-[#820d0e] text-white flex items-center justify-center">→</button>
                    </div>
                </section>

                {/* Foods Section */}
                <section id="foods-section" className="py-20 bg-[#4a0505]">
                    <div className="px-6 mb-12 text-center"><h2 className="text-4xl font-bold tracking-widest mb-2">FOODS</h2></div>
                    
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#4a0505] to-transparent pointer-events-none z-[5]"></div>
                        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#4a0505] to-transparent pointer-events-none z-[5]"></div>

                        <button onClick={() => scroll(foodRef, 'left')} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-[#820d0e] text-white flex items-center justify-center">←</button>
                        
                        <div ref={foodRef} className="flex overflow-x-auto gap-8 px-12 pb-10 snap-x scrollbar-hide">
                        {loading ? <p className="text-center w-full">Loading Menu...</p> : foods.map((item) => (
                                <div key={item.id} className="min-w-[280px] md:min-w-[320px] snap-center h-80 rounded-2xl overflow-hidden relative shadow-2xl bg-black">
                                    <img src={item.image_url} className="w-full h-full object-cover transition duration-500 hover:scale-110 opacity-80" alt={item.name} />
                                    <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/90 to-transparent">
                                        <h3 className="text-xl font-bold leading-tight">{item.name}</h3>
                                        <p className="text-sm opacity-80 mt-1">{parseInt(item.price).toLocaleString('id-ID')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button onClick={() => scroll(foodRef, 'right')} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-[#820d0e] text-white flex items-center justify-center">→</button>
                    </div>
                </section>

                {/* Reservation Section */}
                <section id="reservation-form" className="py-24 px-4 bg-[#2d0202] flex justify-center">
                    <div className="bg-white text-[#4a0505] w-full max-w-4xl rounded-[2rem] p-8 md:p-16 shadow-2xl relative">
                        <h3 className="text-3xl md:text-5xl font-bold uppercase mb-2 text-[#820d0e]">Reserve Your Table</h3>
                        <p className="text-gray-500 mb-12 text-sm md:text-base">Fill the form and you will be recontacted via WhatsApp.</p>

                        <form onSubmit={submitReservation} className="space-y-10">
                            
                            <div className="group"> {/* --- 1. NAME --- */}
                                <input type="text" required value={data.name} onChange={e => setData('name', e.target.value)} className="w-full border-0 border-b-2 border-[#820d0e] bg-transparent py-2 px-0 text-xl font-medium focus:ring-0 placeholder-gray-400" placeholder="NAME"/>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                
                                
                                <div className="group"> {/* --- 2. PHONE NUMBER --- */}
                                    <input type="tel" required value={data.phone} onChange={e => setData('phone', e.target.value)} className="w-full border-0 border-b-2 border-[#820d0e] bg-transparent py-2 px-0 text-xl font-medium focus:ring-0 placeholder-gray-400" placeholder="PHONE NUMBER"/>
                                </div>
                                
                                <div className="group"> {/* --- 3. PAX --- */}
                                    <input type="number" required value={data.guests} onChange={e => setData('guests', e.target.value)} className="w-full border-0 border-b-2 border-[#820d0e] bg-transparent py-2 px-0 text-xl font-medium focus:ring-0 placeholder-gray-400" placeholder="HOW MANY PEOPLE?"/>
                                </div>
                            </div>
                            
                            <div className="group"> {/* --- 4. DATE & TIME --- */}
                                <input type="datetime-local" required value={data.date_time} onChange={e => setData('date_time', e.target.value)} className="w-full border-0 border-b-2 border-[#820d0e] bg-transparent py-2 px-0 text-xl font-medium focus:ring-0 text-gray-700 placeholder-gray-400"placeholder="DATE & TIME"/>
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