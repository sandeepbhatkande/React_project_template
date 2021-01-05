import React from 'react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import AppContainer from './js/app/components/AppContainer';
import QueryDataContainer from './js/modules/querydata/components/QueryDataContainer';
import ErrorPageView from './js/common/components/ErrorPageView';
import ErrorBoxView from './js/common/components/ErrorBoxView';
import store from './js/store/StoreConfigure';
import './assets/sass/styles.scss';
import './assets/sass/themes/default/default_theme.scss';
import AppHelper from 'js/app/AppHelper';
import properties, { setProperties } from 'properties';
import AppUtil, { setAppStore } from 'js/utils/AppUtil';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import './i18n';

setAppStore(store);

AppHelper.setParamMap();

if ( properties.isIntegrated && !AppHelper.getParamData('smentid') ) {
    ReactDOM.render(<ErrorBoxView dataHtml="<div class='access_denied'>Access denied!</div>" /> , document.getElementById('root'));
} else {
    AppUtil.ajax( "data/AppProps.json", undefined, response => {
        setProperties(response)
    
        let w_url = properties.isIntegrated ? properties.url + "login" : "data/AppConfig.json";
    
        AppUtil.ajax( w_url, {
            enterpriseId: AppHelper.getParamData('smentid'),
            loginID: AppHelper.getParamData('smentid') + '_admin',
            password: properties.authTokenPassword
        }, result => {
            AppHelper.setAppAppAuthToken( result.headers.get('Authorization') );

            let contextpath = '/app';

            if ( properties.contextPath && properties.contextPath !== '' && properties.contextPath !== '#CONTEXTPATH#' ) {
                contextpath = '/' + properties.contextPath;
            }

            if ( AppHelper.getParamData('querydata') === 'Y' ) {
                ReactDOM.render((
                    <Provider store={ store }>
                        <Router>
                            <Switch>
                                <Route path={ contextpath }>
                                    <QueryDataContainer store={ store }/>
                                </Route>
                            </Switch>
                        </Router>
                    </Provider>)
                , document.getElementById('root'));
            } else {
                w_url = properties.isIntegrated && window.location.href.indexOf('/querydata') === -1
                ? properties.url + "core/app/getConfig/" + AppHelper.getParamData('smentid') + 
                "/" + AppHelper.getParamData('sointprjid') + "/" + AppHelper.getParamData('soextprjid') +
                "/"	+ AppHelper.getParamData('sointusrid') + "/" + AppHelper.getParamData('soexturid') +
                "/" + AppHelper.getParamData('sologinid') : "data/AppConfig.json";
            
                AppUtil.ajax( w_url, undefined, responseConfig => {
                    const sourceVersionNumber = AppHelper.getParamData('currentbuildversion');
                    const currentVersionSplit = sourceVersionNumber ? sourceVersionNumber.split(".") : [];
                    const supportedVersionNumber = responseConfig.versionInfo.sourcesupporttedversion[responseConfig.enterpriseType].split('.');

                    if ( sourceVersionNumber ) {
                        currentVersionSplit[0] = parseInt(currentVersionSplit[0].replace(/%20/g, '').match(/\d/g).join(''));
                        currentVersionSplit[1] = parseInt(currentVersionSplit[1]);
                        supportedVersionNumber[0] = parseInt(supportedVersionNumber[0]);
                        supportedVersionNumber[1] = parseInt(supportedVersionNumber[1]);
                    }

                    const w_validVersion = supportedVersionNumber ? (currentVersionSplit[0] > supportedVersionNumber[0] 
                        ? true : currentVersionSplit[0] === supportedVersionNumber[0] ? currentVersionSplit[1] >= supportedVersionNumber[1]: false) : false;

                    if ( responseConfig.m_errorList) {
                        ReactDOM.render(<ErrorBoxView dataHtml={ AppUtil.processErrorMessage( responseConfig.m_errorList[0] ) }/> , document.getElementById('root'));
                    } else if ( properties.isIntegrated && sourceVersionNumber && !w_validVersion ) {
                            
                        const supportVersionMsg = `For App to work product version should be equal to ${responseConfig.versionInfo.sourcesupporttedversion[responseConfig.enterpriseType]} or above`;
                        ReactDOM.render(<ErrorBoxView dataHtml={ supportVersionMsg }/> , document.getElementById('root'));
                    } else {
                        AppHelper.initConfig( responseConfig );

                        if ( responseConfig.customCSSFiles ) {
                            AppHelper.loadCustomCSSFiles( responseConfig.customCSSFiles );
                        }
                        
                        ReactDOM.render((
                            <Provider store={ store }>
                                    <Router>
                                        <Switch>
                                            <Route path={ contextpath }>
                                                <AppContainer store={ store }/>
                                            </Route>
                                        </Switch>
                                    </Router>
                            </Provider>)
                        , document.getElementById('root'));
                    }
                }, undefined, false, properties.isIntegrated ? {
                    method: 'POST'
                } : undefined )
            }
        }, () => {
            ReactDOM.render(<ErrorPageView /> , document.getElementById('root'));
        }, true );
    });
}

serviceWorker.unregister();