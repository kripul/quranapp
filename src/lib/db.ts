import fs from 'fs';
import path from 'path';

// At build time, load the pre-extracted JSON data
let quranData: Record<string, any[]> | null = null;

function loadQuranData(): Record<string, any[]> {
    if (quranData) return quranData;
    const dataPath = path.join(process.cwd(), 'public', 'quran-data.json');
    quranData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    return quranData!;
}

export async function getVersesForPage(startSurah: number, startAyah: number, endSurah: number, endAyah: number, pageId?: number) {
    // If pageId is provided, use the pre-extracted data directly
    if (pageId) {
        const data = loadQuranData();
        return data[pageId.toString()] || [];
    }
    
    // Fallback: filter from bounds (shouldn't be needed)
    const data = loadQuranData();
    for (const [, verses] of Object.entries(data)) {
        if (verses.length > 0 && 
            verses[0].sura === startSurah && 
            verses[0].aya === startAyah) {
            return verses;
        }
    }
    return [];
}

export function getSurahs() {
    const data = fs.readFileSync(path.join(process.cwd(), 'surahs.json'), 'utf-8');
    return JSON.parse(data);
}

export function getPageBounds() {
    const data = fs.readFileSync(path.join(process.cwd(), 'page_bounds.json'), 'utf-8');
    return JSON.parse(data);
}
