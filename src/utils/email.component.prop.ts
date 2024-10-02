import {DatabaseProp} from "./db.component.prop";
import {sendGridProps, smtpProps} from "./dbEmail.array";

export const SmtpDef: DatabaseProp = {
    name: 'Smtp',
    render: smtpProps
};

export const SendGridDef: DatabaseProp = {
    name: 'SendGrid',
    render: sendGridProps
}

export const emailDeff = [SmtpDef, SendGridDef];