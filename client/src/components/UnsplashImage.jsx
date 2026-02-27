import { useState, useEffect } from 'react';

export default function UnsplashImage({ query }) {
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImage = async () => {
            if (!query) return;
            try {
                // Determine search orientation based on typical layouts
                const orientation = 'landscape';
                const res = await fetch(`https://api.unsplash.com/search/photos?page=1&query=${encodeURIComponent(query)}&orientation=${orientation}&client_id=${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}`);
                const data = await res.json();

                if (data.results && data.results.length > 0) {
                    setImageUrl(data.results[0].urls.regular);
                } else {
                    setImageUrl('placeholder'); // Fallback handled below
                }
            } catch (error) {
                console.error("Unsplash fetch error:", error);
                setImageUrl('placeholder');
            } finally {
                setLoading(false);
            }
        };

        fetchImage();
    }, [query]);

    if (loading) {
        return <div className="w-full h-48 bg-zinc-800 animate-pulse rounded-xl my-6 border border-white/5"></div>;
    }

    if (imageUrl === 'placeholder' || !imageUrl) {
        return null; // Don't render broken images if API fails or rate limits
    }

    return (
        <div className="my-6 overflow-hidden rounded-xl border border-white/10 shadow-lg bg-zinc-900 group relative">
            <img
                src={imageUrl}
                alt={query}
                crossOrigin="anonymous"
                className="w-full h-auto object-cover max-h-80 transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
            />
            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] text-white/70 opacity-0 group-hover:opacity-100 transition-opacity">
                Photo via Unsplash
            </div>
        </div>
    );
}
