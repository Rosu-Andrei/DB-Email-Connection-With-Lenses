import React from 'react';
import './App.css';
import {StateProvider} from "./context/state.provider";
import {AppContent} from "./App.content";
import {EventStoreProvider} from "./events/EventStore";
import {eventStoreUsingGithub} from "./events/github.event.store";

export type AppState = {
    connections: any[];
};

function App() {
    const initialState: AppState = { connections: [] };

    return (
        <EventStoreProvider eventStore={eventStoreUsingGithub}>
            <StateProvider initialState={initialState}>
                <AppContent />
            </StateProvider>
        </EventStoreProvider>
    );
}

export default App;
