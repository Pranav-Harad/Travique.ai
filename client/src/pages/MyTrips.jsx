import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { jsPDF } from 'jspdf';
import { useAuth } from '@clerk/clerk-react';
import ReactMarkdown from 'react-markdown';
import PlaneLoader from '../components/PlaneLoader';
import UnsplashImage from '../components/UnsplashImage';
import { MapPin, Plane, IndianRupee, Clock, Users, Bus, Target, Trash2 } from 'lucide-react';

function MyTrips() {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedTrip, setExpandedTrip] = useState(null);
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
            setTrips(res.data);
        } catch (err) {
            setError('Failed to fetch trips');
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = (id) => {
        if (expandedTrip === id) {
            setExpandedTrip(null);
        } else {
            setExpandedTrip(id);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this trip itinerary?")) {
            try {
                const token = await getToken();
                await api.delete(`/trips/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Remove the deleted trip from the UI without refetching all
                setTrips(trips.filter(trip => trip._id !== id));
            } catch (err) {
                console.error("Failed to delete trip:", err);
                alert("Failed to delete trip. Please try again.");
            }
        }
    };

    const downloadPDF = (trip) => {
        const doc = new jsPDF();
        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);
        doc.text(`Travique - Itinerary for ${trip.destination}`, 15, 20);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text(`Budget: Rs. ${trip.budget} | Duration: ${trip.days} Days`, 15, 30);
        doc.text(`Interests: ${trip.interests}`, 15, 38);

        doc.line(15, 42, 195, 42); // Draw a line

        let yOffset = 52;
        const lines = doc.splitTextToSize(trip.itinerary, 180);

        lines.forEach(line => {
            if (yOffset > 280) {
                doc.addPage();
                yOffset = 20;
            }
            doc.text(line, 15, yOffset);
            yOffset += 7;
        });

        doc.save(`Travique_${trip.destination}_Itinerary.pdf`);
    };

    if (loading) {
        return <PlaneLoader text="Loading your trips..." />;
    }

    return (
        <div className="min-h-screen bg-black text-[#F3F4F6] p-8 selection:bg-white selection:text-black">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-display font-bold text-white tracking-wide">My Trips</h1>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-5 py-2 bg-white/10 text-white rounded-full transition backdrop-blur text-sm font-semibold border border-white/5 hover:bg-white/20"
                    >
                        Back to Dashboard
                    </button>
                </div>

                {error && <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">{error}</div>}

                {trips.length === 0 && !error ? (
                    <div className="bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl p-10 text-center">
                        <h2 className="text-xl text-gray-400 mb-6 font-light">You haven't planned any trips yet.</h2>
                        <button
                            onClick={() => navigate('/create-trip')}
                            className="px-8 py-3 rounded-full shadow-lg text-black font-bold text-lg bg-gradient-to-r from-gray-100 to-gray-400 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all transform hover:scale-[1.02]"
                        >
                            Plan Your First Trip
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {trips.map((trip) => (
                            <div key={trip._id} className="bg-zinc-900 border border-white/10 rounded-2xl shadow-xl overflow-hidden hover:border-white/20 transition-all duration-300">
                                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/50">
                                    <div>
                                        <h2 className="text-2xl font-display font-bold text-white mb-2">{trip.destination}</h2>
                                        <p className="text-sm text-gray-400">
                                            {trip.days} Days • ₹{trip.budget} Budget • Created on {new Date(trip.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex space-x-4">
                                        <button
                                            onClick={() => downloadPDF(trip)}
                                            className="px-5 py-2 bg-black text-gray-300 border border-white/20 rounded-full hover:bg-white/10 hover:text-white transition flex items-center shadow-lg font-medium text-sm"
                                        >
                                            <span className="mr-2">📄</span> PDF
                                        </button>
                                        <button
                                            onClick={() => toggleExpand(trip._id)}
                                            className="px-5 py-2 bg-gradient-to-r from-gray-200 to-gray-400 text-black border border-transparent rounded-full hover:shadow-[0_0_15px_rgba(255,255,255,0.3)] transition font-bold text-sm"
                                        >
                                            {expandedTrip === trip._id ? 'Hide Details' : 'View Itinerary'}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(trip._id)}
                                            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors self-center border border-transparent hover:border-red-500/30"
                                            title="Delete Trip"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>

                                {expandedTrip === trip._id && (
                                    <div className="p-8 bg-black/80 border-t border-white/5">
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 text-sm text-gray-300 bg-zinc-900 border border-white/10 p-4 rounded-xl">
                                            {trip.startLocation && <div><span className="text-white font-semibold flex items-center gap-2"><MapPin size={16} className="text-gray-400" /> From:</span> {trip.startLocation}</div>}
                                            <div><span className="text-white font-semibold flex items-center gap-2"><Plane size={16} className="text-gray-400" /> To:</span> {trip.destination}</div>
                                            <div><span className="text-white font-semibold flex items-center gap-2"><IndianRupee size={16} className="text-gray-400" /> Budget:</span> {trip.budget}</div>
                                            <div><span className="text-white font-semibold flex items-center gap-2"><Clock size={16} className="text-gray-400" /> Duration:</span> {trip.days} Days</div>
                                            {trip.travelers && <div><span className="text-white font-semibold flex items-center gap-2"><Users size={16} className="text-gray-400" /> Travelers:</span> {trip.travelers}</div>}
                                            {trip.transportMode && <div><span className="text-white font-semibold flex items-center gap-2"><Bus size={16} className="text-gray-400" /> Transport:</span> {trip.transportMode}</div>}
                                            <div className="md:col-span-3 mt-2 pt-2 border-t border-white/10 flex items-start gap-2"><Target size={16} className="text-gray-400 mt-1 shrink-0" /><span className="text-white font-semibold">Focus:</span> <span className="text-gray-300">{trip.interests}</span></div>
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
                                                {trip.itinerary}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyTrips;
