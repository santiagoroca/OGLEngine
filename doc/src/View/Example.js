import React, { Component } from 'react';
import Style from './Style.css'
import EarthCode from './examples/earth_code'
import SyntaxHighlighter from 'react-syntax-highlighter';

class Example extends Component {

    constructor (props) {
        super(props);
        this.ref = React.createRef();
    }

    render() {
        return (
            <div className={"mainContainer"}>
                <div>
                    ${EarthCode}
                </div>
                <div ref={this.ref}></div>
            </div>
        );
    }

    componentDidMount () {
        window['viewer'](this.ref.current);
    }

}

export default Example;