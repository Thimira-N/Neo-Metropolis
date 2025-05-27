'use client';
import { useState } from 'react';
import { Shield, Lock, User, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import BackgroundAnimation from "@/components/login/backgroundanimation";

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        setIsLoading(true);
        setError('');

        // Simulate loading
        await new Promise(resolve => setTimeout(resolve, 1500));

        const validEmail = 'admin@neometropolis.com';
        const validPassword = 'admin@123';

        if (email === validEmail && password === validPassword) {
            localStorage.setItem('isLoggedIn', 'true');
            router.push('/');
        } else {
            setError('Invalid credentials. Access denied.');
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-black">
            <BackgroundAnimation />

            {/* Main Content */}
            <div className="relative z-20 min-h-screen flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                    {/* Login Container */}
                    <div className="relative group">
                        {/* Glow Effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 via-purple-600 to-emerald-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 animate-glow" />

                        {/* Main Card */}
                        <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
                            {/* Header Section */}
                            <div className="text-center mb-8">
                                <div className="relative inline-block mb-6">
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full blur-lg opacity-50 animate-pulse" />
                                    <div className="relative bg-gradient-to-r from-slate-800 to-slate-700 p-4 rounded-full border border-slate-600">
                                        <Shield className="h-10 w-10 text-cyan-400 animate-pulse" />
                                    </div>
                                </div>

                                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent animate-text-shimmer">
                                    NeoMetropolis
                                </h1>
                                <div className="flex items-center justify-center space-x-2 mb-2">
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                    <span className="text-sm font-mono text-emerald-400 tracking-wider">SYSTEM SECURE</span>
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                </div>
                                <p className="text-slate-400 font-mono text-sm tracking-wide">AUTHORIZED PERSONNEL ONLY</p>
                            </div>

                            {/* Error Display */}
                            {error && (
                                <div className="mb-6 relative">
                                    <div className="absolute inset-0 bg-red-500/20 rounded-xl blur" />
                                    <div className="relative bg-red-900/30 border border-red-500/50 text-red-300 p-4 rounded-xl text-sm text-center backdrop-blur-sm animate-error-shake">
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                                            <span>{error}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Form Fields */}
                            <div className="space-y-6 mb-8">
                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 to-blue-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300" />
                                    <div className="relative flex items-center">
                                        <User className="absolute left-4 h-5 w-5 text-cyan-400 z-10" />
                                        <input
                                            type="email"
                                            placeholder="admin@neometropolis.com"
                                            className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl pl-12 pr-4 py-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300 backdrop-blur-sm"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="relative group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300" />
                                    <div className="relative flex items-center">
                                        <Lock className="absolute left-4 h-5 w-5 text-purple-400 z-10" />
                                        <input
                                            type="password"
                                            placeholder="Access Key"
                                            className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl pl-12 pr-4 py-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300 backdrop-blur-sm"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Login Button */}
                            <button
                                onClick={handleLogin}
                                disabled={isLoading}
                                className="relative w-full group overflow-hidden rounded-xl p-px bg-gradient-to-r from-cyan-600 via-black to-cyan-600 hover:from-cyan-500 hover:via-cyan-800 hover:to-cyan-500 transition-all duration-300"
                            >
                                <div className="relative bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl px-6 py-4 group-hover:from-slate-800 group-hover:to-slate-700 transition-all duration-300">
                                    <div className="flex items-center justify-center space-x-3">
                                        {isLoading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                                                <span className="font-mono text-cyan-400 tracking-wider">AUTHENTICATING...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="font-mono text-white tracking-wider group-hover:text-cyan-200 transition-colors">
                                                    INITIALIZE ACCESS
                                                </span>
                                                <ChevronRight className="h-5 w-5 text-cyan-400 transform group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </div>
                                </div>
                            </button>

                            {/* Footer */}
                            <div className="mt-8 text-center space-y-3">
                                <div className="flex items-center justify-center space-x-4 text-xs">
                                    <div className="flex items-center space-x-2 mb-5">
                                        <div className="w-1 h-5 bg-gradient-to-b from-slate-500 via-indigo-700 to-purple-900 rounded-full animate-ping mr-1 shadow-[0_0_6px_2px_rgba(99,102,241,0.5)]" />
                                        <span className="text-sm text-slate-400 font-mono">
                                            Email - admin@neometropolis.com <br/> Password (access key) - admin@123
                                        </span>
                                        <div className="w-1 h-5 bg-gradient-to-b from-slate-500 via-indigo-700 to-purple-900 rounded-full animate-ping ml-1 shadow-[0_0_6px_2px_rgba(99,102,241,0.5)]" />
                                    </div>
                                </div>
                                <div className="text-xs text-slate-500 font-mono tracking-wider">
                                    © NEOMETROPOLIS CSRS • V1.0 • 2025 <br/> Developed by : Thimira Navodana
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                
              @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
                20%, 40%, 60%, 80% { transform: translateX(2px); }
              }

              .animate-error-shake {
                  animation: shake 0.5s ease-in-out;
              }
              
            `}</style>

        </div>
    );
};

export default LoginPage;