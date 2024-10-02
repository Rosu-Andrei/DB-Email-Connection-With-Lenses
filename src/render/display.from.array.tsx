import {parseLens} from "../utils/lens";
import {RenderDef} from "./simpleImpl/simple.renderers";
import React from "react";
import {FieldWithLens} from "./file.with.lense";

export const arrayToObj = <Main extends any>(list: any[], obj: Main, setObj: (main: Main) => void) => {
    return list.map((item, index) => {
        if (typeof item === 'string') {

            let [path, type] = item.split('/');
            const lens = parseLens<Main, any>(path);

            let renderer: RenderDef;
            if (type === 'string') {
                renderer = "text";
            } else if (type === 'number') {
                renderer = "number";
            } else if (type === 'password') {
                renderer = "password";
            } else if (type.startsWith('options:')) {
                const options = type.replace('options:', '').split(',');
                renderer = { type: "dropdown", options };
            } else {
                throw new Error(`Invalid type ${type}`);
            }

            return (
                <FieldWithLens
                    id={path as keyof Main}
                    renderer={renderer}
                    lens={lens}
                    obj={obj}
                    setObj={setObj}
                />
            );
        } else if (item.type) {
            if (item.type === 'title') {
                return <h1>{item.text}</h1>;
            } else if (item.type === 'subtitle') {
                return <h2>{item.text}</h2>;
            } else {
                throw new Error(`Invalid item type ${item.type}`);
            }
        } else {
            throw new Error(`Invalid item ${JSON.stringify(item)}`);
        }
    });
};

