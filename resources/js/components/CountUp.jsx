import React, { useEffect, useMemo, useRef, useState } from 'react';

// "3.5M+" -> { prefix: '', target: 3.5, decimals: 1, suffix: 'M+' }; null when there is no number to animate.
const parse = (value) => {
    const match = String(value).match(/^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/);
    if (!match) return null;
    const [, prefix, digits, suffix] = match;
    return {
        prefix,
        suffix,
        target: Number(digits.replace(/,/g, '')),
        decimals: (digits.split('.')[1] || '').length,
        grouped: digits.includes(','),
    };
};

const easeOutCubic = (t) => 1 - (1 - t) ** 3;

// Counts up to `value` each time it scrolls into view, and rewinds once it has fully left the
// screen so it plays again on the way back. Ranks ("#1") count down from #10 instead.
export default function CountUp({ value, duration = 1600, className }) {
    const parsed = useMemo(() => parse(value), [value]);
    const from = parsed?.prefix === '#' ? 10 : 0;
    const ref = useRef(null);
    const [current, setCurrent] = useState(from);

    useEffect(() => {
        const element = ref.current;
        if (!parsed || !element) return undefined;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setCurrent(parsed.target);
            return undefined;
        }

        let frame = 0;
        let armed = true;

        const play = () => {
            const began = performance.now();
            const tick = (now) => {
                const progress = Math.min((now - began) / duration, 1);
                setCurrent(from + (parsed.target - from) * easeOutCubic(progress));
                if (progress < 1) frame = requestAnimationFrame(tick);
            };
            frame = requestAnimationFrame(tick);
        };

        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) {
                cancelAnimationFrame(frame);
                armed = true;
                setCurrent(from);
            } else if (armed && entry.intersectionRatio >= 0.5) {
                armed = false;
                play();
            }
        }, { threshold: [0, 0.5] });

        observer.observe(element);
        return () => {
            observer.disconnect();
            cancelAnimationFrame(frame);
        };
    }, [parsed, from, duration]);

    if (!parsed) return <span className={className}>{value}</span>;

    const number = parsed.grouped
        ? current.toLocaleString('en-US', { minimumFractionDigits: parsed.decimals, maximumFractionDigits: parsed.decimals })
        : current.toFixed(parsed.decimals);

    return (
        <span ref={ref} className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
            <span aria-hidden="true">{parsed.prefix}{number}{parsed.suffix}</span>
            <span className="visually-hidden">{value}</span>
        </span>
    );
}
