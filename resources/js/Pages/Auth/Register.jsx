import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit} className="space-y-6">
                
                <div> {/* Name */}
                    <label className="block font-medium text-sm text-gray-300">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={data.name}
                        className="w-full mt-1 border-0 border-b-2 border-white/20 bg-transparent text-white placeholder-gray-500 focus:border-[#820d0e] focus:ring-0 transition px-0 py-2"
                        placeholder="John Doe"
                        autoComplete="name"
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                </div>

                <div> {/* Email */}
                    <label className="block font-medium text-sm text-gray-300">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={data.email}
                        className="w-full mt-1 border-0 border-b-2 border-white/20 bg-transparent text-white placeholder-gray-500 focus:border-[#820d0e] focus:ring-0 transition px-0 py-2"
                        placeholder="member@gmail.com"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
                </div>

                <div> {/* Password */}
                    <label className="block font-medium text-sm text-gray-300">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={data.password}
                        className="w-full mt-1 border-0 border-b-2 border-white/20 bg-transparent text-white placeholder-gray-500 focus:border-[#820d0e] focus:ring-0 transition px-0 py-2"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
                </div>

                <div> {/* Confirm Password */}
                    <label className="block font-medium text-sm text-gray-300">Confirm Password</label>
                    <input
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="w-full mt-1 border-0 border-b-2 border-white/20 bg-transparent text-white placeholder-gray-500 focus:border-[#820d0e] focus:ring-0 transition px-0 py-2"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />
                    {errors.password_confirmation && <div className="text-red-500 text-xs mt-1">{errors.password_confirmation}</div>}
                </div>

                <div> {/* Register Button */}   
                    <button disabled={processing} className="w-full bg-[#820d0e] text-white font-bold py-3 rounded-xl hover:bg-[#a31012] transition shadow-lg tracking-widest uppercase">
                        {processing ? 'Creating Account...' : 'Register'}
                    </button>
                </div>

                <div className="mt-6 text-center text-sm border-t border-white/10 pt-4"> {/* Already Registered */}
                    <span className="text-gray-400">Already registered?</span>
                    <Link href={route('login')} className="text-red-400 hover:text-white font-bold transition ml-1 uppercase tracking-wider">
                        Log in
                    </Link>
                </div>

            </form>
        </GuestLayout>
    );
}