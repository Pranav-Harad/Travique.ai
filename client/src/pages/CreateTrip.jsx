import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '@clerk/clerk-react';
import ReactMarkdown from 'react-markdown';
import PlaneLoader from '../components/PlaneLoader';
import UnsplashImage from '../components/UnsplashImage';
import Footer from '../components/Footer';
import { MapPin, Plane, IndianRupee, Clock, Users, Bus, Target, Languages, Loader2 } from 'lucide-react';

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
            <div className="min-h-screen flex flex-col bg-black text-[#F3F4F6] selection:bg-white selection:text-black">
                <div className="flex-grow p-8">
                    <div className="max-w-4xl mx-auto bg-zinc-900 border border-white/10 rounded-2xl shadow-xl p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-display font-bold text-white">Your Trip to {generatedTrip.destination}</h1>
                            <div className="flex items-center gap-3">
                                <div className="flex bg-zinc-800/80 p-1 rounded-full border border-white/10 items-center">
                                    <Languages size={16} className="text-gray-400 ml-2" />
                                    <select
                                        value={targetLang}
                                        onChange={(e) => setTargetLang(e.target.value)}
                                        className="bg-transparent text-sm text-gray-300 font-medium focus:outline-none focus:ring-0 ml-1 py-1 cursor-pointer pr-4 appearance-none"
                                    >
                                        {INDIAN_LANGUAGES.map(lang => (
                                            <option key={lang.code} value={lang.code} className="bg-zinc-800">{lang.name}</option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={handleTranslate}
                                        disabled={isTranslating}
                                        className="px-3 py-1 bg-blue-600/20 text-blue-400 min-w-[90px] rounded-full hover:bg-blue-600/30 transition shadow-sm text-xs font-semibold flex items-center justify-center gap-1 disabled:opacity-50"
                                    >
                                        {isTranslating ? <Loader2 size={12} className="animate-spin" /> : "Translate"}
                                    </button>
                                </div>

                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="px-5 py-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition backdrop-blur text-sm font-semibold border border-white/5"
                                >
                                    Back to Dashboard
                                </button>
                            </div>
                        </div>

                        <div className="bg-black border border-white/10 p-5 rounded-xl mb-8 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-300">
                            <div><span className="text-white font-semibold flex items-center gap-2"><MapPin size={16} className="text-gray-400" /> From:</span> {generatedTrip.startLocation}</div>
                            <div><span className="text-white font-semibold flex items-center gap-2"><Plane size={16} className="text-gray-400" /> To:</span> {generatedTrip.destination}</div>
                            <div><span className="text-white font-semibold flex items-center gap-2"><IndianRupee size={16} className="text-gray-400" /> Budget:</span> {generatedTrip.budget}</div>
                            <div><span className="text-white font-semibold flex items-center gap-2"><Clock size={16} className="text-gray-400" /> Duration:</span> {generatedTrip.days} Days</div>
                            <div><span className="text-white font-semibold flex items-center gap-2"><Users size={16} className="text-gray-400" /> Travelers:</span> {generatedTrip.travelers}</div>
                            <div><span className="text-white font-semibold flex items-center gap-2"><Bus size={16} className="text-gray-400" /> Transport:</span> {generatedTrip.transportMode}</div>
                            <div className="md:col-span-3 mt-2 pt-2 border-t border-white/10 flex items-start gap-2"><Target size={16} className="text-gray-400 mt-1 shrink-0" /><span className="text-white font-semibold">Focus:</span> <span className="text-gray-300">{generatedTrip.interests}</span></div>
                        </div>

                        <div className="text-gray-300 space-y-6">
                            <ReactMarkdown
                                components={{
                                    h3: ({ node, ...props }) => <h3 className="text-xl font-display font-semibold text-white mt-8 mb-4 flex items-center gap-2" {...props} />,
                                    strong: ({ node, ...props }) => <span className="font-bold text-gray-200" {...props} />,
                                    ul: ({ node, ...props }) => <ul className="list-disc pl-5 mt-2 space-y-2" {...props} />,
                                    li: ({ node, ...props }) => <li className="text-gray-400 marker:text-gray-600" {...props} />,
                                    p: ({ node, children, ...props }) => {
                                        const isDayHeader = typeof children[0] === 'string' && children[0].startsWith('**Day');
                                        if (isDayHeader) {
                                            return <p className="mb-4 text-lg text-white" {...props}>{children}</p>;
                                        }
                                        const contentStr = React.Children.toArray(children).join('');
                                        if (!isDayHeader && contentStr.length > 50) {
                                            return (
                                                <div className="bg-zinc-800/50 p-5 rounded-xl border border-white/5 shadow-md my-3 hover:border-white/10 transition-colors">
                                                    <p className="text-gray-300 leading-relaxed" {...props}>{children}</p>
                                                </div>
                                            )
                                        }
                                        return <p className="mb-2" {...props}>{children}</p>
                                    },
                                    img: ({ node, src, alt, ...props }) => {
                                        if (src === 'image') {
                                            return <UnsplashImage query={alt} />;
                                        }
                                        return (
                                            <div className="my-6 overflow-hidden rounded-xl border border-white/10 shadow-lg bg-zinc-900 group">
                                                <img
                                                    {...props}
                                                    src={src}
                                                    alt={alt}
                                                    className="w-full h-auto object-cover max-h-80 transition-transform duration-700 group-hover:scale-105"
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
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-black text-[#F3F4F6] selection:bg-white selection:text-black">
            <div className="flex-grow flex items-start justify-center p-8 pt-16">
                {loading && <PlaneLoader text="AI is Generating Itinerary..." />}
                <div className="max-w-2xl w-full bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl p-10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-300 to-gray-600"></div>

                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-display font-bold text-white">Plan a New Trip</h2>
                        <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white transition text-sm font-medium">Cancel</button>
                    </div>

                    {error && <div className="p-4 mb-6 text-sm text-red-200 bg-red-900/50 border border-red-500/30 rounded-xl backdrop-blur-sm">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Start Location</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. New York, Mumbai"
                                    className="w-full px-5 py-3 bg-black border border-white/20 text-white placeholder-gray-600 rounded-xl focus:ring-2 focus:ring-white/50 focus:border-white/50 transition outline-none"
                                    value={startLocation}
                                    onChange={(e) => setStartLocation(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Destination</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Paris, Bali, Kyoto"
                                    className="w-full px-5 py-3 bg-black border border-white/20 text-white placeholder-gray-600 rounded-xl focus:ring-2 focus:ring-white/50 focus:border-white/50 transition outline-none"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Budget (₹)</label>
                                <input
                                    type="number"
                                    required
                                    min="1000"
                                    placeholder="e.g. 50000"
                                    className="w-full px-5 py-3 bg-black border border-white/20 text-white placeholder-gray-600 rounded-xl focus:ring-2 focus:ring-white/50 focus:border-white/50 transition outline-none"
                                    value={budget}
                                    onChange={(e) => setBudget(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Duration (Days)</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    max="30"
                                    placeholder="e.g. 5"
                                    className="w-full px-5 py-3 bg-black border border-white/20 text-white placeholder-gray-600 rounded-xl focus:ring-2 focus:ring-white/50 focus:border-white/50 transition outline-none"
                                    value={days}
                                    onChange={(e) => setDays(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Travelers</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    max="20"
                                    placeholder="e.g. 2"
                                    className="w-full px-5 py-3 bg-black border border-white/20 text-white placeholder-gray-600 rounded-xl focus:ring-2 focus:ring-white/50 focus:border-white/50 transition outline-none"
                                    value={travelers}
                                    onChange={(e) => setTravelers(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Transport Type</label>
                                <select
                                    className="w-full px-5 py-3 bg-black border border-white/20 text-white rounded-xl focus:ring-2 focus:ring-white/50 focus:border-white/50 transition outline-none appearance-none cursor-pointer"
                                    value={transportMode}
                                    onChange={(e) => setTransportMode(e.target.value)}
                                >
                                    <option value="Flight">Flight (Plane)</option>
                                    <option value="Train">Train</option>
                                    <option value="Bus">Bus</option>
                                    <option value="Own Vehicle">Own Vehicle / Road Trip</option>
                                    <option value="Ship / Cruise">Ship / Cruise</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">What are your interests?</label>
                            <textarea
                                required
                                rows="4"
                                placeholder="e.g. Historical sites, romantic dinners, scuba diving, relaxing on the beach..."
                                className="w-full px-5 py-3 bg-black border border-white/20 text-white placeholder-gray-600 rounded-xl focus:ring-2 focus:ring-white/50 focus:border-white/50 transition outline-none resize-none"
                                value={interests}
                                onChange={(e) => setInterests(e.target.value)}
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 px-6 rounded-full shadow-lg text-black font-bold text-lg mt-4 
              ${loading ? 'bg-gray-600 cursor-not-allowed opacity-70' : 'bg-gradient-to-r from-gray-100 to-gray-400 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all transform hover:scale-[1.02]'}`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center text-white">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    AI is Generating Itinerary...
                                </span>
                            ) : 'Generate Smart Itinerary'}
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default CreateTrip;
