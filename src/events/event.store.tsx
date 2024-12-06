import React from 'react';
import { Event } from './events';

export interface EventStoreInterface {
    getEvents<T = Event[]>(
        offset?: number,
        interpreter?: string
    ): Promise<{ events: T; offset: number; sha: string | null }>;

    saveEvents: (events: Event[], sha: string | null) => Promise<void>;
}

const EventStoreContext = React.createContext<EventStoreInterface | undefined>(undefined);

export type EventStoreProviderProps = {
    eventStore: EventStoreInterface;
    children: React.ReactNode;
};

export function EventStoreProvider({ eventStore, children }: EventStoreProviderProps) {
    return <EventStoreContext.Provider value={eventStore}>{children}</EventStoreContext.Provider>;
}

export function useEventStore() {
    const context = React.useContext(EventStoreContext);
    if (context === undefined) {
        throw new Error('useEventStore must be used within an EventStoreProvider');
    }
    return context;
}
