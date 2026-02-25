import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Plane, FolderOpen } from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';

function Dashboard() {
    const { user } = useUser();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-black text-[#F3F4F6] p-8 selection:bg-white selection:text-black relative overflow-hidden">
            <ParticleBackground />
            <div className="max-w-4xl mx-auto bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl p-8 relative z-10 mt-10">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-4xl font-display font-bold text-white tracking-wide">Welcome, {user?.firstName}!</h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div
                        onClick={() => navigate('/create-trip')}
                        className="group p-8 bg-black rounded-xl border border-white/10 cursor-pointer hover:border-white/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all duration-300 flex flex-col items-center justify-center text-center h-56 transform hover:-translate-y-1"
                    >
                        <Plane className="w-12 h-12 mb-6 text-gray-300 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                        <h2 className="text-2xl font-display font-semibold text-white">Create New Trip</h2>
                        <p className="text-gray-400 mt-3 font-light">Plan your next adventure with our AI</p>
                    </div>
                    <div
                        onClick={() => navigate('/my-trips')}
                        className="group p-8 bg-black rounded-xl border border-white/10 cursor-pointer hover:border-white/30 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] transition-all duration-300 flex flex-col items-center justify-center text-center h-56 transform hover:-translate-y-1"
                    >
                        <FolderOpen className="w-12 h-12 mb-6 text-gray-300 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                        <h2 className="text-2xl font-display font-semibold text-white">View My Trips</h2>
                        <p className="text-gray-400 mt-3 font-light">See your past travel plans offline</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
