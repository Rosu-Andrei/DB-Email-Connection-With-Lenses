import React from 'react';
import { Event } from './events';

interface DisplayEventsProps {
    events: Event[];
}

export const DisplayEvents: React.FC<DisplayEventsProps> = ({ events }) => {
    return (
        <pre style={{backgroundColor: '#f0f0f0', padding: '10px'}}>
                 {events.map((event) => JSON.stringify(event)).join('\n')}
            </pre>
    );
};