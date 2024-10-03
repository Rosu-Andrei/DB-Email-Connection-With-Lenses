import React, {useState, useEffect} from 'react';
import {ConnectionDef} from "../utils/db.component.prop";

/**
 * This hook manages the selected type (database or email) and the dynamic properties
 * based on the provided definitions.
 * @param definitions - An array of definitions (either allDef or emailDef).
 */
export const useConnectionType = (definitions: ConnectionDef[]) => {
    const [selectedType, setSelectedType] = useState<string>('');
    const [dynamicProps, setDynamicProps] = useState<Array<any>>([]);

    // Handle change in selected type (e.g., MySQL, Postgres, Smtp, SendGrid)
    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = e.target.value;
        setSelectedType(selected);

        // Find the selected definition and set the dynamic properties
        const def = definitions.find(d => d.name.toLowerCase() === selected);
        if (def) {
            setDynamicProps(def.render);
        }
    };

    // Update dynamic props if definitions change (e.g., switching between database and email)
    useEffect(() => {
        if (selectedType) {
            const def = definitions.find(d => d.name.toLowerCase() === selectedType);
            if (def) {
                setDynamicProps(def.render);
            }
        }
    }, [definitions, selectedType]);

    return {selectedType, dynamicProps, handleTypeChange, setSelectedType, setDynamicProps};
};
