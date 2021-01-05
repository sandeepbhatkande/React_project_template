import React from 'react';
import MessageContainer from 'js/modules/message/components/MessageContainer.js';
import { GLOBAL_CONSTANTS } from 'js/common/constants/GlobalConstants';
import AppHelper from 'js/app/AppHelper';
import { changeLanguage } from 'I18N/I18NHelper';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
        this._handleKeyDown = this._handleKeyDown.bind(this);
        this._handleClickEvents = this._handleClickEvents.bind(this);

        document.addEventListener("keydown", this._handleKeyDown);
        document.addEventListener("click", this._handleClickEvents);

        if ( window.opener ) {
            window.onunload = function () {
                window.opener.location.reload();
            };
        }

        const userLang = navigator.language || navigator.userLanguage;
        changeLanguage(userLang);
    };

    componentDidMount() {
        this.props.initAppComp();
    };

    render() {
        return (
            <React.Fragment>
                <div>Welcome to app</div>
                <MessageContainer store={this.props.store} />
                {
                    this.props.appData && this.props.appData.showMask &&
                    <div className='app_mask full_width full_height'>
                        <img src='svg/loading.svg' className='vertical_align' alt='Loading'></img>
                    </div>
                }
            </React.Fragment>
        )
    };

    _handleKeyDown(event) {
        switch (event.keyCode) {
            case GLOBAL_CONSTANTS.ESCAPE_KEY:
                break;
            case GLOBAL_CONSTANTS.ENTER_KEY:
                break;
            case GLOBAL_CONSTANTS.F1_KEY:
                if ( AppHelper.getAppData("helpURL") ) {
                    window.open(AppHelper.getAppData("helpURL"), "Help", "width=" + window.screen.availWidth +
                        "px,height=" + window.screen.availHeight + "px,top=0,left=0")
                }
                break;
            default:
                break;
        }
    };

    _handleClickEvents() {
        // click event hadling
    };

    componentWillUnmount() {
        document.removeEventListener("keydown", this._handleKeyDown);
        document.removeEventListener("click", this._handleClickEvents);
    };
}

export default App;