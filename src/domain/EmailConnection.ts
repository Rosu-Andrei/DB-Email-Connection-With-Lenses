export interface EmailConnectionV2 {
    smtpSettings?: SMTPSettings;
    sendGridSettings?: SendGridSettings;
}

export interface SMTPSettings {
    host: string;
    port: string;
    userCredentials: UserCredentials;
    secure: string;
}

export interface SendGridSettings {
    apiKey: string;
}

export interface UserCredentials {
    user: string;
    password: string;
}

export const emptyEmailConnection: EmailConnectionV2 = {};
