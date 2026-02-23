/**
 * Pre-extract all 604 pages of Quran data from SQLite into a single JSON file.
 * This allows the app to work as a fully static export (no server needed).
 * 
 * Usage: node scripts/extract-quran-data.js
 */

const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'quran-uthmani.db');
const PAGE_BOUNDS_PATH = path.join(__dirname, '..', 'page_bounds.json');
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'quran-data.json');

function getVersesForPage(db, startSurah, startAyah, endSurah, endAyah) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT sura, aya, text 
            FROM quran_text 
            WHERE 
                (sura > ? OR (sura = ? AND aya >= ?)) AND
                (sura < ? OR (sura = ? AND aya <= ?))
            ORDER BY sura ASC, aya ASC
        `;
        db.all(query, [startSurah, startSurah, startAyah, endSurah, endSurah, endAyah], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

async function main() {
    console.log('📖 Extracting Quran data from SQLite...');
    
    const pageBounds = JSON.parse(fs.readFileSync(PAGE_BOUNDS_PATH, 'utf-8'));
    const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY);
    
    const quranData = {};
    
    for (const bound of pageBounds) {
        const verses = await getVersesForPage(db, bound.startSurah, bound.startAyah, bound.endSurah, bound.endAyah);
        quranData[bound.page] = verses;
        
        if (bound.page % 100 === 0) {
            console.log(`  ✓ Extracted page ${bound.page}/604`);
        }
    }
    
    db.close();
    
    // Write compact JSON (no pretty-print to save space)
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(quranData));
    
    const sizeMB = (fs.statSync(OUTPUT_PATH).size / (1024 * 1024)).toFixed(2);
    console.log(`✅ Done! Wrote ${OUTPUT_PATH} (${sizeMB} MB)`);
    console.log(`   Contains data for ${Object.keys(quranData).length} pages`);
}

main().catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
});
