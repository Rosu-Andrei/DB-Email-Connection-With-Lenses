// DbFormWithArray.tsx
import React, { useState } from "react";
import { DatabaseConnectionV2, emptyDatabaseConnection } from "../domain/DatabaseConnection";
import { arrayToObj } from "../render/display.from.array";

// Props interface for the component
interface DbFormWithArrayProps {
    dynamicProps: Array<any>; // Expected shape of the props array
}

export const DbFormWithArray: React.FC<DbFormWithArrayProps> = ({ dynamicProps }) => {
    // Set up state management for form data using initial values
    const [formData, setFormData] = useState<DatabaseConnectionV2>(emptyDatabaseConnection);

    return (
        <div>
            {arrayToObj<DatabaseConnectionV2>(dynamicProps, formData as DatabaseConnectionV2, setFormData)}
        </div>
    );
};
