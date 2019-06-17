import React from 'react';
import logo from './logo.svg';
import './App.css';
import Main from './components/MainComponent';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { BrowserRouter } from "react-router-dom";
import { unregisterFetchIntercept } from './shared/fetchIntercept';
import Footer from './components/FooterComponent';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="App">
          <Main/>
          <Footer/>
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
