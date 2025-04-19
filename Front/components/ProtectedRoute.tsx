'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation'; 
import { useEffect, useState } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { state } = useAuth(); 
    const router = useRouter();
    const pathname = usePathname();
    const [isLoading, setIsLoading] = useState(true); 
    useEffect(() => {
        const checkAuth = async () => {
            if (!state.user) {
                router.push('/user/signin');
            } else {
                setIsLoading(false); 
            }
        };

        checkAuth(); 

    }, [state.user, router, pathname]); 

    if (isLoading) {
        return <p>Loading...</p>; 
    }

    return <>{children}</>; 
}
