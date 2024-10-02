import React from 'react';
import './App.css';
import {DatabaseType, DatabaseTypeProvider} from "./render/dbType/dbType";
import {DbFormWithArray} from "./component/DbConnectionForm2";
import {allDef} from "./utils/db.component.prop";
import {useDatabaseType} from "./hooks/use.database.type";


function App() {
    // Use the custom hook to get the current selected database type and dynamic properties.
    const {selectedDbType, dynamicProps, handleDbTypeChange} = useDatabaseType();

    return (
        <div className="App">
            <DatabaseTypeProvider databaseType={selectedDbType as DatabaseType}>
                {/* Dropdown to select the database type */}
                <select onChange={handleDbTypeChange} value={selectedDbType}>
                    {allDef.map(def => (
                        <option key={def.name} value={def.name.toLowerCase()}>
                            {def.name}
                        </option>
                    ))}
                </select>

                {/* Dynamic form based on the selected database type */}
                <DbFormWithArray dynamicProps={dynamicProps}/>
            </DatabaseTypeProvider>
        </div>
    );
}

export default App;
