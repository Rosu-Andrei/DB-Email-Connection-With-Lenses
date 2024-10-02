export interface EmailConnectionV2 {
    smtpSettings?: SMTPSettings;
    sendGridSettings?: SendGridSettings;
}

export interface SMTPSettings {
    host: string;
    port: number;
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
