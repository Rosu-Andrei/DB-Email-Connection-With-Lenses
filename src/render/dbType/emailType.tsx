import React from 'react';

export type EmailType = 'smtp' | 'sendgrid';

export const emailTypes: EmailType[] = ['smtp', 'sendgrid'];

export function isEmailType(type: string): boolean {
    return emailTypes.includes(type as EmailType);
}

export const emailTypeContext = React.createContext<EmailType>(emailTypes[0]);

export type EmailProviderProp = {
    children: React.ReactNode;
    emailType?: EmailType;
};

export function EmailTypeProvider(prop: EmailProviderProp) {
    const { children, emailType = emailTypes[0] } = prop;
    return (
        <emailTypeContext.Provider value={emailType}>
            {children}
        </emailTypeContext.Provider>
    );
}

export function useEmailType() {
    return React.useContext(emailTypeContext);
}
