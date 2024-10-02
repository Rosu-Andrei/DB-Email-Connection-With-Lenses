import { ObjectDef } from "../RenderObject";
import { EmailConnectionV2 } from "../../domain/EmailConnection";

export const smtpEmailConnection: ObjectDef<EmailConnectionV2> = {
    smtpSettings: {
        type: 'group',
        defn: {
            host: 'text',
            port: 'text',
            userCredentials: {
                type: 'group',
                defn: {
                    user: 'text',
                    password: 'text',
                },
            },
            secure: { type: 'dropdown', options: ['true', 'false'] },
        },
    },
};
