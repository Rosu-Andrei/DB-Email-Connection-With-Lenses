import React from 'react';
import './App.css';
import {DatabaseType, DatabaseTypeProvider, isDatabase} from "./render/dbType/dbType";
import {DatabaseConnectionForm} from "./component/DatabaseConnectionForm";

const dbType = window.location.search.split('=')[1] as DatabaseType;
if (dbType && !isDatabase(dbType))
    throw new Error('Failed to get the database type from the url');

function App() {
    return (
        <div className="App">
            <DatabaseTypeProvider databaseType={dbType}>
                <DatabaseConnectionForm/>
            </DatabaseTypeProvider>

        </div>
    );
}

export default App;
