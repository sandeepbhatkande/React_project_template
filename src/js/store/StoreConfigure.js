import {
    createStore,
    applyMiddleware,
    compose,
    combineReducers
} from 'redux';
import thunk from 'redux-thunk';
import MessageReducer from 'js/modules/message/reducers/MessageReducer';
import appReducer from 'js/app/reducers/AppReducer';
import queryDataReducer from 'js/modules/querydata/reducers/QueryDataReducer';

const rootReducer = combineReducers({
    messageData: MessageReducer,
    appData: appReducer,
    querydata: queryDataReducer
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore( rootReducer, composeEnhancers( applyMiddleware(thunk) ) );

export default store;