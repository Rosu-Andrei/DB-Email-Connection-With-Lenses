import React from 'react';
import { LensAndPath } from '../utils/lens';
import {arrayToObj} from "../render/display.from.array";
import {Event} from "../events/events"

interface FormWithArrayProps<S> {
    s: S;
    lens: LensAndPath<S, any>;
    dynamicProps: Array<any>;
    handleEvent: (event: Event) => void;
}

export const FormWithArray = <S,>({
                                      s,
                                      lens,
                                      dynamicProps,
                                      handleEvent
                                  }: FormWithArrayProps<S>) => {
    const formData = lens.get(s) || {};

    return (
        <div>
            {arrayToObj<any>(dynamicProps, formData, handleEvent, lens)}
        </div>
    );
};
