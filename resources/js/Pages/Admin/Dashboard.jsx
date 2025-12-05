import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function AdminDashboard({ auth, reservations, menuItems }) {

    // Validasi role admin
    if (auth.user.role !== 'admin') {
        window.location.href = '/dashboard';
        return null; 
    }

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMenu, setEditingMenu] = useState(null); // Null = Mode Tambah, Ada Data = Mode Edit

    // Stamp dan scan QR member
    const stampForm = useForm({ member_code: '' });
    
    const handleScan = (e) => {
        e.preventDefault();
        stampForm.post(route('admin.add-stamp'), {
            onSuccess: () => {
                alert('PROSES BERHASIL!');
                stampForm.reset();
            },
            onError: () => alert('Member tidak ditemukan / Error!'),
        });
    };

    // Form CRUD menu item
    const menuForm = useForm({
        name: '', 
        category: 'beverage', 
        price: '', 
        image: null 
    });

    const openCreateModal = () => {
        setEditingMenu(null);
        menuForm.reset();
        setIsModalOpen(true);
    };

    const openEditModal = (item) => {
        setEditingMenu(item);
        menuForm.setData({
            name: item.name,
            category: item.category,
            price: item.price,
            image: null
        });
        setIsModalOpen(true);
    };

    const submitMenu = (e) => {
        e.preventDefault();
        
        if (editingMenu) {
            menuForm.post(route('admin.menu.update', editingMenu.id), {
                onSuccess: () => setIsModalOpen(false),
                forceFormData: true,
            });
        } else {
            menuForm.post(route('admin.menu.store'), {
                onSuccess: () => setIsModalOpen(false),
                forceFormData: true,
            });
        }
    };

    const deleteMenu = (id) => {
        if(confirm('Yakin ingin menghapus menu ini?')) {
            router.delete(route('admin.menu.delete', id));
        }
    };

    // Logic status reservasi
    const updateStatus = (id, status) => {
        if(confirm(`Ubah status jadi ${status}?`)) {
            router.post(route('admin.reservation.update', id), { status });
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans text-gray-800 pb-20">
            <Head title="Admin Dashboard - HATS" />

            {/* Navbar */}
            <nav className="bg-[#4a0505] text-white p-4 shadow-md flex justify-between items-center sticky top-0 z-40">
                <h1 className="text-xl font-bold tracking-widest">HATS ADMIN</h1>
                <div className="flex gap-4 items-center">
                     <span>Hi, Admin</span>
                     <button onClick={() => router.post(route('logout'))} className="bg-red-600 px-3 py-1 rounded text-sm hover:bg-red-500">Logout</button>
                </div>
            </nav>

            <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">

                {/* Stamp dan scan QR member */}
                <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-500">
                    <h2 className="text-xl font-bold mb-4 uppercase text-gray-700">Scan Member QR</h2>
                    <form onSubmit={handleScan} className="flex gap-4">
                        <input 
                            type="text" 
                            placeholder="Input HATS-XXXX-XXXX..." 
                            value={stampForm.data.member_code}
                            onChange={e => stampForm.setData('member_code', e.target.value)}
                            className="flex-1 border p-2 rounded text-lg uppercase font-mono"
                        />
                        <button disabled={stampForm.processing} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-bold">
                            {stampForm.processing ? '...' : 'PROSES STAMP'}
                        </button>
                    </form>
                </div>

                {/* Menu Management */}
                <div className="bg-white p-6 rounded-xl shadow border-l-4 border-gray-700">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold uppercase text-gray-700">Menu Management</h2>
                        <button onClick={openCreateModal} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-bold flex items-center gap-2">
                            + ADD NEW MENU
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {menuItems.map(item => (
                            <div key={item.id} className="border rounded-lg overflow-hidden bg-gray-50 group relative hover:shadow-lg transition">
                                <div className="h-32 bg-gray-200">
                                    {/* Menampilkan Gambar */}
                                    <img src={item.image_url} className="w-full h-full object-cover" alt={item.name} />
                                </div>
                                <div className="p-3">
                                    <div className="font-bold truncate">{item.name}</div>
                                    <div className="text-xs text-gray-500 mb-2">{item.category} • IDR {parseInt(item.price).toLocaleString()}</div>
                                    
                                    <div className="flex gap-2 mt-2">
                                        <button onClick={() => openEditModal(item)} className="flex-1 bg-yellow-500 text-white text-xs py-1 rounded hover:bg-yellow-600">Edit</button>
                                        <button onClick={() => deleteMenu(item.id)} className="flex-1 bg-red-500 text-white text-xs py-1 rounded hover:bg-red-600">Del</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Reservation */}
                <div className="bg-white p-6 rounded-xl shadow border-l-4 border-[#8B0000]">
                    <h2 className="text-xl font-bold mb-4 uppercase text-gray-700">Reservations</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100 text-gray-600 text-sm uppercase">
                                    <th className="p-3">Date</th>
                                    <th className="p-3">Info</th>
                                    <th className="p-3">Pax</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservations.map((res) => (
                                    <tr key={res.id} className="border-b hover:bg-gray-50">
                                        <td className="p-3 text-sm font-bold">{res.reservation_date}<br/><span className="font-normal text-xs">{res.reservation_time}</span></td>
                                        <td className="p-3">
                                            <div className="font-bold">{res.name}</div>
                                            <a href={`https://wa.me/${res.phone.replace(/^0/, '62')}`} target="_blank" className="text-xs text-blue-600 underline">{res.phone}</a>
                                        </td>
                                        <td className="p-3">{res.pax}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                                res.status === 'approved' ? 'bg-green-100 text-green-700' : 
                                                res.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                            }`}>{res.status}</span>
                                        </td>
                                        <td className="p-3 flex gap-2">
                                            {res.status === 'pending' && (
                                                <>
                                                    <button onClick={() => updateStatus(res.id, 'approved')} className="bg-green-500 text-white px-2 py-1 rounded text-xs">✔</button>
                                                    <button onClick={() => updateStatus(res.id, 'rejected')} className="bg-red-500 text-white px-2 py-1 rounded text-xs">✖</button>
                                                </>
                                            )}
                                            {res.status === 'approved' && (
                                                <a href={`https://wa.me/${res.phone.replace(/^0/, '62')}?text=Halo ${res.name}, Reservasi anda telah kami terima!`} target="_blank" className="bg-green-700 text-white px-3 py-1 rounded text-xs">WA</a>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* Pop up CRUD menu item */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-fade-in-up">
                        <h2 className="text-2xl font-bold mb-4 text-[#8B0000]">
                            {editingMenu ? 'EDIT MENU' : 'ADD NEW MENU'}
                        </h2>
                        
                        <form onSubmit={submitMenu} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">Name</label>
                                <input type="text" required className="w-full border p-2 rounded" 
                                    value={menuForm.data.name} onChange={e => menuForm.setData('name', e.target.value)} />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold mb-1">Category</label>
                                    <select className="w-full border p-2 rounded" 
                                        value={menuForm.data.category} onChange={e => menuForm.setData('category', e.target.value)}>
                                        <option value="beverage">Beverage</option>
                                        <option value="food">Food</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Price</label>
                                    <input type="number" required className="w-full border p-2 rounded" 
                                        value={menuForm.data.price} onChange={e => menuForm.setData('price', e.target.value)} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-1">Image (Max 2MB)</label>
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    className="w-full border p-2 rounded text-sm bg-gray-50"
                                    onChange={e => menuForm.setData('image', e.target.files[0])} 
                                />
                                {menuForm.errors.image && (
                                    <div className="text-red-500 text-xs mt-1">{menuForm.errors.image}</div>
                                )}
                                {editingMenu && (
                                    <div className="mt-2 text-xs text-gray-500">
                                        Gambar saat ini: <a href={editingMenu.image_url} target="_blank" className="text-blue-500 underline">Lihat</a>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-3 pt-4 border-t mt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-300 py-2 rounded font-bold hover:bg-gray-400">CANCEL</button>
                                <button disabled={menuForm.processing} className="flex-1 bg-[#8B0000] text-white py-2 rounded font-bold hover:bg-red-900">
                                    {menuForm.processing ? 'SAVING...' : 'SAVE MENU'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            <style>{`
                .animate-fade-in-up { animation: fadeInUp 0.3s ease-out forwards; }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
}