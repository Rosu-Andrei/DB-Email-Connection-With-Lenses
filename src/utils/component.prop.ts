export type ConnectionDef = {
    name: string;
    render: Array<any>;
};

const commonFieldsDB: any[] = [
    {type: 'title', text: 'Base Credentials'},
    'baseCredentials.host/string',
    'baseCredentials.port/number',
    {type: 'subtitle', text: 'User Credentials'},
    'baseCredentials.userCredentials.user/string',
    'baseCredentials.userCredentials.password/password',
    {type: 'title', text: 'Specific Credentials'}]

export const MysqlDef: ConnectionDef = {
    name: 'MySql',
    render: [
        ...commonFieldsDB,
        'database/string',
        'ssl/string'
    ]
};

export const OracleDef: ConnectionDef = {
    name: 'Oracle',
    render: [
        ...commonFieldsDB,
        'serviceName/string',
        'sid/string'
    ]
};

export const SqlServerDef: ConnectionDef = {
    name: 'SqlServer',
    render: [
        ...commonFieldsDB,
        'instanceName/string',
        'encrypt/string'

    ]
};

export const PostgresDef: ConnectionDef = {
    name: 'Postgres',
    render: [
        ...commonFieldsDB,
        'database/string',
        'ssl/string'
    ]
};
export const SmtpDef: ConnectionDef = {
    name: 'Smtp',
    render: [
        {type: 'title', text: 'Specific Credentials'},
        'smtpSettings.host/string',
        'smtpSettings.port/number',
        'smtpSettings.userCredentials.user/string',
        'smtpSettings.userCredentials.password/password',
        'smtpSettings.secure/options:true,false'
    ]

};

export const SendGridDef: ConnectionDef = {
    name: 'SendGrid',
    render: [
        {type: 'title', text: 'Specific Credentials'},
        'sendGridSettings.apiKey/password'
    ]
}

export const emailDef = [SmtpDef, SendGridDef];
export const dbDef = [MysqlDef, OracleDef, SqlServerDef, PostgresDef];