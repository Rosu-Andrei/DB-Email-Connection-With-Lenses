import React, { useState } from 'react';
import { EmailConnectionV2 } from '../domain/EmailConnection';
import { arrayToObj} from "../render/display.from.array";
import { smtpProps, sendGridProps } from '../utils/dbEmail.array';
import { useEmailType } from "../render/dbType/emailType";

export const EmailFormWithArray: React.FC = () => {
    const emailType = useEmailType();

    let initialFormData: EmailConnectionV2 = {};
    let propsArray: any[] = [];

    if (emailType === 'smtp') {
        initialFormData = {
            smtpSettings: {
                host: '',
                port: '',
                userCredentials: {
                    user: '',
                    password: ''
                },
                secure: ''
            }
        };
        propsArray = smtpProps;
    } else if (emailType === 'sendgrid') {
        initialFormData = {
            sendGridSettings: {
                apiKey: ''
            }
        };
        propsArray = sendGridProps;
    } else {
        throw new Error(`Unsupported email type: ${emailType}`);
    }

    const [formData, setFormData] = useState<EmailConnectionV2>(initialFormData);

    return (
        <div>
            {arrayToObj<EmailConnectionV2>(propsArray, formData, setFormData)}
        </div>
    );
};
