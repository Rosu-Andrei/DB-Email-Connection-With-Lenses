// events.ts
import { ConnectionDef } from "../utils/component.prop";

export type EventType =
    | 'addConnection'
    | 'removeConnection'
    | 'setValue'
    | 'error';

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

export interface SetValueEvent extends BaseEvent {
    event: 'setValue';
    connectionId?: string;
    fieldName?: string;
    value: Value;
}

export interface ErrorEvent extends BaseEvent {
    event: 'error';
    error: string;
}

export type Event =
    | AddConnectionEvent
    | RemoveConnectionEvent
    | SetValueEvent
    | ErrorEvent;

export interface EventNameAnd<T> {
    addConnection: T;
    removeConnection: T;
    setValue: T;
    error: T;
}

export type Value = string | SelectedType | ConnectionType;

export interface ConnectionType extends SelectedType {
    connectionType: string;
}

export interface SelectedType {
    selectedType: string;
    dynamicProps: any[];
    formData: {};
}

export function isSelectedType(value: any): value is SelectedType {
    return (
        value &&
        typeof value === 'object' &&
        'selectedType' in value &&
        'dynamicProps' in value &&
        'formData' in value
    );
}

export function isConnectionType(value: any): value is ConnectionType {
    return (
        isSelectedType(value) &&
        'connectionType' in value
    );
}