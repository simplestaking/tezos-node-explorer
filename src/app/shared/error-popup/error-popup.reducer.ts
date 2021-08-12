import { HttpError } from '../types/shared/error-popup/http-error.type';
import { ErrorActions, ErrorActionTypes } from './error-popup.actions';
import { State } from '../../app.reducers';

export interface ErrorState {
  errors: HttpError[];
}

const initialState: ErrorState = {
  errors: []
};

export function reducer(state: ErrorState = initialState, action: ErrorActions): ErrorState {
  switch (action.type) {
    case ErrorActionTypes.ADD_ERROR: {
      return {
        errors: state.errors.findIndex(err => err.title === action.payload.title && err.message === action.payload.message) !== -1
          ? state.errors
          : [...state.errors, action.payload]
      };
    }
    case ErrorActionTypes.REMOVE_ERRORS: {
      return initialState;
    }
    default:
      return state;
  }
}

export const selectErrors = (state: State) => state.error.errors;
