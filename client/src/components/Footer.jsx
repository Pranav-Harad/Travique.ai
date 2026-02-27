import React from 'react';
import { Plane, Github, Mail } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-black border-t border-white/5 py-12 px-6 mt-auto">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                    <Plane className="w-6 h-6 text-white" />
                    <span className="text-xl font-display font-bold text-white tracking-wider">Travique.ai</span>
                </div>
                <div className="text-[#9CA3AF] text-sm">
                    &copy; {new Date().getFullYear()} Travique.ai. All rights reserved.
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
    );
}
