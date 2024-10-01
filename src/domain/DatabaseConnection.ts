export interface DatabaseConnection {
    host: string,
    port: string
    user: string,
    password: string,
    database: string,
    ssl: string,
    instanceName: string,
    encrypt: string
    serviceName: string,
    sid: string
}

export interface BaseCredentials {
    host: string,
    port: string
    userCredentials: UserCredentials
}

export interface UserCredentials {
    user: string,
    password: string
}

export interface DatabaseConnectionV2 {
    baseCredentials: BaseCredentials
    database: string,
    ssl: string,
    instanceName: string,
    encrypt: string
    serviceName: string,
    sid: string
}

export const emptyDatabaseConnection: DatabaseConnectionV2 = {
    baseCredentials: {
        host: '',
        port: '',
        userCredentials: {
            user: '',
            password: ''
        }
    },
    database: '',
    ssl: '',
    instanceName: '',
    encrypt: '',
    serviceName: '',
    sid: ''
};
