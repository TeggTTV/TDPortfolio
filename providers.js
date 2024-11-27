'use client';
import { ThemeProvider } from 'next-themes';
import { useEffect, useState } from 'react';

const Providers = ({ children }) => {
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true);
    }, []);
    
    return mounted ? <ThemeProvider>{children}</ThemeProvider> : null;
};

export default Providers;
