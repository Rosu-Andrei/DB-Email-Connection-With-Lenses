export const baseProp = [
    'baseCredentials.host/string',
    'baseCredentials.port/string',
    'baseCredentials.userCredentials.user/string',
    'baseCredentials.userCredentials.password/string',
];



export const oracleProps = [
    ...baseProp,
    'serviceName/string',
    'sid/string',
];


export const mySqlProps = [
    ...baseProp,

    'baseCredentials.database/string',
    'baseCredentials.ssl/string'
];

export const sqlServerProps = [
    ...baseProp,

    'baseCredentials.instanceName/string',
    'baseCredentials.encrypt/string'
]

export const postgresProps = [
    ...baseProp,

    'baseCredentials.database/string',
    'baseCredentials.ssl/string'
]

export const smtpProps = [

    'smtpSettings.host/string',
    'smtpSettings.port/string',
    'smtpSettings.userCredentials.user/string',
    'smtpSettings.userCredentials.password/string',
    'smtpSettings.secure/options:true,false'
];

export const sendGridProps = [

    'sendGridSettings.apiKey/string'
];