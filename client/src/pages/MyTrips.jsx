import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { jsPDF } from 'jspdf';
import { toJpeg } from 'html-to-image';
import { useAuth } from '@clerk/clerk-react';
import ReactMarkdown from 'react-markdown';
import PlaneLoader from '../components/PlaneLoader';
import UnsplashImage from '../components/UnsplashImage';
import { MapPin, Plane, IndianRupee, Clock, Users, Bus, Target, Trash2, Languages, Loader2, ArrowLeft, Download, Map as MapIcon, Calendar, Compass, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

function MyTrips() {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedTrip, setExpandedTrip] = useState(null);
    const [targetLang, setTargetLang] = useState('hin_Deva');
    const [translatingTripId, setTranslatingTripId] = useState(null);
    const { getToken } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchTrips();
    }, []);

    const fetchTrips = async () => {
        try {
            const token = await getToken();
            const res = await api.get('/trips', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Sort to put the most recent trip first
            const sortedTrips = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setTrips(sortedTrips);
        } catch (err) {
            setError('Failed to fetch trips');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, e) => {
        if (e) e.stopPropagation(); // prevent opening the trip
        if (window.confirm("Are you sure you want to delete this trip itinerary?")) {
            try {
                const token = await getToken();
                await api.delete(`/trips/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTrips(trips.filter(trip => trip._id !== id));
                if (expandedTrip && expandedTrip._id === id) setExpandedTrip(null);
            } catch (err) {
                console.error("Failed to delete trip:", err);
                alert("Failed to delete trip. Please try again.");
            }
        }
    };

    const handleTranslate = async (trip) => {
        setTranslatingTripId(trip._id);
        setError('');

        try {
            const token = await getToken();
            const res = await api.post('/translate', {
                text: trip.itinerary,
                target_lang: targetLang
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const updatedTrip = { ...trip, itinerary: res.data.translatedText };
            setTrips(trips.map(t => t._id === trip._id ? updatedTrip : t));

            // If we are currently viewing this trip, update the viewed state too
            if (expandedTrip && expandedTrip._id === trip._id) {
                setExpandedTrip(updatedTrip);
            }
        } catch (err) {
            console.error(err);
            setError('Translation failed. Please try again.');
        } finally {
            setTranslatingTripId(null);
        }
    };

    const downloadPDF = async (trip) => {
        const sourceElement = document.getElementById(`trip-timeline-${trip._id}`);
        if (!sourceElement) {
            alert("Something went wrong with the PDF export. Could not find itinerary content.");
            return;
        }

        // Create a wrapper for off-screen rendering
        const printContainer = document.createElement('div');
        printContainer.style.position = 'absolute';
        printContainer.style.left = '-9999px';
        printContainer.style.top = '0';
        printContainer.style.width = '800px'; // Fixed width for consistent PDF layout
        printContainer.style.backgroundColor = '#050505';
        printContainer.style.color = '#F3F4F6';

        // Clone the timeline element
        const clonedElement = sourceElement.cloneNode(true);

        // Strip out scrollbars and height restrictions from the clone
        clonedElement.style.height = 'auto';
        clonedElement.style.overflow = 'visible';
        clonedElement.style.maxHeight = 'none';
        clonedElement.classList.remove('overflow-y-auto', 'custom-scrollbar', 'lg:w-[55%]', 'xl:w-[60%]', 'w-full');
        clonedElement.style.width = '100%';

        printContainer.appendChild(clonedElement);
        document.body.appendChild(printContainer);

        try {
            // Wait a tick for styles to apply
            await new Promise(resolve => setTimeout(resolve, 100));

            const imgData = await toJpeg(printContainer, {
                quality: 0.95,
                backgroundColor: '#050505',
                pixelRatio: 2,
                width: printContainer.scrollWidth,
                height: printContainer.scrollHeight
            });

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            let position = 0;
            const pageHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);

            let heightLeft = pdfHeight - pageHeight;
            while (heightLeft >= 0) {
                position = heightLeft - pdfHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`Travique_${trip.destination}_Itinerary.pdf`);
        } catch (error) {
            console.error("Error generating PDF", error);
            alert("There was an issue generating the PDF. Please try again.");
        } finally {
            // Clean up the DOM
            document.body.removeChild(printContainer);
        }
    };

    if (loading) {
        return <PlaneLoader text="Loading your travel portfolio..." />;
    }

    // Stats calculations
    const totalDaysTravelled = trips.reduce((acc, current) => acc + (parseInt(current.days) || 0), 0);
    const totalCountries = new Set(trips.map(t => t.destination.split(',')[t.destination.split(',').length - 1]?.trim() || t.destination)).size;

    // --- EXPANDED ITINERARY VIEW (Split Screen) --- //
    if (expandedTrip) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="min-h-screen bg-[#050505] text-[#F3F4F6] selection:bg-brand-500 selection:text-white flex flex-col font-sans"
            >
                {/* Header Navbar */}
                <div className="sticky top-0 z-50 glass-dark border-b border-white/5 px-8 py-4 flex justify-between items-center w-full">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setExpandedTrip(null)}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <ArrowLeft size={24} className="text-gray-300" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-display font-bold text-white leading-tight">{expandedTrip.destination}</h1>
                            <p className="text-sm text-brand-500 font-medium">{expandedTrip.days} Days Itinerary</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Translation Control in Navbar */}
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
                                onClick={() => handleTranslate(expandedTrip)}
                                disabled={translatingTripId === expandedTrip._id}
                                className="ml-2 px-4 py-1.5 bg-brand-500/20 text-brand-500 rounded-full hover:bg-brand-500/30 transition shadow-sm text-xs font-bold flex items-center justify-center gap-2"
                            >
                                {translatingTripId === expandedTrip._id ? <Loader2 size={14} className="animate-spin" /> : "Translate"}
                            </button>
                        </div>

                        <button
                            onClick={() => downloadPDF(expandedTrip)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-full transition font-semibold shadow-[0_0_20px_rgba(20,184,166,0.2)]"
                        >
                            <Download size={18} /> <span className="hidden md:inline">Export PDF</span>
                        </button>
                    </div>
                </div>

                {/* Main Split Layout */}
                <div className="flex-1 flex flex-col lg:flex-row overflow-hidden" id={`trip-content-${expandedTrip._id}`}>

                    {/* Left: Scrollable Timeline */}
                    <div id={`trip-timeline-${expandedTrip._id}`} className="w-full lg:w-[55%] xl:w-[60%] overflow-y-auto p-6 md:p-12 custom-scrollbar">

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                            <div className="glass-dark p-4 rounded-2xl flex flex-col items-start gap-2 border-t border-white/10">
                                <Clock size={20} className="text-brand-500" />
                                <div>
                                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Duration</p>
                                    <p className="text-lg font-bold text-white">{expandedTrip.days} Days</p>
                                </div>
                            </div>
                            <div className="glass-dark p-4 rounded-2xl flex flex-col items-start gap-2 border-t border-white/10">
                                <IndianRupee size={20} className="text-brand-500" />
                                <div>
                                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Budget</p>
                                    <p className="text-lg font-bold text-white">{expandedTrip.budget}</p>
                                </div>
                            </div>
                            <div className="glass-dark p-4 rounded-2xl flex flex-col items-start gap-2 border-t border-white/10">
                                <Users size={20} className="text-brand-500" />
                                <div>
                                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Travelers</p>
                                    <p className="text-lg font-bold text-white">{expandedTrip.travelers || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="glass-dark p-4 rounded-2xl flex flex-col items-start gap-2 border-t border-white/10">
                                <Bus size={20} className="text-brand-500" />
                                <div>
                                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Transport</p>
                                    <p className="text-lg font-bold text-white">{expandedTrip.transportMode || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Markdown Itinerary Render */}
                        <div className="prose prose-invert prose-brand max-w-none text-gray-300">
                            <ReactMarkdown
                                components={{
                                    h3: ({ node, ...props }) => {
                                        const isDay = props.children[0]?.toString().toLowerCase().includes('day');
                                        return (
                                            <div className="flex items-center gap-3 mt-12 mb-6">
                                                {isDay && <div className="p-2 bg-brand-500/20 rounded-lg text-brand-500"><Calendar size={24} /></div>}
                                                <h3 className="text-3xl font-display font-bold text-white m-0" {...props} />
                                            </div>
                                        )
                                    },
                                    strong: ({ node, ...props }) => <span className="font-bold text-brand-100" {...props} />,
                                    ul: ({ node, ...props }) => <ul className="pl-6 space-y-3 my-4" {...props} />,
                                    li: ({ node, ...props }) => (
                                        <li className="relative pl-2 marker:text-brand-500">
                                            <span {...props} className="text-gray-300 leading-relaxed" />
                                        </li>
                                    ),
                                    p: ({ node, children, ...props }) => {
                                        const contentStr = React.Children.toArray(children).join('');
                                        const isDayHeader = contentStr.startsWith('**Day');

                                        if (isDayHeader) {
                                            return <p className="text-2xl font-display font-bold text-white mt-10 mb-6 border-b border-white/10 pb-4" {...props}>{children}</p>;
                                        }

                                        // Try to detect activity blocks vs normal text
                                        if (contentStr.length > 50 && !contentStr.startsWith('*')) {
                                            return (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}
                                                    className="glass-dark p-6 rounded-2xl border-l-[3px] border-l-brand-500 shadow-xl my-4 hover:bg-white/5 transition-colors"
                                                >
                                                    <p className="leading-relaxed m-0 text-gray-300" {...props}>{children}</p>
                                                </motion.div>
                                            )
                                        }
                                        return <p className="mb-4 text-gray-400" {...props}>{children}</p>
                                    },
                                    img: ({ node, src, alt, ...props }) => {
                                        if (src === 'image') return <div className="my-8 rounded-2xl overflow-hidden shadow-2xl border border-white/10"><UnsplashImage query={alt} /></div>;
                                        return (
                                            <div className="my-8 rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                                                <img {...props} src={src} alt={alt} className="w-full h-auto object-cover max-h-[400px] transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                                            </div>
                                        );
                                    }
                                }}
                            >
                                {expandedTrip.itinerary}
                            </ReactMarkdown>
                        </div>
                    </div>

                    {/* Right: Map / Inspiration Area */}
                    <div className="hidden lg:block w-[45%] xl:w-[40%] bg-zinc-900 border-l border-white/5 relative">
                        {/* Placeholder for real Mapbox map, currently showing a beautiful abstract/image block to serve the split screen visual */}
                        <div className="absolute inset-0 w-full h-full">
                            {/* In a real Mapbox implementation, <Map> component goes here. 
                                For now, we use the Unsplash image of the destination as a gorgeous side-bleed banner. */}
                            <div className="h-full w-full relative group">
                                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10" />
                                <div className="absolute inset-0 bg-black/30 z-10 group-hover:bg-black/10 transition-all duration-700" />
                                <UnsplashImage query={`${expandedTrip.destination} landmark`} className="w-full h-full object-cover" />

                                {/* Overlay Stats specifically for the map side to make it contextual */}
                                <div className="absolute bottom-12 left-12 right-12 z-20">
                                    <div className="glass-dark p-6 rounded-3xl backdrop-blur-xl">
                                        <div className="flex items-center gap-3 mb-2">
                                            <MapPin className="text-brand-500" size={24} />
                                            <h3 className="text-2xl font-display font-medium text-white">{expandedTrip.destination}</h3>
                                        </div>
                                        <p className="text-gray-400 text-sm">Interactive map routing coming soon. Enjoy the spectacular views of your destination along with your curated timeline.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </motion.div>
        );
    }


    // --- BENTO BOX PORTFOLIO VIEW (Default) --- //
    return (
        <div className="min-h-screen bg-[#050505] text-[#F3F4F6] p-4 md:p-8 lg:p-12 font-sans selection:bg-brand-500 selection:text-white">
            <div className="max-w-7xl mx-auto">
                <header className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 gap-6">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-6xl font-display font-bold text-white tracking-tight mb-2"
                        >
                            Travel <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-teal-200">Portfolio</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
                            className="text-gray-400 text-lg lg:text-xl font-light"
                        >
                            Your upcoming adventures and past memories.
                        </motion.p>
                    </div>

                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        onClick={() => navigate('/dashboard')}
                        className="px-6 py-3 bg-white/5 text-white rounded-full transition-all backdrop-blur font-medium border border-white/10 hover:bg-white/10 hover:border-white/20 flex items-center gap-2 self-start md:self-auto"
                    >
                        <Navigation size={18} /> New Adventure
                    </motion.button>
                </header>

                {/* Top Statistics Row */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
                >
                    <div className="glass-dark rounded-3xl p-6 border-t border-white/5 shadow-lg">
                        <Compass className="text-brand-500 mb-4" size={28} />
                        <p className="text-3xl font-display font-bold text-white">{trips.length}</p>
                        <p className="text-sm font-medium text-gray-400 uppercase tracking-widest mt-1">Total Trips</p>
                    </div>
                    <div className="glass-dark rounded-3xl p-6 border-t border-white/5 shadow-lg">
                        <MapIcon className="text-brand-500 mb-4" size={28} />
                        <p className="text-3xl font-display font-bold text-white">{totalCountries || 0}</p>
                        <p className="text-sm font-medium text-gray-400 uppercase tracking-widest mt-1">Destinations</p>
                    </div>
                    <div className="glass-dark rounded-3xl p-6 border-t border-white/5 shadow-lg hidden md:block">
                        <Calendar className="text-brand-500 mb-4" size={28} />
                        <p className="text-3xl font-display font-bold text-white">{totalDaysTravelled}</p>
                        <p className="text-sm font-medium text-gray-400 uppercase tracking-widest mt-1">Days Traveled</p>
                    </div>
                    <div className="glass-dark rounded-3xl p-6 border-t border-white/5 shadow-lg hidden md:block">
                        <Plane className="text-brand-500 mb-4" size={28} />
                        <p className="text-3xl font-display font-bold text-white">12,042</p> {/* Placeholder for miles */}
                        <p className="text-sm font-medium text-gray-400 uppercase tracking-widest mt-1">Miles Flown</p>
                    </div>
                </motion.div>

                {error && <div className="p-4 mb-8 text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl">{error}</div>}

                {trips.length === 0 && !error ? (
                    <div className="glass-dark rounded-3xl p-16 text-center shadow-2xl border-t border-white/10 mt-12">
                        <Compass className="mx-auto text-gray-600 mb-6" size={64} />
                        <h2 className="text-3xl font-display text-white mb-4 font-bold">Your canvas is blank</h2>
                        <p className="text-lg text-gray-400 mb-8 max-w-md mx-auto">Start planning your dream vacations with AI and build an extraordinary travel portfolio.</p>
                        <button
                            onClick={() => navigate('/create-trip')}
                            className="px-8 py-4 rounded-full shadow-[0_0_30px_rgba(20,184,166,0.2)] text-white font-bold text-lg bg-brand-600 hover:bg-brand-500 hover:shadow-[0_0_40px_rgba(20,184,166,0.4)] transition-all transform hover:scale-[1.02] flex items-center justify-center gap-3 mx-auto"
                        >
                            <Plane size={20} /> Plan Your First Trip
                        </button>
                    </div>
                ) : (
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        initial="hidden"
                        animate="show"
                        variants={{
                            hidden: { opacity: 0 },
                            show: { opacity: 1, transition: { staggerChildren: 0.1 } }
                        }}
                    >
                        <AnimatePresence>
                            {trips.map((trip, index) => {
                                // Make the first trip (most recent) span large
                                const isFeatured = index === 0;

                                return (
                                    <motion.div
                                        key={trip._id}
                                        variants={{ hidden: { opacity: 0, scale: 0.95 }, show: { opacity: 1, scale: 1 } }}
                                        layout
                                        onClick={() => setExpandedTrip(trip)}
                                        className={`relative overflow-hidden rounded-[2rem] cursor-pointer group shadow-2xl border border-white/5 hover:border-brand-500/30 transition-colors bg-zinc-900 ${isFeatured ? 'md:col-span-2 md:row-span-2 min-h-[400px] lg:min-h-[500px]' : 'min-h-[250px] lg:min-h-[300px]'}`}
                                    >
                                        {/* Background Image */}
                                        <div className="absolute inset-0 z-0">
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
                                            <UnsplashImage query={`${trip.destination} city landmark`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        </div>

                                        {/* Card Content Overlay */}
                                        <div className="absolute inset-0 z-20 flex flex-col justify-between p-6 md:p-8">

                                            {/* Top badges */}
                                            <div className="flex justify-between items-start">
                                                <div className="glass px-3 py-1.5 rounded-full text-black font-semibold text-xs tracking-wide">
                                                    {trip.days} Days
                                                </div>

                                                {/* Delete Button (Stop propagation to prevent opening trip, uses standard icon) */}
                                                <button
                                                    onClick={(e) => handleDelete(trip._id, e)}
                                                    className="p-2.5 glass-dark rounded-full text-gray-300 hover:text-red-400 hover:bg-red-500/20 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100"
                                                    title="Delete Itinerary"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>

                                            {/* Bottom Info */}
                                            <div>
                                                <h2 className={`${isFeatured ? 'text-4xl md:text-5xl' : 'text-3xl'} font-display font-bold text-white mb-2 leading-tight filter drop-shadow-md`}>
                                                    {trip.destination.split(',')[0]}
                                                </h2>

                                                <div className="flex flex-wrap items-center gap-4 text-gray-300 text-sm font-medium mb-4">
                                                    <span className="flex items-center gap-1.5"><IndianRupee size={14} className="text-brand-400" /> {trip.budget}</span>
                                                    <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                                                    <span>{new Date(trip.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                </div>

                                                {/* Hover Reveal Action */}
                                                <div className="overflow-hidden">
                                                    <div className="transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2 text-brand-400 font-bold text-sm">
                                                        View Itinerary <ArrowLeft size={16} className="rotate-180" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

export default MyTrips;
