import React from 'react';
import { notFound } from 'next/navigation';
import ClientQuranApp from '@/components/ClientQuranApp';

export async function generateStaticParams() {
    return Array.from({ length: 604 }, (_, i) => ({ id: (i + 1).toString() }));
}

export default async function QuranPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const pageId = parseInt(params.id, 10);
    
    if (isNaN(pageId) || pageId < 1 || pageId > 604) {
        notFound();
    }

    return (
        <ClientQuranApp initialPageId={pageId} />
    );
}
