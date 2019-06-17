import React, { Component } from 'react';
import styles from './FooterComponent.module.scss';

class Footer extends Component {
    constructor(props) {
        super(props);

    }

    componentDidMount(){
    }

    render() {
        return(
            <footer className={"footer "+styles.footer}>
                {/* <div className="container"> */}
                    <span className="text-muted">Copyright © Atom Cai 2019</span>
                {/* </div> */}
            </footer>
        );
    };
}

export default Footer;