import { Plane } from 'lucide-react';

export default function PlaneLoader({ text = "Loading..." }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
            <div className="flex flex-col items-center">
                {/* Orbital Animation Container */}
                <div className="relative w-40 h-40 flex items-center justify-center mb-8">
                    {/* Outer spinning dashed ring */}
                    <div
                        className="absolute inset-0 rounded-full border border-dashed border-white/20 animate-spin"
                        style={{ animationDuration: '8s' }}
                    ></div>

                    {/* Middle spinning solid ring */}
                    <div
                        className="absolute inset-2 rounded-full border-t-2 border-l-2 border-white/40 animate-spin"
                        style={{ animationDirection: 'reverse', animationDuration: '3s' }}
                    ></div>

                    {/* Inner spinning glow ring */}
                    <div
                        className="absolute inset-6 rounded-full border-b-2 border-r-2 border-gray-300 shadow-[0_0_15px_rgba(255,255,255,0.5)] animate-spin"
                        style={{ animationDuration: '2s' }}
                    ></div>

                    {/* Central Glowing Plane */}
                    <div className="relative z-10 p-4 bg-zinc-900 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.3)] border border-white/10 animate-pulse">
                        <Plane className="w-10 h-10 text-white transform -rotate-45" />
                    </div>
                </div>

                {/* Loading Text */}
                <h2 className="text-2xl font-display font-bold text-white tracking-widest uppercase mb-4 animate-pulse">
                    {text}
                </h2>

                {/* Bouncing Dots */}
                <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-white animate-bounce shadow-[0_0_10px_rgba(255,255,255,0.8)]" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-white animate-bounce shadow-[0_0_10px_rgba(255,255,255,0.8)]" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-white animate-bounce shadow-[0_0_10px_rgba(255,255,255,0.8)]" style={{ animationDelay: '300ms' }}></div>
                </div>
            </div>
        </div>
    );
}
