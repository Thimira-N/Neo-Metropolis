'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import AuthGuard from '@/app/login/authguard';

export default function AuthGuardWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname === '/login';

    if (isLoginPage) {
        // No layout on login page
        return <AuthGuard>{children}</AuthGuard>;
    }

    return (
        <AuthGuard>
            <div className="flex h-screen flex-col">
                <Header />
                <div className="flex flex-1 overflow-hidden">
                    <Sidebar />
                    <main className="flex-1 overflow-y-auto bg-background p-4 md:p-6">
                        {children}
                    </main>
                </div>
            </div>
        </AuthGuard>
    );
}
