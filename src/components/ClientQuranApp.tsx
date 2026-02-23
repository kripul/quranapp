'use client';

import { useState, useEffect } from 'react';
import QuranReader from '@/components/QuranReader';
import surahs from '../../surahs.json';
import pageBounds from '../../page_bounds.json';

export default function ClientQuranApp({ initialPageId }: { initialPageId: number }) {
    const [quranData, setQuranData] = useState<Record<string, any[]> | null>(null);
    const [pageId, setPageId] = useState(initialPageId);
    
    useEffect(() => {
        // Load the single 1.5MB QURAN data once. 
        // It is massively faster and works fully offline.
        fetch('/quran-data.json')
            .then(res => res.json())
            .then(data => setQuranData(data))
            .catch(err => console.error("Failed to load Quran data", err));
            
        // Sync URL manually to bypass Next.js router overhead
        const handlePopState = () => {
             const path = window.location.pathname;
             if (path.startsWith('/page/')) {
                 const id = parseInt(path.replace('/page/', ''), 10);
                 if (!isNaN(id) && id >= 1 && id <= 604) setPageId(id);
             }
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);
    
    // Also respond to the Next.js router if navigated backwards to initial page shell
    useEffect(() => {
        setPageId(initialPageId);
    }, [initialPageId]);
    
    if (!quranData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
                <div className="font-serif text-xl text-primary animate-pulse">يتم التحميل...</div>
            </div>
        );
    }
    
    const bound = pageBounds.find((p: any) => p.page === pageId);
    if (!bound) return null;
    
    const verses = quranData[pageId.toString()] || [];
    
    let mainSurahId = bound.startSurah;
    const ayahsOfStartSurah = verses.filter(r => r.sura === bound.startSurah).length;
    if (ayahsOfStartSurah <= 2 && bound.endSurah > bound.startSurah) {
        mainSurahId = bound.endSurah;
    }
    const currentSurah = surahs.find((s: any) => s.number === mainSurahId);
    
    const versesBySurah: Record<number, any[]> = {};
    verses.forEach(r => {
        if (!versesBySurah[r.sura]) versesBySurah[r.sura] = [];
        versesBySurah[r.sura].push(r);
    });
    
    const onNavigate = (newPageId: number) => {
        setPageId(newPageId);
        window.history.pushState(null, '', `/page/${newPageId}`);
        // Optionally save to localStorage here
        localStorage.setItem('lastReadPage', newPageId.toString());
    };

    return (
        <QuranReader 
            pageId={pageId} 
            surahs={surahs} 
            versesBySurah={versesBySurah} 
            currentSurah={currentSurah} 
            onNavigate={onNavigate}
        />
    );
}
