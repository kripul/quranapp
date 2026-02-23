'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toArabicNum } from '@/lib/utils';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

function SelectionModal({ isOpen, onClose, title, children }: ModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                    />
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 bg-paper-light rounded-t-3xl z-[101] max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border-t-2 border-border-gold/30"
                    >
                        <div className="flex items-center justify-between p-5 border-b border-border-gold/20 bg-white/50">
                            <h3 className="text-xl font-serif font-bold text-primary">{title}</h3>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={24} className="text-gray-500" />
                            </button>
                        </div>
                        <div className="overflow-y-auto p-5 custom-scrollbar flex-grow">
                            {children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default function NavModals({ 
    activeModal, 
    onClose, 
    surahs,
    juzStartPages, // Map of Juz -> Page
    onNavigate
}: { 
    activeModal: 'juz' | 'page' | 'surah' | null; 
    onClose: () => void;
    surahs: any[];
    juzStartPages: Record<number, number>;
    onNavigate: (newPageId: number) => void;
}) {

    const handleSelect = (pageId: number) => {
        onNavigate(pageId);
        onClose();
    };

    return (
        <>
            {/* Juz Modal */}
            <SelectionModal isOpen={activeModal === 'juz'} onClose={onClose} title="Pilih Juz">
                <div className="grid grid-cols-4 gap-3">
                    {Array.from({ length: 30 }, (_, i) => i + 1).map(juz => (
                        <button
                            key={juz}
                            onClick={() => handleSelect(juzStartPages[juz])}
                            className="bg-white border border-border-gold/30 p-3 rounded-lg text-center hover:bg-primary/10 transition-colors"
                        >
                            <div className="text-xs text-gray-500 font-serif">Juz</div>
                            <div className="text-lg font-bold text-primary">{toArabicNum(juz)}</div>
                        </button>
                    ))}
                </div>
            </SelectionModal>

            {/* Page Modal */}
            <SelectionModal isOpen={activeModal === 'page'} onClose={onClose} title="Pilih Halaman">
                <div className="grid grid-cols-5 gap-2">
                    {Array.from({ length: 604 }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            onClick={() => handleSelect(page)}
                            className="bg-white border border-border-gold/20 p-2 rounded-md text-center text-sm font-bold text-gray-700 hover:border-primary/50 hover:bg-paper-light transition-all"
                        >
                            {toArabicNum(page)}
                        </button>
                    ))}
                </div>
            </SelectionModal>

            {/* Surah Modal */}
            <SelectionModal isOpen={activeModal === 'surah'} onClose={onClose} title="Pilih Surah">
                <div className="flex flex-col gap-2">
                    {surahs.map((s) => (
                        <button
                            key={s.number}
                            onClick={() => handleSelect(s.startPage || 1)}
                            className="flex items-center justify-between p-4 bg-white border border-border-gold/20 rounded-xl hover:border-primary/50 transition-all text-right"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full border border-border-gold bg-paper-light flex items-center justify-center font-bold text-primary">
                                    {s.number}
                                </div>
                                <div className="text-left">
                                    <div className="font-bold text-gray-800">{s.englishName}</div>
                                    <div className="text-xs text-gray-500 uppercase">{s.revelationType}</div>
                                </div>
                            </div>
                            <div className="font-[family-name:--font-arabic] text-2xl text-primary">
                                {s.name.replace('سُورَةُ ', '')}
                            </div>
                        </button>
                    ))}
                </div>
            </SelectionModal>
        </>
    );
}
