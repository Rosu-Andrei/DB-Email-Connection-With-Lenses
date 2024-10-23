
export type EventType =
    | 'appendValue'
    | 'removeConnection'
    | 'setValue'
    | 'error';

export interface BaseEvent {
    path: string;
    event: EventType;
    value?: any;
}

export interface AppendValueEvent extends BaseEvent {
    event: 'appendValue';
    connectionId: string;
}

export interface RemoveConnectionEvent extends BaseEvent {
    event: 'removeConnection';
    connectionId: string;
}

export interface SetValueEvent extends BaseEvent {
    event: 'setValue';
    connectionId?: string;
    fieldName?: string;
}

export interface ErrorEvent extends BaseEvent {
    event: 'error';
    error: string;
}

export type Event =
    | AppendValueEvent
    | RemoveConnectionEvent
    | SetValueEvent
    | ErrorEvent;

