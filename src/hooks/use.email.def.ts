import React, {useState} from "react";
import {allDef} from "../utils/db.component.prop";
import {emailDeff, SmtpDef} from "../utils/email.component.prop";

export type UseEmailTypeResult = {
    selectedEmailType: string;
    dynamicEmailProps: Array<any>;
    handleEmailTypeChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

const emailPropsMap: Record<string, Array<any>> = {};
emailDeff.forEach((def) => {
    emailPropsMap[def.name.toLowerCase()] = def.render;
});

export function useEmailType(): UseEmailTypeResult {
    const emailTypeParam = window.location.search.split('=')[1];
    const initialEmailType = emailTypeParam && allDef.some(def => def.name.toLowerCase() === emailTypeParam.toLowerCase())
        ? emailTypeParam.toLowerCase()
        : 'smtp';

    const [selectedEmailType, setSelectedEmailType] = useState<string>(initialEmailType);
    const [dynamicEmailProps, setDynamicProps] = useState<Array<any>>(emailPropsMap[initialEmailType] || SmtpDef.render);

    const handleEmailTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newEmailType = event.target.value.toLowerCase();
        setSelectedEmailType(newEmailType);
        setDynamicProps(emailPropsMap[newEmailType]);
    };

    return {selectedEmailType, dynamicEmailProps, handleEmailTypeChange};
}