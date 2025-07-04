import React, { useState, useEffect, useRef } from 'react';
import type { Post } from '../types';

// Helper hook untuk memberikan jeda sebelum melakukan pencarian
function useDebounce(value: string, delay: number) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
        return () => { clearTimeout(handler); };
    }, [value, delay]);
    return debouncedValue;
}

export default function Search() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    
    // State untuk visibilitas
    const [isDesktopFormFocused, setIsDesktopFormFocused] = useState(false);
    const [isMobileOverlayVisible, setIsMobileOverlayVisible] = useState(false);

    // Refs untuk elemen DOM
    const searchContainerRef = useRef<HTMLDivElement>(null);
    const mobileSearchInputRef = useRef<HTMLInputElement>(null);
    const debouncedQuery = useDebounce(query, 300);

    // Fungsi untuk submit pencarian dan navigasi ke halaman /search
    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim().length > 0) {
            window.location.href = `/search?q=${encodeURIComponent(query)}`;
        }
    };

    // Efek untuk mengambil hasil pencarian (live search)
    useEffect(() => {
        if (debouncedQuery.length > 2) {
            setIsLoading(true);
            const fetchResults = async () => {
                const params = new URLSearchParams({ 
                    search: debouncedQuery, 
                    fields: 'title,slug,category.name', 
                    limit: '5' 
                });
                try {
                    const response = await fetch(`${import.meta.env.PUBLIC_DIRECTUS_URL}/items/posts?${params}`);
                    const data = await response.json();
                    setResults(data.data || []);
                } catch (error) {
                    console.error("Gagal mengambil hasil pencarian:", error);
                    setResults([]);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchResults();
        } else {
            setResults([]);
        }
    }, [debouncedQuery]);

    // Efek untuk mengelola state popup mobile
    useEffect(() => {
        if (isMobileOverlayVisible) {
            document.body.style.overflow = 'hidden'; // Mencegah scroll di belakang popup
            setTimeout(() => mobileSearchInputRef.current?.focus(), 150);
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isMobileOverlayVisible]);

    // Efek untuk menutup dropdown desktop saat klik di luar
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setIsDesktopFormFocused(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [searchContainerRef]);

    // Fungsi untuk membuka popup mobile
    const openMobileSearch = () => {
        setQuery('');
        setResults([]);
        setIsLoading(false);
        setIsMobileOverlayVisible(true);
    };
    
    // Fungsi untuk menutup popup mobile
    const closeMobileSearch = () => {
        setIsMobileOverlayVisible(false);
    };

    return (
        <div ref={searchContainerRef} className="flex items-center">

            {/* ====================================================== */}
            {/* ============ FORM UNTUK DESKTOP ====================== */}
            {/* ====================================================== */}
            <form onSubmit={handleSearchSubmit} className="hidden md:block relative w-96">
                <div className="relative">
                    <input 
                        type="text" 
                        value={query} 
                        onChange={(e) => setQuery(e.target.value)} 
                        onFocus={() => setIsDesktopFormFocused(true)} 
                        placeholder="Cari artikel..."
                        className="w-full pl-10 pr-4 py-2 text-sm font-sans border border-[var(--color-border)] dark:border-[var(--color-dark-border)] rounded-full bg-[var(--color-card)] dark:bg-[var(--color-dark-card)] focus:ring-2 focus:ring-[var(--color-primary)] dark:focus:ring-[var(--color-dark-primary)] outline-none transition" 
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-secondary)] dark:text-[var(--color-dark-secondary)] pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
                    </div>
                    {isLoading && <div className="absolute right-3 top-1/2 -translate-y-1/2"><svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg></div>}
                </div>
                {isDesktopFormFocused && results.length > 0 && (
                    <div className="absolute top-full mt-2 w-full bg-[var(--color-card)] dark:bg-[var(--color-dark-card)] border border-[var(--color-border)] dark:border-[var(--color-dark-border)] rounded-xl shadow-lg z-50 p-2 space-y-1">
                        {results.map(post => (
                            <a key={post.slug} href={`/${post.category.slug}/${post.slug}`} className="block p-3 rounded-lg hover:bg-[var(--color-border)] dark:hover:bg-[var(--color-dark-border)]">
                                <p className="font-semibold text-[var(--color-text)] dark:text-[var(--color-dark-text)]">{post.title}</p>
                                <p className="text-sm text-[var(--color-secondary)] dark:text-[var(--color-dark-secondary)]">{post.category.name}</p>
                            </a>
                        ))}
                    </div>
                )}
            </form>

            {/* ==================================================== */}
            {/* ============ TOMBOL UNTUK MOBILE =================== */}
            {/* ==================================================== */}
            <div className="md:hidden">
                <button onClick={openMobileSearch} className="p-2 rounded-full text-[var(--color-secondary)] dark:text-[var(--color-dark-secondary)] hover:bg-[var(--color-border)] dark:hover:bg-[var(--color-dark-border)] transition-colors" aria-label="Buka Pencarian">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
                </button>
            </div>

            {/* ==================================================== */}
            {/* ======= POPUP PENCARIAN MOBILE (FULL-SCREEN) ======== */}
            {/* ==================================================== */}
            {isMobileOverlayVisible && (
                <div className="fixed inset-0 z-50 flex flex-col bg-[var(--color-background)] dark:bg-[var(--color-dark-background)] animate-slide-up">
                    {/* Header Popup */}
                    <form onSubmit={handleSearchSubmit} className="sticky top-0 bg-[var(--color-background)] dark:bg-[var(--color-dark-background)] shadow-md flex items-center justify-between px-4 py-3">
                        <div className="relative flex-grow">
                            <input
                                ref={mobileSearchInputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Ketik untuk mencari artikel..."
                                className="w-full p-3 bg-transparent text-lg text-[var(--color-text)] dark:text-[var(--color-dark-text)] outline-none placeholder:text-[var(--color-secondary)] dark:placeholder:text-[var(--color-dark-secondary)]"
                            />
                            {isLoading && (
                                <div className="absolute right-0 top-1/2 -translate-y-1/2">
                                    <svg className="animate-spin h-6 w-6 text-[var(--color-primary)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                    </svg>
                                </div>
                            )}
                        </div>
                        <button type="button" onClick={closeMobileSearch} className="ml-4 flex-none p-2 rounded-full text-[var(--color-secondary)] dark:text-[var(--color-dark-secondary)] hover:bg-[var(--color-border)] dark:hover:bg-[var(--color-dark-border)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" aria-label="Tutup Pencarian">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </form>

                    {/* Konten Hasil Pencarian */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {results.length > 0 && (
                            <ul className="space-y-2">
                                {results.map(post => (
                                    <li key={post.slug}>
                                        <a href={`/${post.category.slug}/${post.slug}`} onClick={closeMobileSearch} className="block p-4 rounded-lg hover:bg-[var(--color-border)] dark:hover:bg-[var(--color-dark-border)] transition-colors">
                                            <p className="font-semibold text-[var(--color-text)] dark:text-[var(--color-dark-text)]">{post.title}</p>
                                            <p className="text-sm text-[var(--color-secondary)] dark:text-[var(--color-dark-secondary)]">{post.category.name}</p>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                        {!isLoading && results.length === 0 && query.length > 2 && (
                            <p className="text-center text-[var(--color-secondary)] dark:text-[var(--color-dark-secondary)] py-10">
                                Tidak ada hasil ditemukan untuk "{query}".
                            </p>
                        )}
                        {!isLoading && query.length <= 2 && (
                             <p className="text-center text-[var(--color-secondary)] dark:text-[var(--color-dark-secondary)] py-10">
                                Ketik lebih dari 2 huruf untuk memulai pencarian.
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}