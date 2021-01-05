import QueryDataReducer from 'js/modules/querydata/reducers/QueryDataReducer';
import { QUERY_DATA_CONSTANT } from 'js/modules/querydata/constants/QueryDataConstants';

describe('QueryDataReducer', () => {
    describe('queryDataReducer', () => {
        it('GET_QUERY_DATA', () => {
            const actual = QueryDataReducer({}, {
                type: QUERY_DATA_CONSTANT.GET_QUERY_DATA,
                payload: {
                    data: {}
                }
            });

            expect(actual.querydata).toEqual({});
        });
    });
});