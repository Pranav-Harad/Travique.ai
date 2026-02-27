import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Plane, FolderOpen, MapPin, Compass, ArrowRight, Sun, Cloud, CloudRain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Curated list of high-quality Unsplash images for the rotating background
const DESTINATIONS = [
    { name: "Santorini, Greece", url: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=1920&auto=format&fit=crop" },
    { name: "Kyoto, Japan", url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1920&auto=format&fit=crop" },
    { name: "Taj Mahal, India", url: "https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1920&auto=format&fit=crop" },
    { name: "Kerala Backwaters, India", url: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1920&auto=format&fit=crop" },
    { name: "Amalfi Coast, Italy", url: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=1920&auto=format&fit=crop" },
    { name: "Maldives", url: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1920&auto=format&fit=crop" }
];

// Fun travel quotes
const QUOTES = [
    "To travel is to live.",
    "The world is a book, and those who do not travel read only a page.",
    "Adventure may hurt you but monotony will kill you.",
    "Travel makes one modest. You see what a tiny place you occupy in the world."
];

function Dashboard() {
    const { user } = useUser();
    const navigate = useNavigate();

    const [currentBgIndex, setCurrentBgIndex] = useState(0);
    const [quoteIndex, setQuoteIndex] = useState(0);

    // Rotate background images every 8 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentBgIndex((prev) => (prev + 1) % DESTINATIONS.length);
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    // Pick a random quote on load
    useEffect(() => {
        setQuoteIndex(Math.floor(Math.random() * QUOTES.length));
    }, []);

    const bgUrl = DESTINATIONS[currentBgIndex].url;

    return (
        <div className="min-h-screen bg-black text-[#F3F4F6] selection:bg-brand-500 selection:text-white relative overflow-hidden flex items-center justify-center font-sans">

            {/* Dynamic Rotating Background */}
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={currentBgIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute inset-0 z-0"
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30 z-10" />
                    <img
                        src={bgUrl}
                        alt={DESTINATIONS[currentBgIndex].name}
                        className="w-full h-full object-cover"
                    />
                </motion.div>
            </AnimatePresence>

            {/* Destination Tag */}
            <motion.div
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="absolute top-28 left-8 md:left-12 z-20 flex items-center gap-2 glass px-4 py-2 rounded-full text-white/90 font-medium text-sm backdrop-blur-md border border-white/20 shadow-xl"
            >
                <MapPin size={16} className="text-brand-400" />
                {DESTINATIONS[currentBgIndex].name}
            </motion.div>

            {/* Main Content Area */}
            <div className="relative z-10 w-full max-w-6xl p-6 md:p-12">

                {/* Greeting Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-5xl md:text-7xl font-display font-bold text-white tracking-tight drop-shadow-lg mb-4">
                        Discover the <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-teal-200 block md:inline">World.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 font-light max-w-2xl drop-shadow-md">
                        Welcome back, <span className="font-semibold text-white">{user?.firstName || 'Traveler'}</span>.
                        Where will your next adventure take you?
                    </p>
                </motion.div>

                {/* Dashboard Bento Grid */}
                <motion.div
                    initial="hidden" animate="show"
                    variants={{
                        hidden: { opacity: 0 },
                        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
                    }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {/* Primary Action: Create Trip */}
                    <motion.div
                        variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                        onClick={() => navigate('/create-trip')}
                        className="md:col-span-2 group relative overflow-hidden glass-dark rounded-[2.5rem] p-8 md:p-12 cursor-pointer hover:bg-white/10 transition-all duration-500 border border-white/10 hover:border-brand-500/50 shadow-2xl flex flex-col justify-between min-h-[300px]"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-10 transition-opacity duration-500 transform group-hover:scale-150 group-hover:rotate-12">
                            <Compass size={180} />
                        </div>

                        <div className="relative z-10">
                            <div className="bg-brand-500/20 text-brand-400 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-lg backdrop-blur-md">
                                <Plane size={32} />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">Plan New Trip</h2>
                            <p className="text-gray-400 text-lg max-w-md">Let our AI craft the perfect, personalized itinerary for your next dream destination.</p>
                        </div>

                        <div className="relative z-10 flex items-center text-brand-400 font-bold mt-8 group-hover:translate-x-2 transition-transform">
                            Start Journey <ArrowRight className="ml-2" size={20} />
                        </div>
                    </motion.div>

                    {/* Secondary Action: My Trips */}
                    <motion.div
                        variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                        onClick={() => navigate('/my-trips')}
                        className="group relative overflow-hidden glass-dark rounded-[2.5rem] p-8 md:p-10 cursor-pointer hover:bg-white/10 transition-all duration-500 border border-white/10 hover:border-white/30 shadow-2xl flex flex-col justify-between min-h-[300px]"
                    >
                        <div className="relative z-10">
                            <div className="bg-white/10 text-white w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg backdrop-blur-md">
                                <FolderOpen size={28} />
                            </div>
                            <h2 className="text-2xl font-display font-bold text-white mb-2">Travel Portfolio</h2>
                            <p className="text-gray-400">Access your saved itineraries and offline memories.</p>
                        </div>

                        <div className="relative z-10 flex items-center text-white font-bold mt-8 group-hover:translate-x-2 transition-transform">
                            View Portfolio <ArrowRight className="ml-2" size={20} />
                        </div>
                    </motion.div>

                    {/* Travel Quote Widget */}
                    <motion.div
                        variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                        className="md:col-span-3 glass rounded-[2rem] p-8 mt-2 flex flex-col md:flex-row items-center justify-center text-center gap-6 border border-white/20 shadow-lg relative overflow-hidden"
                    >
                        <div className="flex-1">
                            <p className="text-xl md:text-2xl font-display font-medium text-white italic drop-shadow-md">"{QUOTES[quoteIndex]}"</p>
                            <p className="text-white/70 mt-2 font-medium text-sm tracking-widest uppercase">Daily Inspiration</p>
                        </div>
                    </motion.div>
                </motion.div>

            </div>
        </div>
    );
}

export default Dashboard;
