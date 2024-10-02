import React, { useState } from 'react';
import './App.css';
import { DatabaseType, DatabaseTypeProvider, isDatabase, databases } from "./render/dbType/dbType";
import { DbFormWithArray } from "./component/DbConnectionForm2";
import { mySqlProps, oracleProps, postgresProps, sqlServerProps, smtpProps, sendGridProps } from "./utils/dbEmail.array";
import { EmailType, EmailTypeProvider, isEmailType} from "./render/dbType/emailType";
import { EmailFormWithArray } from "./component/EmailConnectionForm";

// Mapping of database types to property arrays
const dbPropsMap: Record<DatabaseType, Array<any>> = {
    oracle: oracleProps,
    mysql: mySqlProps,
    sqlServer: sqlServerProps,
    postgres: postgresProps
};

// Mapping of email types to property arrays
const emailPropsMap: Record<EmailType, Array<any>> = {
    smtp: smtpProps,
    sendgrid: sendGridProps
};

function App() {
    // State to manage connection type ('db' or 'email') and provider type
    const [connectionType, setConnectionType] = useState<'db' | 'email'>('db');
    const [providerType, setProviderType] = useState<string>('');

    // State to manage the dynamic property array
    const [dynamicProps, setDynamicProps] = useState<Array<any>>([]);

    const handleConnectionTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newConnectionType = e.target.value as 'db' | 'email';
        setConnectionType(newConnectionType);
        setProviderType('');
        setDynamicProps([]);
    };

    const handleProviderTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newProviderType = e.target.value;
        setProviderType(newProviderType);

        if (connectionType === 'db' && isDatabase(newProviderType)) {
            setDynamicProps(dbPropsMap[newProviderType as DatabaseType]);
        } else if (connectionType === 'email' && isEmailType(newProviderType)) {
            setDynamicProps(emailPropsMap[newProviderType as EmailType]);
        }
    };

    return (
        <div className="App">
            {/* Connection Type Selector */}
            <select value={connectionType} onChange={handleConnectionTypeChange}>
                <option value="db">Database Connection</option>
                <option value="email">Email Connection</option>
            </select>

            {connectionType === 'db' && (
                <DatabaseTypeProvider databaseType={providerType as DatabaseType}>
                    {/* Database Provider Selector */}
                    <select onChange={handleProviderTypeChange} value={providerType}>
                        <option value="">Select Database Type</option>
                        <option value="oracle">Oracle</option>
                        <option value="mysql">MySQL</option>
                        <option value="sqlServer">SQL Server</option>
                        <option value="postgres">Postgres</option>
                    </select>

                    {providerType && dynamicProps.length > 0 && (
                        <DbFormWithArray dynamicProps={dynamicProps} />
                    )}
                </DatabaseTypeProvider>
            )}

            {connectionType === 'email' && (
                <EmailTypeProvider emailType={providerType as EmailType}>
                    {/* Email Provider Selector */}
                    <select onChange={handleProviderTypeChange} value={providerType}>
                        <option value="">Select Email Provider</option>
                        <option value="smtp">SMTP</option>
                        <option value="sendgrid">SendGrid</option>
                    </select>

                    {providerType && dynamicProps.length > 0 && (
                        <EmailFormWithArray dynamicProps={dynamicProps} />
                    )}
                </EmailTypeProvider>
            )}
        </div>
    );
}

export default App;
