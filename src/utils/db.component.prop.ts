import {mySqlProps, oracleProps, postgresProps, sqlServerProps} from "./db.array";


export type DatabaseProp = {
    name: string,
    render: Array<any>
}
export const MysqlDef: DatabaseProp = {
    name: 'MySql',
    render: mySqlProps
};

export const OracleDef: DatabaseProp = {
    name: 'Oracle',
    render: oracleProps
};

export const SqlServerDef: DatabaseProp = {
    name: 'SqlServer',
    render: sqlServerProps
};

export const PostgresDef: DatabaseProp = {
    name: 'Postgres',
    render: postgresProps
};

export const allDef = [MysqlDef, OracleDef, SqlServerDef, PostgresDef];