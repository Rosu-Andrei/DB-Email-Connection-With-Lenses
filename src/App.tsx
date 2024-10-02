import React, {useState} from 'react';
import './App.css';
import {DatabaseType, DatabaseTypeProvider} from "./render/dbType/dbType";
import {DbFormWithArray} from "./component/DbFormWithArray";
import {EmailType, EmailTypeProvider, isEmailType} from "./render/dbType/emailType";
import {EmailFormWithArray} from "./component/EmailConnectionForm";
import {useDatabaseType} from "./hooks/use.database.type";
import {allDef} from "./utils/db.component.prop";
import {useEmailType} from "./hooks/use.email.def";
import {emailDeff} from "./utils/email.component.prop";


function App() {
    // State to manage connection type ('db' or 'email') and provider type
    const [connectionType, setConnectionType] = useState<'db' | 'email'>('db');
    const [providerType, setProviderType] = useState<string>('');
    const [dynamicProps, setDynamicProps] = useState<Array<any>>([]);

    const handleConnectionTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newConnectionType = e.target.value as 'db' | 'email';
        setConnectionType(newConnectionType);
        setProviderType('');
        setDynamicProps([]);
    };

    const {selectedDbType, dynamicDbProps, handleDbTypeChange} = useDatabaseType();
    const {selectedEmailType, dynamicEmailProps, handleEmailTypeChange} = useEmailType();
    return (
        <div className="App">
            <select value={connectionType} onChange={handleConnectionTypeChange}>
                <option value="db">Database Connection</option>
                <option value="email">Email Connection</option>
            </select>

            {connectionType === 'db' && (
                <DatabaseTypeProvider databaseType={selectedDbType as DatabaseType}>
                    <select onChange={handleDbTypeChange} value={selectedDbType}>
                        {allDef.map(def => (
                            <option key={def.name} value={def.name.toLowerCase()}>
                                {def.name}
                            </option>
                        ))}
                    </select>
                    <DbFormWithArray dynamicProps={dynamicDbProps}/>
                </DatabaseTypeProvider>
            )}
            {connectionType === 'email' && (
                <EmailTypeProvider emailType={selectedEmailType as EmailType}>
                    <select onChange={handleEmailTypeChange} value={selectedEmailType}>
                        {emailDeff.map(def => (
                            <option key={def.name} value={def.name.toLowerCase()}>
                                {def.name}
                            </option>
                        ))}
                    </select>
                    <EmailFormWithArray dynamicProps={dynamicEmailProps}/>
                </EmailTypeProvider>
            )}

        </div>
    );
}

export default App;
