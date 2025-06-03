import { useEffect, useRef, useState, useCallback } from "react";

export const useActiveIndicator = () => {
    const containerRef = useRef(null);
    const [activeStyle, setActiveStyle] = useState({ 
        left: 0, 
        width: 0, 
        opacity: 0 
    });

    const updateIndicator = useCallback((index) => {
        const container = containerRef.current;
        if (!container) return;

        // Use requestAnimationFrame for smoother animations
        requestAnimationFrame(() => {
            const items = container.querySelectorAll(".search-bar-option");
            if (index >= items.length) return;

            items.forEach((item) => {
                const initial = item.querySelector('.search-hover.initial');
                const active = item.querySelector('.search-hover.active');
                
                if (initial && active) {
                    initial.classList.add('hidden');
                    active.classList.remove('hidden');
                }
            });

            const target = items[index];
            if (target) {
                const { offsetLeft, offsetWidth } = target;
                setActiveStyle({ 
                    left: offsetLeft, 
                    width: offsetWidth, 
                    opacity: 100 
                });
            }
        });
    }, []);

    const resetActiveBG = useCallback(() => {
        setActiveStyle(prev => ({ ...prev, opacity: 0 }));
        
        const container = containerRef.current;
        if (!container) return;

        requestAnimationFrame(() => {
            const items = container.querySelectorAll(".search-bar-option");
            items.forEach((item) => {
                const initial = item.querySelector('.search-hover.initial');
                const active = item.querySelector('.search-hover.active');
                
                if (initial && active) {
                    initial.classList.remove('hidden');
                    active.classList.add('hidden');
                }
            });
        });
    }, []);

    return { 
        containerRef, 
        activeStyle, 
        updateIndicator, 
        resetActiveBG 
    };
};