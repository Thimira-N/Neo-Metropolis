const BackgroundAnimation = () => {
    return (
        <>
            {/* Premium Circuit Board Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                {/* Base dark gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />

                {/* Circuit pattern grid overlay */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `
                            radial-gradient(circle at 1px 1px, rgba(6,182,212,0.2) 1px, transparent 0),
                            linear-gradient(90deg, rgba(139,92,246,0.05) 1px, transparent 1px),
                            linear-gradient(rgba(139,92,246,0.05) 1px, transparent 1px)
                        `,
                        backgroundSize: '60px 60px, 30px 30px, 30px 30px',
                    }}
                />

                {/* Animated SVG Traces */}
                <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 1200 800">
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

                    {/* Horizontal, vertical, and diagonal traces */}
                    <path d="M0,200 L300,200 L300,300 L600,300 L600,400 L1200,400" stroke="url(#circuit1)" strokeWidth="2" fill="none" className="animate-circuit-flow" />
                    <path d="M0,500 L200,500 L200,350 L500,350 L500,250 L800,250 L800,150 L1200,150" stroke="url(#circuit1)" strokeWidth="2" fill="none" className="animate-circuit-flow-delayed" />
                    <path d="M150,0 L150,200 L250,200 L250,400 L350,400 L350,800" stroke="url(#circuit2)" strokeWidth="2" fill="none" className="animate-circuit-flow-v" />
                    <path d="M750,0 L750,150 L650,150 L650,350 L550,350 L550,800" stroke="url(#circuit2)" strokeWidth="2" fill="none" className="animate-circuit-flow-v-delayed" />
                    <path d="M0,0 L200,200 L400,100 L600,300 L800,200 L1200,400" stroke="url(#circuit3)" strokeWidth="1.5" fill="none" className="animate-circuit-diagonal" />

                    {/* Nodes */}
                    {[{cx:300,cy:200,color:"#06b6d4",delay:"0s"},{cx:600,cy:300,color:"#06b6d4",delay:"0.5s"},
                        {cx:200,cy:350,color:"#8b5cf6",delay:"1s"},{cx:500,cy:250,color:"#8b5cf6",delay:"1.5s"},
                        {cx:150,cy:200,color:"#10b981",delay:"2s"},{cx:750,cy:150,color:"#10b981",delay:"2.5s"}].map((n, i) => (
                        <circle key={i} cx={n.cx} cy={n.cy} r="3" fill={n.color} className="animate-pulse-node" style={{ animationDelay: n.delay }} />
                    ))}

                    {/* Microchips */}
                    {[{x:280,y:180,color:"#06b6d4",delay:"0s"},{x:580,y:280,color:"#8b5cf6",delay:"1s"},{x:130,y:180,color:"#10b981",delay:"2s"}].map((chip, i) => (
                        <rect key={i} x={chip.x} y={chip.y} width="40" height="40" fill="none" stroke={chip.color} strokeWidth="1" opacity="0.3" className="animate-pulse-slow" style={{ animationDelay: chip.delay }} />
                    ))}
                </svg>

                {/* Components */}
                <div className="absolute inset-0">
                    {/* Resistors */}
                    <div className="absolute top-1/4 left-1/3 w-8 h-2 bg-cyan-400/30 rounded-full animate-pulse-component" />
                    <div className="absolute bottom-1/3 right-1/4 w-8 h-2 bg-purple-400/30 rounded-full animate-pulse-component" style={{ animationDelay: '1s' }} />
                    <div className="absolute top-1/2 right-1/3 w-8 h-2 bg-emerald-400/30 rounded-full animate-pulse-component" style={{ animationDelay: '2s' }} />

                    {/* Capacitors */}
                    <div className="absolute top-2/3 left-1/4 flex space-x-1">
                        <div className="w-1 h-6 bg-cyan-400/20 animate-pulse-component" />
                        <div className="w-1 h-6 bg-cyan-400/20 animate-pulse-component" style={{ animationDelay: '0.2s' }} />
                    </div>
                    <div className="absolute top-1/3 right-1/2 flex space-x-1">
                        <div className="w-1 h-6 bg-purple-400/20 animate-pulse-component" style={{ animationDelay: '1s' }} />
                        <div className="w-1 h-6 bg-purple-400/20 animate-pulse-component" style={{ animationDelay: '1.2s' }} />
                    </div>
                </div>

                {/* Glowing overlays */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse-ultra-slow" />
                <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse-ultra-slow" style={{ animationDelay: '3s' }} />
            </div>

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
                    0%, 100% { r: 3; opacity: 0.8; filter: drop-shadow(0 0 3px currentColor); }
                    50% { r: 5; opacity: 1; filter: drop-shadow(0 0 8px currentColor); }
                }
                @keyframes pulse-component {
                    0%, 100% { opacity: 0.2; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.1); }
                }
                @keyframes pulse-ultra-slow {
                    0%, 100% { opacity: 0.02; }
                    50% { opacity: 0.06; }
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.6; }
                }
                .animate-circuit-flow {
                    animation: circuit-flow 6s ease-in-out infinite;
                }
                .animate-circuit-flow-delayed {
                    animation: circuit-flow-delayed 6s ease-in-out infinite;
                    animation-delay: 2s;
                }
                .animate-circuit-flow-v {
                    animation: circuit-flow-v 5s ease-in-out infinite;
                    animation-delay: 1s;
                }
                .animate-circuit-flow-v-delayed {
                    animation: circuit-flow-v-delayed 5s ease-in-out infinite;
                    animation-delay: 3s;
                }
                .animate-circuit-diagonal {
                    animation: circuit-diagonal 8s ease-in-out infinite;
                    animation-delay: 1.5s;
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

            `}</style>
        </>
    );
};

export default BackgroundAnimation;

