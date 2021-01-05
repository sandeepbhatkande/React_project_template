import { connect } from 'react-redux';
import QueryDataView from './QueryDataView';
import { getQueryData } from '../actions/QueryDataActions';

const mapStateToProps = (state, ownProps) => {
    const { querydata } = state.querydata;
    
    return {
        querydata,
        store: ownProps.store
    };
}

const mapDispatchToProps = dispatch => {
    return {
        getQueryData: () => {
            dispatch( getQueryData() )
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(QueryDataView);