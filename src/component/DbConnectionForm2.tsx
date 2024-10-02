import React, {useState} from "react";
import {DatabaseConnectionV2, emptyDatabaseConnection} from "../domain/DatabaseConnection";
import {arrayToObj} from "../render/display.from.array";
import {oracleProps} from "../utils/dbEmail.array";

export const DbFormWithArray: React.FC = () => {
    // Set up state management for the Dragon object using initialDragon as the starting state
    const [formData, setFormData] = useState<DatabaseConnectionV2>(emptyDatabaseConnection);

    // the first parameter will determine the props displayed in the web page.
    return (
        <div>
            {arrayToObj<DatabaseConnectionV2>(oracleProps, formData as DatabaseConnectionV2, setFormData)}
        </div>
    );
};
