import React, {useEffect, useState} from 'react';
import './App.css';
import {DatabaseType, DatabaseTypeProvider} from "./render/dbType/dbType";
import {EmailType, EmailTypeProvider} from "./render/dbType/emailType";
import {DbFormWithArray} from "./component/DbFormWithArray";
import {EmailFormWithArray} from "./component/EmailConnectionForm";
import {allDef, emailDef} from "./utils/db.component.prop";
import {useConnectionType} from "./hooks/use.connection";


function App() {

    // State to manage connection type ('db' or 'email') and provider type
    const [connectionType, setConnectionType] = useState<'db' | 'email'>('db');

    // Use the generic hook for managing the provider type and dynamic properties (the array of definitions for the lens)
    const {selectedType, dynamicProps, handleTypeChange, setSelectedType, setDynamicProps} = useConnectionType(
        connectionType === 'db' ? allDef : emailDef
    );

    const handleConnectionTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setConnectionType(e.target.value as 'db' | 'email');
    };
    // Reset the selectedType and dynamicProps whenever the connection type changes
    useEffect(() => {
        // Clear the selectedType and dynamicProps when switching between 'db' and 'email'
        setSelectedType('');
        setDynamicProps([]);
    }, [connectionType, setSelectedType, setDynamicProps]);

    return (
        <div className="App">
            <select value={connectionType} onChange={handleConnectionTypeChange}>
                <option value="db">Database Connection</option>
                <option value="email">Email Connection</option>
            </select>

            {connectionType === 'db' && (
                <DatabaseTypeProvider databaseType={selectedType as DatabaseType}>
                    <select onChange={handleTypeChange} value={selectedType}>
                        {allDef.map(def => (
                            <option key={def.name} value={def.name.toLowerCase()}>
                                {def.name}
                            </option>
                        ))}
                    </select>
                    <DbFormWithArray dynamicProps={dynamicProps}/>
                </DatabaseTypeProvider>
            )}
            {connectionType === 'email' && (
                <EmailTypeProvider emailType={selectedType as EmailType}>
                    <select onChange={handleTypeChange} value={selectedType}>
                        {emailDef.map(def => (
                            <option key={def.name} value={def.name.toLowerCase()}>
                                {def.name}
                            </option>
                        ))}
                    </select>
                    <EmailFormWithArray dynamicProps={dynamicProps}/>
                </EmailTypeProvider>
            )}
        </div>
    );
}

export default App;
