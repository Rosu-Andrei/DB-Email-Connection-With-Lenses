import React, { useState } from 'react';
import './App.css';
import { DatabaseType, DatabaseTypeProvider, isDatabase, databases } from "./render/dbType/dbType";
import { DbFormWithArray } from "./component/DbConnectionForm2";
import { EmailType, EmailTypeProvider, isEmailType, emailTypes } from "./render/dbType/emailType";
import { EmailFormWithArray } from "./component/EmailConnectionForm";

function App() {
    const [connectionType, setConnectionType] = useState<'db' | 'email'>('db');
    const [providerType, setProviderType] = useState<string>('');

    const handleConnectionTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setConnectionType(e.target.value as 'db' | 'email');
        setProviderType(''); // Reset provider type when connection type changes
    };

    const handleProviderTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setProviderType(e.target.value);
    };

    return (
        <div className="App">
            <select value={connectionType} onChange={handleConnectionTypeChange}>
                <option value="db">Database Connection</option>
                <option value="email">Email Connection</option>
            </select>

            {connectionType === 'db' && (
                <div>
                    <select value={providerType} onChange={handleProviderTypeChange}>
                        <option value="">Select Database Type</option>
                        {databases.map((db) => (
                            <option key={db} value={db}>{db}</option>
                        ))}
                    </select>
                    {providerType && isDatabase(providerType) && (
                        <DatabaseTypeProvider databaseType={providerType as DatabaseType}>
                            <DbFormWithArray />
                        </DatabaseTypeProvider>
                    )}
                </div>
            )}

            {connectionType === 'email' && (
                <div>
                    <select value={providerType} onChange={handleProviderTypeChange}>
                        <option value="">Select Email Provider</option>
                        {emailTypes.map((email) => (
                            <option key={email} value={email}>{email}</option>
                        ))}
                    </select>
                    {providerType && isEmailType(providerType) && (
                        <EmailTypeProvider emailType={providerType as EmailType}>
                            <EmailFormWithArray />
                        </EmailTypeProvider>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;
