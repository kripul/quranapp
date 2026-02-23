import React from 'react';
import { getVersesForPage, getSurahs, getPageBounds } from '@/lib/db';
import QuranReader from '@/components/QuranReader';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
    return Array.from({ length: 604 }, (_, i) => ({ id: (i + 1).toString() }));
}

export default async function QuranPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const pageId = parseInt(params.id, 10);
    
    if (isNaN(pageId) || pageId < 1 || pageId > 604) {
        notFound();
    }

    const surahs = getSurahs();
    const pageBounds = getPageBounds();
    const bound = pageBounds.find((p: any) => p.page === pageId);

    const verses = await getVersesForPage(bound.startSurah, bound.startAyah, bound.endSurah, bound.endAyah, pageId);

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

    return (
        <QuranReader 
            pageId={pageId} 
            surahs={surahs} 
            versesBySurah={versesBySurah} 
            currentSurah={currentSurah} 
        />
    );
}
