import { ObjectDef } from "../RenderObject";
import { EmailConnectionV2 } from "../../domain/EmailConnection";

export const sendgridEmailConnection: ObjectDef<EmailConnectionV2> = {
    sendGridSettings: {
        type: 'group',
        defn: {
            apiKey: 'text',
        },
    },
};
