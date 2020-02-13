import React from 'react';
import ReactDOM from 'react-dom';
import App from './modules/App';

document.addEventListener('touchstart', () => {}); // enable css active elements on safari
ReactDOM.render(<App />, document.getElementById('root'));
