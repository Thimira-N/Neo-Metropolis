'use client';
import { useState } from 'react';
import { Shield, Lock, User, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
            {/* Premium Circuit Board Background */}
            <div className="absolute inset-0">
                {/* Base dark circuit board gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-950" />

                {/* Circuit board pattern overlay */}
                <div className="absolute inset-0 opacity-15"
                     style={{
                         backgroundImage: `
                             radial-gradient(circle at 1px 1px, rgba(6, 182, 212, 0.3) 1px, transparent 0),
                             linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px),
                             linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px)
                         `,
                         backgroundSize: '50px 50px, 25px 25px, 25px 25px'
                     }}
                />

                {/* Animated circuit traces */}
                <svg className="absolute inset-0 w-full h-full opacity-25" viewBox="0 0 1200 800">
                    <defs>
                        <linearGradient id="circuit1" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
                            <stop offset="40%" stopColor="#06b6d4" stopOpacity="1" />
                            <stop offset="60%" stopColor="#06b6d4" stopOpacity="1" />
                            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="circuit2" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0" />
                            <stop offset="40%" stopColor="#8b5cf6" stopOpacity="1" />
                            <stop offset="60%" stopColor="#8b5cf6" stopOpacity="1" />
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="circuit3" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
                            <stop offset="50%" stopColor="#10b981" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Main circuit pathways */}
                    <path d="M0,200 L300,200 L300,300 L600,300 L600,400 L1200,400"
                          stroke="url(#circuit1)" strokeWidth="2" fill="none" className="animate-circuit-flow" />
                    <path d="M0,500 L200,500 L200,350 L500,350 L500,250 L800,250 L800,150 L1200,150"
                          stroke="url(#circuit1)" strokeWidth="2" fill="none" className="animate-circuit-flow-delayed" />

                    {/* Vertical circuit traces */}
                    <path d="M150,0 L150,200 L250,200 L250,400 L350,400 L350,800"
                          stroke="url(#circuit2)" strokeWidth="2" fill="none" className="animate-circuit-flow-v" />
                    <path d="M750,0 L750,150 L650,150 L650,350 L550,350 L550,800"
                          stroke="url(#circuit2)" strokeWidth="2" fill="none" className="animate-circuit-flow-v-delayed" />

                    {/* Diagonal connections */}
                    <path d="M0,0 L200,200 L400,100 L600,300 L800,200 L1200,400"
                          stroke="url(#circuit3)" strokeWidth="1.5" fill="none" className="animate-circuit-diagonal" />

                    {/* Circuit nodes/junctions */}
                    <circle cx="300" cy="200" r="3" fill="#06b6d4" className="animate-pulse-node" />
                    <circle cx="600" cy="300" r="3" fill="#06b6d4" className="animate-pulse-node" style={{animationDelay: '0.5s'}} />
                    <circle cx="200" cy="350" r="3" fill="#8b5cf6" className="animate-pulse-node" style={{animationDelay: '1s'}} />
                    <circle cx="500" cy="250" r="3" fill="#8b5cf6" className="animate-pulse-node" style={{animationDelay: '1.5s'}} />
                    <circle cx="150" cy="200" r="3" fill="#10b981" className="animate-pulse-node" style={{animationDelay: '2s'}} />
                    <circle cx="750" cy="150" r="3" fill="#10b981" className="animate-pulse-node" style={{animationDelay: '2.5s'}} />

                    {/* Microchip-like rectangles */}
                    <rect x="280" y="180" width="40" height="40" fill="none" stroke="#06b6d4" strokeWidth="1" opacity="0.3" className="animate-pulse-slow" />
                    <rect x="580" y="280" width="40" height="40" fill="none" stroke="#8b5cf6" strokeWidth="1" opacity="0.3" className="animate-pulse-slow" style={{animationDelay: '1s'}} />
                    <rect x="130" y="180" width="40" height="40" fill="none" stroke="#10b981" strokeWidth="1" opacity="0.3" className="animate-pulse-slow" style={{animationDelay: '2s'}} />
                </svg>

                {/* Electronic component indicators */}
                <div className="absolute inset-0">
                    {/* Resistor-like elements */}
                    <div className="absolute top-1/4 left-1/3 w-8 h-2 bg-gradient-to-r from-cyan-500/30 to-cyan-400/30 rounded-full animate-pulse-component" />
                    <div className="absolute bottom-1/3 right-1/4 w-8 h-2 bg-gradient-to-r from-purple-500/30 to-purple-400/30 rounded-full animate-pulse-component" style={{animationDelay: '1s'}} />
                    <div className="absolute top-1/2 right-1/3 w-8 h-2 bg-gradient-to-r from-emerald-500/30 to-emerald-400/30 rounded-full animate-pulse-component" style={{animationDelay: '2s'}} />

                    {/* Capacitor-like elements */}
                    <div className="absolute top-2/3 left-1/4 flex space-x-1">
                        <div className="w-1 h-6 bg-cyan-400/20 animate-pulse-component" />
                        <div className="w-1 h-6 bg-cyan-400/20 animate-pulse-component" style={{animationDelay: '0.2s'}} />
                    </div>
                    <div className="absolute top-1/3 right-1/2 flex space-x-1">
                        <div className="w-1 h-6 bg-purple-400/20 animate-pulse-component" style={{animationDelay: '1s'}} />
                        <div className="w-1 h-6 bg-purple-400/20 animate-pulse-component" style={{animationDelay: '1.2s'}} />
                    </div>
                </div>

                {/* Subtle ambient glow behind circuits */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-cyan-500/3 via-transparent to-transparent animate-pulse-ultra-slow" />
                <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-gradient-radial from-purple-500/3 via-transparent to-transparent animate-pulse-ultra-slow" style={{animationDelay: '3s'}} />
            </div>

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

            {/* Custom Styles */}
            <style jsx>{`
                @keyframes circuit-flow {
                    0% { stroke-dasharray: 0 1500; }
                    50% { stroke-dasharray: 300 300; }
                    100% { stroke-dasharray: 1500 0; }
                }

                @keyframes circuit-flow-delayed {
                    0% { stroke-dasharray: 0 1800; }
                    50% { stroke-dasharray: 400 400; }
                    100% { stroke-dasharray: 1800 0; }
                }

                @keyframes circuit-flow-v {
                    0% { stroke-dasharray: 0 1200; }
                    50% { stroke-dasharray: 250 250; }
                    100% { stroke-dasharray: 1200 0; }
                }

                @keyframes circuit-flow-v-delayed {
                    0% { stroke-dasharray: 0 1300; }
                    50% { stroke-dasharray: 280 280; }
                    100% { stroke-dasharray: 1300 0; }
                }

                @keyframes circuit-diagonal {
                    0% { stroke-dasharray: 0 2000; }
                    50% { stroke-dasharray: 500 500; }
                    100% { stroke-dasharray: 2000 0; }
                }

                @keyframes pulse-node {
                    0%, 100% {
                        r: 3;
                        opacity: 0.8;
                        filter: drop-shadow(0 0 3px currentColor);
                    }
                    50% {
                        r: 5;
                        opacity: 1;
                        filter: drop-shadow(0 0 8px currentColor);
                    }
                }

                @keyframes pulse-component {
                    0%, 100% {
                        opacity: 0.2;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.6;
                        transform: scale(1.1);
                    }
                }

                @keyframes pulse-ultra-slow {
                    0%, 100% { opacity: 0.02; }
                    50% { opacity: 0.06; }
                }

                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.6; }
                }

                @keyframes glow {
                    0%, 100% { opacity: 0.2; }
                    50% { opacity: 0.4; }
                }

                @keyframes text-shimmer {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }

                @keyframes error-shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
                    20%, 40%, 60%, 80% { transform: translateX(3px); }
                }

                .animate-circuit-flow {
                    animation: circuit-flow 6s ease-in-out infinite;
                    stroke-dasharray: 0 1500;
                }

                .animate-circuit-flow-delayed {
                    animation: circuit-flow-delayed 6s ease-in-out infinite;
                    animation-delay: 2s;
                    stroke-dasharray: 0 1800;
                }

                .animate-circuit-flow-v {
                    animation: circuit-flow-v 5s ease-in-out infinite;
                    animation-delay: 1s;
                    stroke-dasharray: 0 1200;
                }

                .animate-circuit-flow-v-delayed {
                    animation: circuit-flow-v-delayed 5s ease-in-out infinite;
                    animation-delay: 3s;
                    stroke-dasharray: 0 1300;
                }

                .animate-circuit-diagonal {
                    animation: circuit-diagonal 8s ease-in-out infinite;
                    animation-delay: 1.5s;
                    stroke-dasharray: 0 2000;
                }

                .animate-pulse-node {
                    animation: pulse-node 2s ease-in-out infinite;
                }

                .animate-pulse-component {
                    animation: pulse-component 3s ease-in-out infinite;
                }

                .animate-pulse-ultra-slow {
                    animation: pulse-ultra-slow 6s ease-in-out infinite;
                }

                .animate-pulse-slow {
                    animation: pulse-slow 4s ease-in-out infinite;
                }

                .animate-glow {
                    animation: glow 2s ease-in-out infinite;
                }

                .animate-text-shimmer {
                    background-size: 200% auto;
                    animation: text-shimmer 3s ease-in-out infinite;
                }

                .animate-error-shake {
                    animation: error-shake 0.6s ease-in-out;
                }

                .bg-gradient-radial {
                    background: radial-gradient(circle, var(--tw-gradient-stops));
                }
            `}</style>
        </div>
    );
};

export default LoginPage;