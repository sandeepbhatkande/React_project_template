import { QUERY_DATA_CONSTANT } from 'js/modules/querydata/constants/QueryDataConstants';
import * as actions from 'js/modules/querydata/actions/QueryDataActions';

describe('QueryDataActions', () => {
    describe('populateQueryData', () => {
        it('It populates query data', () => {
            expect( actions.populateQueryData({}) ).toEqual( {
                type: QUERY_DATA_CONSTANT.GET_QUERY_DATA,
                payload: {
                    data: {}
                }
            } );
        });
    });
});