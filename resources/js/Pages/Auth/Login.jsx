import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && <div className="mb-4 font-medium text-sm text-green-500 text-center">{status}</div>}

            <form onSubmit={submit} className="space-y-6">
                
                {/* Email */}
                <div>
                    <label className="block font-medium text-sm text-gray-300">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={data.email}
                        className="w-full mt-1 border-0 border-b-2 border-white/20 bg-transparent text-white placeholder-gray-500 focus:border-[#820d0e] focus:ring-0 transition px-0 py-2"
                        placeholder="member@gmail.com"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
                </div>

                {/* Password */}
                <div>
                    <label className="block font-medium text-sm text-gray-300">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={data.password}
                        className="w-full mt-1 border-0 border-b-2 border-white/20 bg-transparent text-white placeholder-gray-500 focus:border-[#820d0e] focus:ring-0 transition px-0 py-2"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
                </div>

                {/* Remember me & Forgot password */}
                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center text-gray-400 hover:text-gray-200 cursor-pointer">
                        <input
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="rounded bg-white/10 border-transparent text-[#820d0e] focus:ring-[#820d0e]"
                        />
                        <span className="ml-2">Remember me</span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-gray-400 hover:text-white underline transition"
                        >
                            Forgot password?
                        </Link>
                    )}
                </div>

                {/* Tombol login */}
                <div>
                    <button disabled={processing} className="w-full bg-[#820d0e] text-white font-bold py-3 rounded-xl hover:bg-[#a31012] transition shadow-lg tracking-widest uppercase">
                        {processing ? 'Logging in...' : 'Log in'}
                    </button>
                </div>

                {/* Link ke register */}
                <div className="mt-6 text-center text-sm border-t border-white/10 pt-4">
                    <span className="text-gray-400">Don't have an account? </span>
                    <Link href={route('register')} className="text-red-400 hover:text-white font-bold transition ml-1 uppercase tracking-wider">
                        Register Now
                    </Link>
                </div>

            </form>
        </GuestLayout>
    );
}