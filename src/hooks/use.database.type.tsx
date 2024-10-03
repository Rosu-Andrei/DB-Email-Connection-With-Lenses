import React, {useState} from 'react';
import {allDef, MysqlDef} from "../utils/db.component.prop";


// Type definition for the hook's return value
type UseDatabaseTypeResult = {
    selectedDbType: string;
    dynamicDbProps: Array<any>;
    handleDbTypeChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

// Initialize dbPropsMap to be used by the custom hook.
const dbPropsMap: Record<string, Array<any>> = {};
allDef.forEach((def) => {
    dbPropsMap[def.name.toLowerCase()] = def.render;
});

/**
 * Custom hook to manage the selected database type and corresponding properties.
 */
export function useDatabaseType(): UseDatabaseTypeResult {
    // Retrieve the initial database type from the URL parameters or default to 'mysql'.
    const dbTypeParam = window.location.search.split('=')[1];
    const initialDbType = dbTypeParam && allDef.some(def => def.name.toLowerCase() === dbTypeParam.toLowerCase())
        ? dbTypeParam.toLowerCase()
        : 'mysql';

    // State to keep track of the current selected database type.
    const [selectedDbType, setSelectedDbType] = useState<string>(initialDbType);

    // State to manage the dynamic property array.
    const [dynamicDbProps, setDynamicProps] = useState<Array<any>>(dbPropsMap[initialDbType] || MysqlDef.render);

    // Function to handle database type changes.
    const handleDbTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newDbType = event.target.value.toLowerCase();
        setSelectedDbType(newDbType);
        setDynamicProps(dbPropsMap[newDbType]);
    };

    return {selectedDbType, dynamicDbProps, handleDbTypeChange};
}