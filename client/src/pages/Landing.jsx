import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, MapPin, Compass, Brain, IndianRupee, User, Download, Github, Mail, ArrowRight } from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen text-[#F3F4F6] font-sans selection:bg-white selection:text-black overflow-hidden relative bg-transparent">
            <div className="fixed inset-0 z-0 bg-black">
                <ParticleBackground />
                {/* Animated Gradient Background and Floating Circles */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white rounded-full mix-blend-screen filter blur-[150px] opacity-10 animate-pulse"></div>
                    <div className="absolute top-[20%] right-[-10%] w-[30%] h-[30%] bg-gray-400 rounded-full mix-blend-screen filter blur-[150px] opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] bg-gray-500 rounded-full mix-blend-screen filter blur-[150px] opacity-10 animate-pulse" style={{ animationDelay: '4s' }}></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black pointer-events-none"></div>
                </div>
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                {/* Navbar */}
                <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                            <Plane className="w-8 h-8 text-white" />
                            <span className="text-2xl font-display font-bold text-white tracking-wide">Travique</span>
                        </div>

                        <div className="hidden md:flex items-center gap-8">
                            <a href="#features" className="text-[#9CA3AF] hover:text-white transition relative group text-sm font-medium">
                                Features
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                            </a>
                            <a href="#how-it-works" className="text-[#9CA3AF] hover:text-white transition relative group text-sm font-medium">
                                How It Works
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                            </a>
                            <a href="#pricing" className="text-[#9CA3AF] hover:text-white transition relative group text-sm font-medium">
                                Pricing
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
                            </a>
                        </div>

                        <div className="flex items-center gap-4">
                            <button onClick={() => navigate('/login')} className="hidden sm:block text-[#9CA3AF] hover:text-white transition text-sm font-medium">Log In</button>
                            <button
                                onClick={() => navigate('/signup')}
                                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-gray-100 to-gray-400 text-black text-sm font-bold hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-all transform hover:scale-105"
                            >
                                Sign Up
                            </button>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="flex-1 flex flex-col justify-center items-center text-center px-6 py-20 min-h-[calc(100vh-80px)]">
                    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
                        <div className="flex justify-center flex-wrap gap-4 mb-8 opacity-60">
                            <Plane className="w-10 h-10 text-gray-300 animate-bounce" style={{ animationDuration: '3s' }} />
                            <MapPin className="w-10 h-10 text-gray-400 animate-bounce" style={{ animationDuration: '3.5s' }} />
                            <Compass className="w-10 h-10 text-white animate-bounce" style={{ animationDuration: '4s' }} />
                        </div>
                        <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-[#E5E7EB] to-[#9CA3AF]">
                            Plan Smarter.<br />Travel Smarter.
                        </h1>
                        <p className="text-xl md:text-2xl text-[#9CA3AF] max-w-2xl mx-auto font-light leading-relaxed">
                            Experience the future of travel. Our AI-driven intelligent planner curates personalized, breathtaking itineraries in seconds.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-6">
                            <button
                                onClick={() => navigate('/signup')}
                                className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-gray-100 to-gray-300 text-black font-bold text-lg hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] transition-all transform hover:scale-105"
                            >
                                Start Planning <ArrowRight className="w-5 h-5" />
                            </button>
                            <a href="#features" className="w-full sm:w-auto px-8 py-4 rounded-full border border-white/20 text-white font-semibold text-lg hover:bg-white/5 transition-all outline-none text-center">
                                Explore Features
                            </a>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-24 px-6 bg-black relative border-y border-white/5">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-16 text-white">Why Choose Travique?</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { icon: Brain, title: "AI-Powered Itineraries", desc: "Our engine crafts hyper-personalized daily plans based on your unique interests.", color: "text-gray-200", shadow: "hover:shadow-white/10" },
                                { icon: IndianRupee, title: "Smart Budget Estimation", desc: "Get real-time cost tracking and highly accurate estimates for your entire trip.", color: "text-gray-300", shadow: "hover:shadow-white/10" },
                                { icon: User, title: "Personalized Travel Plans", desc: "Every travel suggestion is tailored meticulously to match your distinct style.", color: "text-gray-400", shadow: "hover:shadow-white/10" },
                                { icon: Download, title: "Save & Download Trips", desc: "Easily export your stunning itineraries to a PDF to access completely offline.", color: "text-white", shadow: "hover:shadow-white/10" }
                            ].map((feature, idx) => (
                                <div key={idx} className={`group p-8 rounded-2xl bg-zinc-900/50 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500 transform hover:-translate-y-2 ${feature.shadow}`}>
                                    <div className={`w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${feature.color}`}>
                                        <feature.icon className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-xl font-display font-bold mb-3 text-white">{feature.title}</h3>
                                    <p className="text-[#9CA3AF] leading-relaxed text-sm">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section id="how-it-works" className="py-24 px-6 relative">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-20 text-white">How It Works</h2>

                        <div className="flex flex-col md:flex-row justify-center items-center gap-16 relative">
                            {/* Desktop connecting line */}
                            <div className="hidden md:block absolute top-[40px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-black via-gray-500/40 to-black"></div>

                            {[
                                { step: "1", title: "Enter Details", desc: "Tell us your dream destination, budget, and travel interests." },
                                { step: "2", title: "AI Generates", desc: "Our AI crafts the perfect, optimized day-by-day itinerary instantly." },
                                { step: "3", title: "Explore", desc: "Download the plan and start experiencing your unforgettable trip." }
                            ].map((item, idx) => (
                                <div key={idx} className="relative flex flex-col items-center text-center max-w-xs z-10 w-full group">
                                    <div className="w-20 h-20 rounded-2xl bg-zinc-900 border border-white/10 group-hover:border-white/50 text-white flex items-center justify-center text-3xl font-bold font-display shadow-lg group-hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all duration-300 mb-8 transform group-hover:-translate-y-2 rotate-3 group-hover:rotate-0">
                                        {item.step}
                                    </div>
                                    <h3 className="text-2xl font-display font-bold mb-4 text-white">{item.title}</h3>
                                    <p className="text-[#9CA3AF] leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 px-6 relative overflow-hidden flex justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 via-black to-gray-800/20"></div>
                    <div className="relative z-10 w-full max-w-5xl mx-auto text-center p-16 rounded-[2.5rem] bg-zinc-900/40 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
                        <h2 className="text-4xl md:text-5xl font-display font-bold mb-10 text-white leading-tight">Ready to explore your<br />next adventure?</h2>
                        <button
                            onClick={() => navigate('/signup')}
                            className="px-12 py-5 rounded-full bg-gradient-to-r from-gray-100 to-gray-300 text-black font-bold text-xl hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] transition-all transform hover:scale-105"
                        >
                            Create Your First Trip
                        </button>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-black border-t border-white/5 py-12 px-6">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Plane className="w-6 h-6 text-white" />
                            <span className="text-xl font-display font-bold text-white tracking-wider">Travique</span>
                        </div>
                        <div className="text-[#9CA3AF] text-sm">
                            &copy; {new Date().getFullYear()} Travique. All rights reserved.
                        </div>
                        <div className="flex items-center gap-6">
                            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-[#9CA3AF] hover:text-[#F3F4F6] transition-colors p-2 hover:bg-white/5 rounded-full">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="mailto:hello@travique.com" className="text-[#9CA3AF] hover:text-[#F3F4F6] transition-colors p-2 hover:bg-white/5 rounded-full">
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
