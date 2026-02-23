'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
    const [lastPage, setLastPage] = useState<number | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem('lastReadPage');
        if (saved) setLastPage(parseInt(saved, 10));
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 bg-white">
            
            {/* Bismillah */}
            <p className="font-[family-name:--font-arabic] text-2xl text-primary/60 mb-8">
                بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
            </p>

            {/* App Title */}
            <h1 className="font-serif text-4xl font-bold text-primary tracking-tight mb-2">
                المصحف الرقمي
            </h1>
            <p className="font-serif text-lg text-gray-500 mb-12">
                Digital Al-Quran
            </p>

            {/* Decorative Line */}
            <div className="flex items-center gap-4 mb-12 w-full max-w-[280px]">
                <div className="flex-1 h-px bg-border-gold/40"></div>
                <span className="text-border-gold text-lg">✦</span>
                <div className="flex-1 h-px bg-border-gold/40"></div>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col items-center gap-4 w-full max-w-[300px]">
                
                {/* Continue Reading */}
                {lastPage && (
                    <Link
                        href={`/page/${lastPage}`}
                        className="w-full text-center py-4 px-6 bg-primary text-white font-serif text-lg rounded-xl shadow-md hover:bg-primary/90 active:scale-[0.98] transition-all"
                    >
                        Lanjut Halaman {lastPage}
                    </Link>
                )}

                {/* Start from Beginning */}
                <Link
                    href="/page/1"
                    className={`w-full text-center py-4 px-6 font-serif text-lg rounded-xl transition-all active:scale-[0.98] ${
                        lastPage 
                            ? 'border-2 border-primary/30 text-primary hover:bg-primary/5' 
                            : 'bg-primary text-white shadow-md hover:bg-primary/90'
                    }`}
                >
                    Mulai dari Awal
                </Link>

                {/* Go to specific page */}
                <Link
                    href="/page/1"
                    className="w-full text-center py-3 px-6 text-gray-500 font-serif hover:text-primary transition-colors"
                >
                    Baca Al-Quran →
                </Link>
            </div>

            {/* Footer */}
            <p className="absolute bottom-8 text-xs text-gray-400 font-serif">
                Mushaf Uthmani · 604 Halaman · 30 Juz
            </p>
        </div>
    );
}
