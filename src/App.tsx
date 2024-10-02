import React, {useState} from 'react';
import './App.css';
import {DatabaseType, DatabaseTypeProvider, isDatabase} from "./render/dbType/dbType";
import {DbFormWithArray} from "./component/DbConnectionForm2";
import {mySqlProps, oracleProps, postgresProps, sqlServerProps} from "./utils/db.array";


// Mocked database type from URL for demonstration purposes
const dbType = window.location.search.split('=')[1] as DatabaseType;
if (dbType && !isDatabase(dbType))
    throw new Error('Failed to get the database type from the url');


// Mapping of database types to property arrays
const dbPropsMap: Record<DatabaseType, Array<any>> = {
    oracle: oracleProps,
    mysql: mySqlProps,
    sqlServer: sqlServerProps,
    postgres: postgresProps
};

function App() {
    // State to manage the dynamic property array
    const [dynamicProps, setDynamicProps] = useState(dbPropsMap[dbType] || oracleProps);

    return (
        <div className="App">
            <DatabaseTypeProvider databaseType={dbType}>
                <select onChange={(e) => setDynamicProps(dbPropsMap[e.target.value as DatabaseType])} value={dbType}>
                    <option value="oracle">Oracle</option>
                    <option value="mysql">MySQL</option>
                    <option value="sqlServer">SQL Server</option>
                    <option value="postgres">Postgres</option>
                </select>

                <DbFormWithArray dynamicProps={dynamicProps}/>
            </DatabaseTypeProvider>
        </div>
    );
}

export default App;
