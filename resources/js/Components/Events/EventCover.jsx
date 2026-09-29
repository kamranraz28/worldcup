import { useState } from 'react';

export const EVENT_TYPE_LABELS = {
    live_screening: 'Live Screening',
    viewing_party: 'Viewing Party',
    meet_greet: 'Meet & Greet',
    fan_zone: 'Fan Zone',
    workshop: 'Workshop',
    other: 'Other',
    live: 'Live',
    virtual: 'Virtual',
    hybrid: 'Hybrid',
};

/**
 * Themed fallback artwork, keyed by event type with a title-keyword fallback.
 * Keeps browse/home/detail cards visually consistent even when an event
 * has no uploaded banner.
 */
const TYPE_COVERS = {
    live_screening: 'big-screen',
    viewing_party: 'big-screen',
    meet_greet: 'audience',
    fan_zone: 'fan-zone',
    workshop: 'workshop',
    other: 'stadium-night',
    live: 'stadium-night',
    virtual: 'virtual',
    hybrid: 'workshop',
};

const KEYWORD_COVERS = [
    [/trophy|champion|final|cup\b/i, 'trophy'],
    [/gala|networking|banquet|dinner|awards/i, 'gala'],
    [/screening|watch\s*party|screen|stream|big\s*screen/i, 'big-screen'],
    [/fan\s*(zone|park)|expo|street/i, 'fan-zone'],
    [/meet|greets?|legends?|autograph|fan\s*meet/i, 'audience'],
    [/workshop|masterclass|analytics|summit|conference|tech/i, 'workshop'],
    [/virtual|online|digital|remote/i, 'virtual'],
];

const DEFAULT_COVERS = ['stadium-night', 'audience', 'fan-zone', 'big-screen'];

function hashString(value = '') {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
        hash = (hash << 5) - hash + value.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

export function coverForEvent(event) {
    if (!event) return DEFAULT_COVERS[0];

    const title = event.title || '';
    const typeCover = TYPE_COVERS[event.event_type];
    if (typeCover) return typeCover;

    for (const [pattern, cover] of KEYWORD_COVERS) {
        if (pattern.test(title)) return cover;
    }

    return DEFAULT_COVERS[hashString(event.uuid || title) % DEFAULT_COVERS.length];
}

export function coverUrl(event) {
    return appUrl(`/images/events/${coverForEvent(event)}.svg`);
}

export function eventTypeLabel(type) {
    return EVENT_TYPE_LABELS[type] || type;
}

/**
 * Renders an event's uploaded banner when present, otherwise themed
 * artwork. Falls back gracefully if the file fails to load.
 */
export default function EventCover({ event, alt, className = '', imgClassName = '' }) {
    const [failed, setFailed] = useState(false);
    const banner = !failed && event?.banner_image
        ? appUrl(`/storage/${event.banner_image}`)
        : coverUrl(event);

    return (
        <img
            src={banner}
            alt={alt ?? event?.title ?? 'Event'}
            loading="lazy"
            onError={() => setFailed(true)}
            className={`w-full h-full object-cover ${className} ${imgClassName}`}
            data-testid="event-cover"
            data-cover={coverForEvent(event)}
        />
    );
}
