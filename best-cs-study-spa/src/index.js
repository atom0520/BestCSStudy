// import 'react-app-polyfill/ie11';
// import 'react-app-polyfill/stable';
import 'react-app-polyfill/ie9'

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootswatch/dist/sketchy/bootstrap.min.css';
import 'bootswatch/dist/sandstone/bootstrap.min.css';
import 'font-awesome/css/font-awesome.css';
import 'alertifyjs/build/css/alertify.min.css';
import 'alertifyjs/build/css/themes/bootstrap.min.css';
import 'react-image-gallery/styles/css/image-gallery.css';
import './index.css';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
