import React from 'react';
import AppLayout from './AppLayout';
import PageWrapper from '@/Components/Layout/PageWrapper';

export default function AdminLayout({ children, title, subtitle, actions }) {
    return (
        <AppLayout>
            <PageWrapper title={title} subtitle={subtitle} actions={actions}>
                {children}
            </PageWrapper>
        </AppLayout>
    );
}
