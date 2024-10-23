import React from 'react';
import './App.css';
import {StateProvider} from "./context/state.provider";
import {AppContent} from "./App.content";

export type AppState = {
    connections: any[];
};

function App() {
    const initialState: AppState = { connections: [] };

    return (
        <StateProvider initialState={initialState}>
            <AppContent />
        </StateProvider>
    );
}

export default App;
