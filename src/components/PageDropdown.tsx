'use client';
import { useRouter } from 'next/navigation';

export default function PageDropdown({ currentPage }: { currentPage: number }) {
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        router.push(`/page/${e.target.value}`);
    };

    return (
        <div className="relative inline-block">
            <select 
                value={currentPage}
                onChange={handleChange}
                className="appearance-none w-20 text-center bg-white border-2 border-border-gold/50 text-primary font-serif font-bold py-1 px-2 rounded-md shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-border-gold transition-all cursor-pointer hover:bg-paper-light outline-none"
            >
                {Array.from({ length: 604 }, (_, i) => i + 1).map(i => (
                    <option key={i} value={i} className="bg-white text-primary font-sans">
                        {i}
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-border-gold">
                <span className="material-symbols-outlined text-xs">arrow_drop_down</span>
            </div>
        </div>
    );
}
