'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        setIsLoggedIn(loggedIn);

        if (!loggedIn && pathname !== '/login') {
            router.push('/login');
        }

        if (loggedIn && pathname === '/login') {
            router.push('/');
        }
    }, [pathname, router]);

    if (isLoggedIn === null) return null; // or show a loading spinner

    // Only show children if logged in or currently on /login page
    if (!isLoggedIn && pathname !== '/login') return null;

    return <>{children}</>;
}
