import {ConnectionDef} from "../utils/component.prop";

export type EventType = 'addConnection' | 'removeConnection' | 'updateConnectionType' | 'updateSelectedType' | 'setInputValue' | 'error';

export interface BaseEvent {
    path: string;
    event: EventType;
}

export interface AddConnectionEvent extends BaseEvent {
    event: 'addConnection';
    connectionId: string;
    connectionType: 'db' | 'email';
}

export interface RemoveConnectionEvent extends BaseEvent {
    event: 'removeConnection';
    connectionId: string;
}

export interface UpdateConnectionTypeEvent extends BaseEvent {
    event: 'updateConnectionType';
    connectionId: string;
    connectionType: 'db' | 'email';
}

export interface UpdateSelectedTypeEvent extends BaseEvent {
    event: 'updateSelectedType';
    connectionId: string;
    selectedType: string;
    defs?: ConnectionDef[];
}

export interface SetInputValueEvent extends BaseEvent {
    event: 'setInputValue';
    connectionId: string;
    fieldName: string;
    value: any;
}

export interface ErrorEvent extends BaseEvent {
    event: 'error';
    error: string;
}

export type Event = AddConnectionEvent | RemoveConnectionEvent | UpdateConnectionTypeEvent | UpdateSelectedTypeEvent | SetInputValueEvent | ErrorEvent;

export interface EventNameAnd<T> {
    addConnection: T
    updateConnectionType: T
    updateSelectedType: T
    removeConnection: T
    setInputValue: T
    error: T
}