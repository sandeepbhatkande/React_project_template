import { QUERY_DATA_CONSTANT } from '../constants/QueryDataConstants';

const initialState = {
    
};

const queryDataReducer = (state = initialState, action) => {
	switch ( action.type ) {
        case QUERY_DATA_CONSTANT.GET_QUERY_DATA:
            return {
                ...state,
                querydata: action.payload.data
            }
		default:
            return state;
	}
};

export default queryDataReducer;