export function getJuzNumber(page: number): number {
    if (page >= 1 && page <= 21) return 1;
    if (page >= 22 && page <= 41) return 2;
    if (page >= 42 && page <= 61) return 3;
    if (page >= 62 && page <= 81) return 4;
    if (page >= 82 && page <= 101) return 5;
    if (page >= 102 && page <= 121) return 6;
    if (page >= 122 && page <= 141) return 7;
    if (page >= 142 && page <= 161) return 8;
    if (page >= 162 && page <= 181) return 9;
    if (page >= 182 && page <= 201) return 10;
    if (page >= 202 && page <= 221) return 11;
    if (page >= 222 && page <= 241) return 12;
    if (page >= 242 && page <= 261) return 13;
    if (page >= 262 && page <= 281) return 14;
    if (page >= 282 && page <= 301) return 15;
    if (page >= 302 && page <= 321) return 16;
    if (page >= 322 && page <= 341) return 17;
    if (page >= 342 && page <= 361) return 18;
    if (page >= 362 && page <= 381) return 19;
    if (page >= 382 && page <= 401) return 20;
    if (page >= 402 && page <= 421) return 21;
    if (page >= 422 && page <= 441) return 22;
    if (page >= 442 && page <= 461) return 23;
    if (page >= 462 && page <= 481) return 24;
    if (page >= 482 && page <= 501) return 25;
    if (page >= 502 && page <= 521) return 26;
    if (page >= 522 && page <= 541) return 27;
    if (page >= 542 && page <= 561) return 28;
    if (page >= 562 && page <= 581) return 29;
    if (page >= 582 && page <= 604) return 30;
    return 1;
}

export function toArabicNum(num: number): string {
    const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return num.toString().split('').map(char => arabicNumbers[parseInt(char)]).join('');
}
