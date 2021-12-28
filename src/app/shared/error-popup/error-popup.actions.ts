import { Action } from '@ngrx/store';
import { HttpError } from '@shared/types/shared/error-popup/http-error.type';

enum ErrorActionTypes {
  ADD_ERROR = 'ADD_ERROR',
  ADD_INFO = 'ADD_INFO',
  REMOVE_ERROR = 'REMOVE_ERROR',
  REMOVE_INFO = 'REMOVE_INFO',
}

export const ADD_ERROR = ErrorActionTypes.ADD_ERROR;
export const ADD_INFO = ErrorActionTypes.ADD_INFO;
export const REMOVE_ERROR = ErrorActionTypes.REMOVE_ERROR;
export const REMOVE_INFO = ErrorActionTypes.REMOVE_INFO;

export class ErrorAdd implements Action {
  readonly type = ADD_ERROR;
  initiator?: string;

  constructor(public payload: HttpError) { }
}

export class InfoAdd implements Action {
  readonly type = ADD_INFO;
  initiator?: string;

  constructor(public payload: string) { }
}

export class RemoveError implements Action {
  readonly type = REMOVE_ERROR;
}

export class RemoveInfo implements Action {
  readonly type = REMOVE_INFO;
}

export type PopupActions = ErrorAdd | InfoAdd | RemoveError | RemoveInfo;
