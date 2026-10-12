import { useEffect, useState } from 'react';

// Phones and small tablets in portrait. Keep in sync with resources/css/mobile.css.
export const MOBILE_QUERY = '(max-width: 760px)';

const matches = () => typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches;

// True on phone-sized screens; updates when the window is resized or the phone is rotated.
// Use it to render a separate mobile layout where CSS alone isn't enough.
export default function useIsMobile() {
    const [isMobile, setIsMobile] = useState(matches);

    useEffect(() => {
        const media = window.matchMedia(MOBILE_QUERY);
        const onChange = () => setIsMobile(media.matches);
        onChange();
        media.addEventListener('change', onChange);
        return () => media.removeEventListener('change', onChange);
    }, []);

    return isMobile;
}
