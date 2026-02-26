import { Link } from 'react-router-dom';
import { Plane } from 'lucide-react';
import {
    SignedIn,
    SignedOut,
    SignInButton,
    SignUpButton,
    UserButton,
} from "@clerk/clerk-react";

function Navbar() {
    return (
        <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                            <Plane className="w-8 h-8 text-white" />
                            <span className="text-2xl font-display font-bold text-white tracking-wider">Travique.ai</span>
                        </Link>
                    </div>
                    <div className="flex items-center">
                        <SignedIn>
                            <div className="flex items-center space-x-4">
                                <Link to="/create-trip" className="text-gray-300 hover:text-white px-3 py-2 rounded-md font-medium transition">New Trip</Link>
                                <Link to="/my-trips" className="text-gray-300 hover:text-white px-3 py-2 rounded-md font-medium transition">My Trips</Link>
                                <div className="ml-4">
                                    <UserButton />
                                </div>
                            </div>
                        </SignedIn>

                        <SignedOut>
                            <div className="flex items-center space-x-4">
                                <SignInButton mode="modal">
                                    <button className="text-gray-300 hover:text-white px-3 py-2 rounded-md font-medium transition">Log In</button>
                                </SignInButton>
                                <SignUpButton mode="modal">
                                    <button className="px-5 py-2 text-sm font-bold text-black bg-gradient-to-r from-gray-100 to-gray-400 hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] rounded-full transition-all transform hover:scale-105">Sign Up</button>
                                </SignUpButton>
                            </div>
                        </SignedOut>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
