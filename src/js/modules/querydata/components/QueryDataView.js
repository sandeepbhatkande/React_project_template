import React from 'react';
import { getQueryData } from '../actions/QueryDataActions';
import CustomScrollbar from 'js/common/components/CustomScrollbar';
import { saveAs } from 'file-saver';
import { showMessage } from 'js/modules/message/actions/MessageActions';
import { BOARD_MESSAGE_CONSTANT } from 'js/modules/message/constants/MessageConstants';
import JSZip from 'jszip';
import properties from 'properties';
import AppUtil from 'js/utils/AppUtil';

class QueryDataView extends React.Component {
	constructor(props) {
        super(props);
        
        this.state = {
            login: false,
            encryptedString: undefined
        }
	};

	render() {
        return (
            <React.Fragment>
                {
                    ((this.state.login && this.getQueryDataJSX()) || this.getLoginJSX())
                }
            </React.Fragment>
        )
    };

    getLoginJSX() {
        return (
            <div className='login_cnt'>
                <img src='images/login.png' alt='login' className='loginbg'></img>
                <div className='login_detail_cnt'>
                    <div className='label bold'>Story Mapping</div><br></br>
                    <input id='username' type='text' placeholder='Login Id'></input><br></br>
                    <input id='password' type='password' placeholder='password'></input><br></br>
                    <input type='button' value='Login' id='login' onClick={ this.login.bind(this) }></input>
                </div>
            </div>
        );
    };

    getQueryDataJSX() {
        let keyIndex = 0;

		return (
            <div className='query_data_cnt'>
                <img src='images/querydata/bg.png' className='qbg' alt='bg'></img>
                <div className='query_cnt'>
                    <textarea id='query' className='query' alt='query' placeholder='Enter query' autoFocus></textarea>
                    <div className='btn_cnt'>
                        <button className='btn cur_pointer' onClick={ this.executeQuery.bind(this) }>Execute</button>
                        <button className='btn cur_pointer' onClick={ this.downloadData.bind(this) }>Donwload</button>
                        <button className='btn cur_pointer' onClick={ this.downloadZip.bind(this) }>Donwload Zip</button>
                        <button className='btn cur_pointer' onClick={ this.encrypt.bind(this) }>Encrypt</button>
                    </div>
                </div>
                {
                    this.props.querydata &&
                        <div className='query_info'>
                            <label>{`No of document: ${ this.props.querydata.results ? this.props.querydata.results.length : 0 }`}</label><br></br>
                            <label>{`Query Execution Time: ${ this.props.querydata.QueryExecutionTime }ms`}</label>
                        </div>
                }
                {
                    this.state.encryptedString && 
                    <div className='query_info'>{ this.state.encryptedString }</div>
                }
                <CustomScrollbar style={ { height: 'calc(100% - 172px)', width: '100%' } } id="query_data_scroll_cnt">
                    <ul className='query_data'>
                        {
                            this.props.querydata && this.props.querydata.results && this.props.querydata.results.map( data => (
                                <li key={ keyIndex++ }>
                                    <div className='index'>{ keyIndex }.</div>
                                    <pre>{ JSON.stringify(data, undefined, 4) }</pre>
                                </li>
                            ))
                        }
                    </ul>
                </CustomScrollbar>
            </div>
		);
    };
    
    executeQuery( event, callback ) {
        this.setState({
            encryptedString: undefined
        })

        const querydata = document.getElementById('query').value.trim();

        if ( querydata !== '' && querydata ) {
            this.props.store.dispatch( getQueryData( JSON.parse(querydata), callback ) );
        } else {
            this.props.store.dispatch( showMessage({
                    type: BOARD_MESSAGE_CONSTANT.TYPE_WARNING,
                    message: "Query is blank"
            }) );

            document.getElementById('query').focus();
        }
    };

    downloadData() {
        const that = this;

        this.executeQuery( undefined, () => {
            if ( that.props.querydata && that.props.querydata.results ) {
                const blob = new Blob([JSON.stringify(that.props.querydata.results, undefined, 4)], {type: "text/plain;charset=utf-8"});
    
                saveAs(blob, "querydata.json");
            }
        });
    };

    downloadZip() {
        const that = this;

        this.executeQuery( undefined, () => {
            if ( that.props.querydata && that.props.querydata.results ) {
                const zip = new JSZip();
    
                const blob = new Blob([JSON.stringify(that.props.querydata.results, undefined, 4)], {type: "text/plain;charset=utf-8"});
                zip.file("querydata.json", blob);
                
                zip.generateAsync({type:"blob"}).then( content => {
                    saveAs(content, "querydata.zip");
                });
            }
        });
    };

    encrypt() {
        const url = properties.url + "core/querydata/encrypt";
        const that = this;
        const password = document.getElementById('query').value.trim();

        AppUtil.ajax(url, {
            password
        }, result => {
            that.setState({
                encryptedString: result.password
            });
        });
    };

    login() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        const that = this;

        if ( username === properties.querydata_username ) {
            const url = properties.url + "core/querydata/encrypt";
            
            AppUtil.ajax(url, {
                password
            }, result => {
                if ( properties.querydata_password === result.password ) {
                    that.setState({
                        login: true
                    });
                } else {
                    this.props.store.dispatch( showMessage({
                            type: BOARD_MESSAGE_CONSTANT.TYPE_WARNING,
                            message: 'Invalid password'
                    }) );
                }
            });
        } else {
            this.props.store.dispatch( showMessage({
                    type: BOARD_MESSAGE_CONSTANT.TYPE_WARNING,
                    message: 'Invalid username'
            }) );
        }
    };
}

export default QueryDataView;