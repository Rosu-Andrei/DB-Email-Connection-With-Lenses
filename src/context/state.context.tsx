import React from 'react';
import { Event } from '../events/events';

export type SetFn = (event: Event) => void;
export type InterpreterChangeFn = (interpreter: string) => void;

export type StateOps<S> = {
    state: S;
    handleEvent: SetFn;
    events: Event[];
    result: any;
    interpreter: string;
    handleInterpreterChange: InterpreterChangeFn;
};
export const StateContext = React.createContext<StateOps<any> | undefined>(undefined);

export function useStateOps<S>(): StateOps<S> {
    const stateOps = React.useContext(StateContext);
    if (!stateOps) throw new Error('useStateOps must be used within a StateProvider');
    return stateOps as StateOps<S>;
}