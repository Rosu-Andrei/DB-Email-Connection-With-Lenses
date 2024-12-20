import { parseLens, LensWithPath, composeLens } from '../utils/lens';
import { RenderDef } from './simpleImpl/simple.renderers';
import React from 'react';
import { FieldWithLens } from './field.with.lense';

export const arrayToObj = <Main extends any>(
    list: any[],
    baseLens?: LensWithPath<any, Main>
) => {
    return list.map((item, index) => {
        if (typeof item === 'string') {
            let [path, type] = item.split('/');
            const lens = baseLens
                ? composeLens(baseLens, parseLens<any, any>(path))
                : parseLens<Main, any>(path);

            let renderer: RenderDef;
            if (type === 'string') {
                renderer = 'text';
            } else if (type === 'number') {
                renderer = 'number';
            } else if (type === 'password') {
                renderer = 'password';
            } else if (type.startsWith('options:')) {
                const options = type.replace('options:', '').split(',');
                renderer = { type: 'dropdown', options };
            } else {
                throw new Error(`Invalid type ${type}`);
            }

            return <FieldWithLens
                key={index}
                renderer={renderer}
                lens={lens} />;

        } else if (item.type) {
            if (item.type === 'title') {
                return <h1 key={index}>{item.text}</h1>;
            } else if (item.type === 'subtitle') {
                return <h2 key={index}>{item.text}</h2>;
            } else {
                throw new Error(`Invalid item type ${item.type}`);
            }
        } else {
            throw new Error(`Invalid item ${JSON.stringify(item)}`);
        }
    });
};
