import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '@clerk/clerk-react';
import ReactMarkdown from 'react-markdown';
import PlaneLoader from '../components/PlaneLoader';
import UnsplashImage from '../components/UnsplashImage';
import Footer from '../components/Footer';
import { MapPin, Plane, IndianRupee, Clock, Users, Bus, Target, Languages, Loader2, ArrowLeft, Heart, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';

const INDIAN_LANGUAGES = [
    { code: 'hin_Deva', name: 'Hindi' },
    { code: 'ben_Beng', name: 'Bengali' },
    { code: 'tam_Taml', name: 'Tamil' },
    { code: 'tel_Telu', name: 'Telugu' },
    { code: 'mar_Deva', name: 'Marathi' },
    { code: 'guj_Gujr', name: 'Gujarati' },
    { code: 'mal_Mlym', name: 'Malayalam' },
    { code: 'urd_Arab', name: 'Urdu' },
    { code: 'pan_Guru', name: 'Punjabi' }
];

function CreateTrip() {
    const [startLocation, setStartLocation] = useState('');
    const [destination, setDestination] = useState('');
    const [budget, setBudget] = useState('');
    const [days, setDays] = useState('');
    const [travelers, setTravelers] = useState('1');
    const [transportMode, setTransportMode] = useState('Flight');
    const [interests, setInterests] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [generatedTrip, setGeneratedTrip] = useState(null);

    // Translation state
    const [targetLang, setTargetLang] = useState('hin_Deva');
    const [isTranslating, setIsTranslating] = useState(false);

    const { getToken } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = await getToken();

            const res = await api.post('/trips', {
                startLocation,
                destination,
                budget: Number(budget),
                days: Number(days),
                travelers: Number(travelers),
                transportMode,
                interests
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Trip generated:', res.data);
            setGeneratedTrip(res.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to generate itinerary. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleTranslate = async () => {
        if (!generatedTrip) return;
        setIsTranslating(true);
        setError('');

        try {
            const token = await getToken();
            const res = await api.post('/translate', {
                text: generatedTrip.itinerary,
                target_lang: targetLang
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update the generatedTrip's itinerary with the translated text
            setGeneratedTrip(prev => ({
                ...prev,
                itinerary: res.data.translatedText
            }));
        } catch (err) {
            console.error(err);
            setError('Translation failed. Please try again.');
        } finally {
            setIsTranslating(false);
        }
    };

    if (generatedTrip) {
        return (
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="min-h-screen flex flex-col bg-[#050505] text-[#F3F4F6] selection:bg-brand-500 selection:text-white relative font-sans"
            >
                {/* Header Navbar */}
                <div className="sticky top-0 z-50 glass-dark border-b border-white/5 px-6 md:px-12 py-4 flex justify-between items-center w-full">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <ArrowLeft size={24} className="text-gray-300" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-display font-bold text-white leading-tight">Your Trip to {generatedTrip.destination}</h1>
                            <p className="text-sm text-brand-500 font-medium">{generatedTrip.days} Days Itinerary</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex bg-white/5 px-3 py-1.5 rounded-full border border-white/10 items-center">
                            <Languages size={18} className="text-gray-400" />
                            <select
                                value={targetLang}
                                onChange={(e) => setTargetLang(e.target.value)}
                                className="bg-transparent text-sm text-gray-300 font-medium focus:outline-none focus:ring-0 ml-2 py-1 cursor-pointer pr-4 appearance-none"
                            >
                                {INDIAN_LANGUAGES.map(lang => (
                                    <option key={lang.code} value={lang.code} className="bg-zinc-800">{lang.name}</option>
                                ))}
                            </select>
                            <button
                                onClick={handleTranslate}
                                disabled={isTranslating}
                                className="ml-2 px-4 py-1.5 bg-brand-500/20 text-brand-500 rounded-full hover:bg-brand-500/30 transition shadow-sm text-xs font-bold flex items-center justify-center gap-2"
                            >
                                {isTranslating ? <Loader2 size={14} className="animate-spin" /> : "Translate"}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex-grow p-6 md:p-12 max-w-5xl mx-auto w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12"
                    >
                        {[
                            { icon: Navigation, label: 'From', value: generatedTrip.startLocation },
                            { icon: MapPin, label: 'To', value: generatedTrip.destination },
                            { icon: IndianRupee, label: 'Budget', value: generatedTrip.budget },
                            { icon: Clock, label: 'Duration', value: `${generatedTrip.days} Days` },
                            { icon: Users, label: 'Travelers', value: generatedTrip.travelers },
                            { icon: Bus, label: 'Transport', value: generatedTrip.transportMode }
                        ].map((stat, i) => (
                            <div key={i} className="glass-dark p-4 rounded-2xl flex flex-col items-start justify-center border-t border-white/5 shadow-lg">
                                <stat.icon size={20} className="text-brand-500 mb-2" />
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{stat.label}</p>
                                <p className="text-sm font-semibold text-white whitespace-nowrap overflow-hidden text-ellipsis w-full">{stat.value}</p>
                            </div>
                        ))}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                        className="glass-dark p-6 rounded-3xl border border-white/5 shadow-xl mb-12 flex items-start gap-4"
                    >
                        <div className="p-3 bg-brand-500/20 rounded-xl shrink-0">
                            <Target size={24} className="text-brand-400" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-lg mb-1">Trip Focus</h3>
                            <p className="text-gray-300 leading-relaxed font-light">{generatedTrip.interests}</p>
                        </div>
                    </motion.div>

                    <div className="prose prose-invert prose-brand max-w-none text-gray-300">
                        <ReactMarkdown
                            components={{
                                h3: ({ node, ...props }) => <h3 className="text-2xl font-display font-bold text-white mt-12 mb-6 flex items-center gap-3 border-b border-white/10 pb-4" {...props} />,
                                strong: ({ node, ...props }) => <span className="font-semibold text-brand-300" {...props} />,
                                ul: ({ node, ...props }) => <ul className="list-none pl-0 mt-4 space-y-3" {...props} />,
                                li: ({ node, children, ...props }) => (
                                    <li className="flex items-start gap-3 text-gray-300" {...props}>
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0"></div>
                                        <span className="leading-relaxed">{children}</span>
                                    </li>
                                ),
                                p: ({ node, children, ...props }) => {
                                    const isDayHeader = typeof children[0] === 'string' && children[0].startsWith('**Day');

                                    const contentStr = React.Children.toArray(children).join('');
                                    if (!isDayHeader && contentStr.length > 50) {
                                        return (
                                            <div className="glass-dark p-6 rounded-2xl border-t border-white/5 shadow-lg my-6 hover:bg-white/5 transition-colors group">
                                                <p className="text-gray-300 leading-relaxed font-light" {...props}>{children}</p>
                                            </div>
                                        )
                                    }
                                    return <p className="mb-4 text-brand-200/80 font-medium" {...props}>{children}</p>
                                },
                                img: ({ node, src, alt, ...props }) => {
                                    if (src === 'image') {
                                        return <UnsplashImage query={alt} />;
                                    }
                                    return (
                                        <div className="my-8 overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-zinc-900 group">
                                            <img
                                                {...props}
                                                src={src}
                                                alt={alt}
                                                className="w-full h-auto object-cover max-h-[400px] transition-transform duration-1000 group-hover:scale-105"
                                                loading="lazy"
                                            />
                                        </div>
                                    );
                                }
                            }}
                        >
                            {generatedTrip.itinerary}
                        </ReactMarkdown>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="min-h-screen relative flex items-center justify-center p-6 md:p-12 font-sans overflow-hidden bg-black text-[#F3F4F6] selection:bg-brand-500 selection:text-white">

            {/* Ambient Background */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1920&auto=format&fit=crop"
                    alt="Travel Background"
                    className="w-full h-full object-cover opacity-40 blur-sm scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-[#050505] z-10" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 w-full max-w-3xl"
            >
                {loading && <PlaneLoader text="AI is Mapping Your Journey..." />}

                <div className="glass-dark rounded-[2.5rem] border border-white/10 shadow-2xl p-8 md:p-12 relative overflow-hidden">
                    {/* Decorative gradient orb */}
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="flex justify-between items-center mb-10 relative z-10">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">Design Your Journey</h2>
                            <p className="text-gray-400 mt-2 font-medium">Tell us your preferences, and our AI will build the perfect itinerary.</p>
                        </div>
                        <button onClick={() => navigate('/dashboard')} className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-white/20 transition-colors shrink-0">
                            <ArrowLeft size={20} className="text-white" />
                        </button>
                    </div>

                    {error && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-4 mb-8 text-sm text-red-200 bg-red-900/30 border border-red-500/30 rounded-2xl backdrop-blur-md flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        {/* Location Group */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2">Starting Point</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Navigation size={18} className="text-gray-500 group-focus-within:text-brand-400 transition-colors" />
                                    </div>
                                    <input
                                        type="text" required placeholder="e.g. New York, Mumbai"
                                        className="w-full pl-12 pr-5 py-4 bg-black/50 border border-white/10 text-white placeholder-gray-600 rounded-2xl focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all outline-none backdrop-blur-sm shadow-inner"
                                        value={startLocation} onChange={(e) => setStartLocation(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2">Dream Destination</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <MapPin size={18} className="text-gray-500 group-focus-within:text-brand-400 transition-colors" />
                                    </div>
                                    <input
                                        type="text" required placeholder="e.g. Paris, Bali, Kyoto"
                                        className="w-full pl-12 pr-5 py-4 bg-black/50 border border-white/10 text-white placeholder-gray-600 rounded-2xl focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all outline-none backdrop-blur-sm shadow-inner"
                                        value={destination} onChange={(e) => setDestination(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Logistics Group */}
                        <div className="bg-white/5 rounded-3xl p-6 border border-white/5 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2">Budget (₹)</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <IndianRupee size={16} className="text-gray-500 group-focus-within:text-brand-400 transition-colors" />
                                        </div>
                                        <input
                                            type="number" required min="1000" placeholder="50000"
                                            className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 text-white placeholder-gray-600 rounded-xl focus:ring-2 focus:ring-brand-500/50 transition-all outline-none"
                                            value={budget} onChange={(e) => setBudget(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2">Duration</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Clock size={16} className="text-gray-500 group-focus-within:text-brand-400 transition-colors" />
                                        </div>
                                        <input
                                            type="number" required min="1" max="30" placeholder="5 Days"
                                            className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 text-white placeholder-gray-600 rounded-xl focus:ring-2 focus:ring-brand-500/50 transition-all outline-none"
                                            value={days} onChange={(e) => setDays(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2">Travelers</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Users size={16} className="text-gray-500 group-focus-within:text-brand-400 transition-colors" />
                                        </div>
                                        <input
                                            type="number" required min="1" max="20" placeholder="2 People"
                                            className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 text-white placeholder-gray-600 rounded-xl focus:ring-2 focus:ring-brand-500/50 transition-all outline-none"
                                            value={travelers} onChange={(e) => setTravelers(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2">Transport Mode</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Plane size={16} className="text-gray-500 group-focus-within:text-brand-400 transition-colors" />
                                    </div>
                                    <select
                                        className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-brand-500/50 transition-all outline-none appearance-none cursor-pointer"
                                        value={transportMode} onChange={(e) => setTransportMode(e.target.value)}
                                    >
                                        <option className="bg-zinc-900" value="Flight">Flight (Plane)</option>
                                        <option className="bg-zinc-900" value="Train">Train</option>
                                        <option className="bg-zinc-900" value="Bus">Bus</option>
                                        <option className="bg-zinc-900" value="Own Vehicle">Road Trip / Driving</option>
                                        <option className="bg-zinc-900" value="Ship / Cruise">Ship / Cruise</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-500">
                                        ▼
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Interests */}
                        <div className="space-y-2 pt-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2 flex items-center gap-2">
                                <Heart size={14} className="text-brand-400" /> Trip Focus & Interests
                            </label>
                            <textarea
                                required rows="3"
                                placeholder="e.g. Historical sites, romantic dinners, scuba diving, relaxing on the beach..."
                                className="w-full px-5 py-4 bg-black/50 border border-white/10 text-white placeholder-gray-600 rounded-2xl focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all outline-none resize-none backdrop-blur-sm shadow-inner leading-relaxed"
                                value={interests} onChange={(e) => setInterests(e.target.value)}
                            ></textarea>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`relative w-full py-5 px-6 rounded-full text-white font-display font-bold text-lg mt-8 overflow-hidden group transition-all duration-300
                                ${loading ? 'opacity-80 cursor-not-allowed bg-zinc-800' : 'hover:shadow-[0_0_30px_rgba(20,184,166,0.3)] hover:-translate-y-1 bg-zinc-800'}`
                            }
                        >
                            {!loading && (
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-brand-600 via-teal-500 to-brand-600 opacity-80 group-hover:opacity-100 transition-opacity"></div>
                            )}

                            <span className="relative z-10 flex items-center justify-center">
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-brand-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Crafting Your Itinerary...
                                    </>
                                ) : 'Generate Smart Itinerary'}
                            </span>
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}

export default CreateTrip;
