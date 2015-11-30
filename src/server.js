/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import 'babel-core/polyfill';
import path from 'path';
import React from 'react';
import ReactDOM from 'react-dom/server';
import Html from './components/Html';
import locationService from './services/locationService';
import feathers from 'feathers';

const app = feathers();

const port = process.env.PORT || 5000;

app.configure(feathers.rest());
app.configure(feathers.primus({
  transformer: 'sockjs',
  pathname: '/primus',
}));

app.use('/', feathers.static(path.join(__dirname, 'public')));

app.use('/location', locationService);


//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get('*', async (req, res, next) => {
  try {
    const statusCode = 200;
    const data = { title: '', description: '', css: '', body: '' };

    const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
    res.status(statusCode).send('<!doctype html>\n' + html);
  } catch (err) {
    next(err);
  }
});

//
// Launch the server
// -----------------------------------------------------------------------------
app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`The server is running at http://localhost:${port}/`);
});
