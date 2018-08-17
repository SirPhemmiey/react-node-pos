// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
// import registerServiceWorker from './registerServiceWorker';

// ReactDOM.render(<App />, document.getElementById('root'));
// registerServiceWorker();

import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import { makeRoutes } from './routes';
import App from './App';

render(
    <BrowserRouter>
    <App />
    </BrowserRouter>,
    document.getElementById("root")
);
registerServiceWorker();
