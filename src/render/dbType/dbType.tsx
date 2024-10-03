import React from "react";

export type DatabaseType = 'oracle' | 'postgres' | 'mysql' | 'sqlServer';

export const databases: DatabaseType[] = [
    'oracle', 'postgres', 'mysql', 'sqlServer'
];

export function isDatabase(type: string): boolean {
    return databases.includes(type as DatabaseType);
}

export const dbTypeContext = React.createContext<DatabaseType>(databases[0]);

export type DatabaseProviderProp = {
    children: React.ReactNode;
    databaseType?: DatabaseType
}

export function DatabaseTypeProvider(prop: DatabaseProviderProp) {

    const {children, databaseType = databases[0]} = prop;
    return (
        <dbTypeContext.Provider value={databaseType}>
            {children}
        </dbTypeContext.Provider>
    )
}

export function useDbType() {
    return React.useContext(dbTypeContext);
}
