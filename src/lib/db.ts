import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

export async function getVersesForPage(startSurah: number, startAyah: number, endSurah: number, endAyah: number) {
    return new Promise<any[]>((resolve, reject) => {
        const dbPath = path.join(process.cwd(), 'quran-uthmani.db');
        const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
            if (err) return reject(err);
        });

        const query = `
            SELECT sura, aya, text 
            FROM quran_text 
            WHERE 
                (sura > ? OR (sura = ? AND aya >= ?)) AND
                (sura < ? OR (sura = ? AND aya <= ?))
            ORDER BY sura ASC, aya ASC
        `;

        db.all(query, [startSurah, startSurah, startAyah, endSurah, endSurah, endAyah], (err, rows) => {
            db.close();
            if (err) reject(err);
            else resolve(rows as any[]);
        });
    });
}

export function getSurahs() {
    const data = fs.readFileSync(path.join(process.cwd(), 'surahs.json'), 'utf-8');
    return JSON.parse(data);
}

export function getPageBounds() {
    const data = fs.readFileSync(path.join(process.cwd(), 'page_bounds.json'), 'utf-8');
    return JSON.parse(data);
}
