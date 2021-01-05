import { QUERY_DATA_CONSTANT } from '../constants/QueryDataConstants';
import properties from 'properties';
import AppUtil from 'js/utils/AppUtil';

export const processQueryDataResult = result => {
    if ( typeof(result) === 'object' && Array.isArray(result) ) {
        for ( const resultdata of result ) {
            processQueryDataResult(resultdata);
        }
    } else if ( typeof(result) === 'object' ) {
        for ( const key in result ) {
            if ( key === '$date' ) {
                result[key] = new Date(result[key]);
            } else {
                processQueryDataResult( result[key] );
            }
        }
    } else {
        return result;
    }
}

export const populateQueryData = data => {
    return {
        type: QUERY_DATA_CONSTANT.GET_QUERY_DATA,
        payload: {
            data
        }
    }
}

export const getQueryData = ( querydata, callback ) => {
    return dispatch => {
        const url = properties.isIntegrated ? properties.url + "core/querydata/execute" : "data/QueryData.json";

        AppUtil.ajax(url, querydata, result => {
            processQueryDataResult(result);

            dispatch( populateQueryData(result) );

            if ( callback ) {
                callback();
            }
        });
    }
}