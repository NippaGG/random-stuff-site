"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "random-stuff-favorites";

export function useFavorites() {
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load favorites from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setFavorites(JSON.parse(stored));
            }
        } catch (error) {
            console.error("Failed to load favorites:", error);
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage whenever favorites change
    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
            } catch (error) {
                console.error("Failed to save favorites:", error);
            }
        }
    }, [favorites, isLoaded]);

    const addFavorite = useCallback((id: string) => {
        setFavorites((prev) => {
            if (prev.includes(id)) return prev;
            return [...prev, id];
        });
    }, []);

    const removeFavorite = useCallback((id: string) => {
        setFavorites((prev) => prev.filter((fav) => fav !== id));
    }, []);

    const removeFavorites = useCallback((ids: string[]) => {
        setFavorites((prev) => prev.filter((fav) => !ids.includes(fav)));
    }, []);

    const toggleFavorite = useCallback((id: string) => {
        setFavorites((prev) => {
            if (prev.includes(id)) {
                return prev.filter((fav) => fav !== id);
            }
            return [...prev, id];
        });
    }, []);

    const isFavorite = useCallback(
        (id: string) => favorites.includes(id),
        [favorites]
    );

    const clearFavorites = useCallback(() => {
        setFavorites([]);
    }, []);

    return {
        favorites,
        isLoaded,
        addFavorite,
        removeFavorite,
        removeFavorites,
        toggleFavorite,
        clearFavorites,
        isFavorite,
    };
}
