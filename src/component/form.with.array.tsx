import React from 'react';
import { LensWithPath } from '../utils/lens';
import { arrayToObj } from '../render/display.from.array';

interface FormWithArrayProps<S> {
    lens: LensWithPath<S, any>;
    dynamicProps: Array<any>;
}

export const FormWithArray = <S,>({ lens, dynamicProps }: FormWithArrayProps<S>) => {
    return <div>{arrayToObj<any>(dynamicProps, lens)}</div>;
};
