import * as moment from 'moment-mini-ts';

const initialState: any = {
    ids: [],
    idsFilter: [],
    entities: {},
};

export function reducer(state = initialState, action) {
    switch (action.type) {

        case 'LOGS_ACTION_LOAD_SUCCESS': {

            return {
                ...state,
                ids: action.payload
                    .map(logsAction => logsAction.id)
                    .sort((a, b) => a - b),
                entities: action.payload
                    .reduce((accumulator, logsAction) => {

                        return {
                            ...accumulator,
                            [logsAction.id]: {
                                ...logsAction,
                                // message: message,
                                // preview: message.payload.length > 20 ? message.payload.substring(0, 20) + '...' : '',
                                datetime: moment.utc(Math.ceil(logsAction.timestamp / 1000000)).format('HH:mm:ss.SSS, DD MMM YY'),
                            }
                        };

                    }, {}),
            };
        }

        default:
            return state;
    }
}
