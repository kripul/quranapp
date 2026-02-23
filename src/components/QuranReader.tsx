'use client';

import React, { useState } from 'react';
import { getJuzNumber, toArabicNum } from '@/lib/utils';
import SwipeWrapper from '@/components/SwipeWrapper';
import NavModals from '@/components/NavModals';

interface QuranReaderProps {
    pageId: number;
    surahs: any[];
    versesBySurah: Record<number, any[]>;
    currentSurah: any;
}

const JUZ_START_PAGES: Record<number, number> = {
    1: 1, 2: 22, 3: 42, 4: 62, 5: 82, 6: 102, 7: 122, 8: 142, 9: 162, 10: 182,
    11: 202, 12: 222, 13: 242, 14: 262, 15: 282, 16: 302, 17: 322, 18: 342, 19: 362, 20: 382,
    21: 402, 22: 422, 23: 442, 24: 462, 25: 482, 26: 502, 27: 522, 28: 542, 29: 562, 30: 582
};

const BISMILLAH_PREFIX = "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ";

export default function QuranReader({ pageId, surahs, versesBySurah, currentSurah }: QuranReaderProps) {
    const [activeModal, setActiveModal] = useState<'juz' | 'page' | 'surah' | null>(null);

    return (
        <div className="flex flex-col h-screen bg-white">
            {/* Top Bar - Mobile App Style */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#f2f2f2] border-b border-gray-300 shadow-sm z-[60] shrink-0 no-select">
                <button 
                    onClick={() => setActiveModal('juz')}
                    className="text-sm font-serif text-gray-700 hover:text-primary transition-colors cursor-pointer"
                >
                   الجزء {toArabicNum(getJuzNumber(pageId))}
                </button>
                <button 
                    onClick={() => setActiveModal('page')}
                    className="text-lg font-serif font-bold text-gray-800 hover:text-primary transition-colors cursor-pointer"
                >
                   {toArabicNum(pageId)}
                </button>
                <button 
                    onClick={() => setActiveModal('surah')}
                    className="text-sm font-serif text-gray-700 hover:text-primary transition-colors cursor-pointer"
                >
                   {currentSurah.name.replace('سُورَةُ ', '')}
                </button>
            </div>

            {/* Gesture-based Content Layer */}
            <main className="flex-grow relative z-10 w-full overflow-hidden">
                <SwipeWrapper currentPage={pageId}>
                    {/* Inner Content Shadowing a Page */}
                    <div className="w-full max-w-[600px] mx-auto min-h-full pb-10">
                        <div className="flex flex-col items-center justify-start quran-text-container p-4">
                            {Object.keys(versesBySurah).map((suraIdStr) => {
                                const suraId = parseInt(suraIdStr, 10);
                                const sMeta = surahs.find((s: any) => s.number === suraId);
                                const sVerses = versesBySurah[suraId];
                                const hasFirstAyah = sVerses.some(v => v.aya === 1);
                                
                                return (
                                    <React.Fragment key={suraId}>
                                        {(hasFirstAyah || (suraId === sVerses[0].sura && sVerses[0].aya === 1)) && (
                                            <>
                                                {/* Fancy Surah Header */}
                                                <div className="w-full max-w-[400px] h-[50px] my-6 flex items-center justify-center surah-header-mobile rounded-sm shadow-md overflow-hidden">
                                                   <span className="text-xl font-bold text-gray-800 pt-1 tracking-tight">{sMeta.name}</span>
                                                </div>
                                                
                                                {suraId !== 1 && suraId !== 9 && (
                                                    <div className="bismillah-text">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</div>
                                                )}
                                            </>
                                        )}
                                        <div className="w-full px-2 text-[26px] sm:text-[28px] md:text-[32px] text-gray-900 leading-[2.1]">
                                            {sVerses.map(verse => {
                                                let filteredText = verse.text;
                                                if (verse.aya === 1 && verse.sura !== 1 && filteredText.startsWith(BISMILLAH_PREFIX)) {
                                                    filteredText = filteredText.replace(BISMILLAH_PREFIX, "").trim();
                                                }
                                                return (
                                                    <React.Fragment key={verse.aya}>
                                                        {filteredText} <span className="verse-number">{toArabicNum(verse.aya)}</span>
                                                    </React.Fragment>
                                                );
                                            })}
                                        </div>
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>
                </SwipeWrapper>
            </main>

            {/* Navigation Modals */}
            <NavModals 
                activeModal={activeModal} 
                onClose={() => setActiveModal(null)} 
                surahs={surahs}
                juzStartPages={JUZ_START_PAGES}
            />
        </div>
    );
}
