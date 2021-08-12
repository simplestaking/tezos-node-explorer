import { Action } from '@ngrx/store';
import { HttpError } from '../types/shared/error-popup/http-error.type';

export enum ErrorActionTypes {
  ADD_ERROR = 'ADD_ERROR',
  SCHEDULE_ERROR_DELETION = 'SCHEDULE_ERROR_DELETION',
  REMOVE_ERRORS = 'REMOVE_ERRORS',
}

export class ErrorAdd implements Action {
  readonly type = ErrorActionTypes.ADD_ERROR;

  constructor(public payload: HttpError) { }
}

export class RemoveErrors implements Action {
  readonly type = ErrorActionTypes.REMOVE_ERRORS;
}

export type ErrorActions = ErrorAdd | RemoveErrors;
