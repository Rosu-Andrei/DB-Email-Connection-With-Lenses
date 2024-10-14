export type EventType = 'addConnection' | 'removeConnection' | 'updateConnection' | 'setInputValue' | 'error';

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

export interface UpdateConnectionEvent extends BaseEvent {
    event: 'updateConnection';
    connectionId: string;
    updatedProps: any;
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

export type Event = AddConnectionEvent | RemoveConnectionEvent | UpdateConnectionEvent | SetInputValueEvent | ErrorEvent;

export interface EventNameAnd<T> {
    addConnection: T
    updateConnection: T
    removeConnection: T
    setInputValue: T
    error: T
}