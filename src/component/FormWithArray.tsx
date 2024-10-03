// src/component/FormWithArray.tsx

import React from 'react';
import { LensAndPath } from '../utils/lens';
import {arrayToObj} from "../render/display.from.array";

interface FormWithArrayProps<S> {
    s: S;
    setS: (s: S) => void;
    lens: LensAndPath<S, any>;
    dynamicProps: Array<any>;
}

export const FormWithArray = <S,>({
                                      s,
                                      setS,
                                      lens,
                                      dynamicProps,
                                  }: FormWithArrayProps<S>) => {
    const formData = lens.get(s) || {};

    const handleChange = (newData: any) => {
        setS(lens.set(s, newData));
    };

    return (
        <div>
            {arrayToObj<any>(dynamicProps, formData, handleChange, lens)}
        </div>
    );
};
