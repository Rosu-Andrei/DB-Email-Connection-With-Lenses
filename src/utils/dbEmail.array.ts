export const baseProp = [
    {type: 'title', text: 'Base Credentials'},
    'baseCredentials.host/string',
    'baseCredentials.port/number',
    {type: 'subtitle', text: 'User Credentials'},
    'baseCredentials.userCredentials.user/string',
    'baseCredentials.userCredentials.password/password',
];



export const oracleProps = [
    ...baseProp,
    {type: 'title', text: 'Specific Credentials'},
    'serviceName/string',
    'sid/string',
];


export const mySqlProps = [
    ...baseProp,
    {type: 'title', text: 'Specific Credentials'},
    'database/string',
    'ssl/string'
];


export const sqlServerProps = [
    ...baseProp,
    {type: 'title', text: 'Specific Credentials'},
    'instanceName/string',
    'encrypt/string'
]

export const postgresProps = [
    ...baseProp,
    {type: 'title', text: 'Specific Credentials'},
    'database/string',
    'ssl/string'
]

export const smtpProps = [
    {type: 'title', text: 'Specific Credentials'},
    'smtpSettings.host/string',
    'smtpSettings.port/number',
    'smtpSettings.userCredentials.user/string',
    'smtpSettings.userCredentials.password/password',
    'smtpSettings.secure/options:true,false'
];


export const sendGridProps = [
    {type: 'title', text: 'Specific Credentials'},
    'sendGridSettings.apiKey/password'
];
