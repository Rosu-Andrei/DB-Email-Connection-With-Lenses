import React, { useState } from 'react';
import { EmailConnectionV2, emptyEmailConnection } from '../domain/EmailConnection';
import { arrayToObj} from "../render/display.from.array";

interface EmailFormWithArrayProps {
    dynamicProps: Array<any>;
}

export const EmailFormWithArray: React.FC<EmailFormWithArrayProps> = ({ dynamicProps }) => {
    const [formData, setFormData] = useState<EmailConnectionV2>(emptyEmailConnection);

    return (
        <div>
            {arrayToObj<EmailConnectionV2>(dynamicProps, formData, setFormData)}
        </div>
    );
};
