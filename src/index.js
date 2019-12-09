import React from 'react';
import ReactDOM from 'react-dom';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import * as serviceWorker from './serviceWorker';

import './index.css';
import Layout from './components/Layout/Layout';
import Samples from './components/Sample/List';

const theme = createMuiTheme({
  palette: {
    primary: {
      dark: '#0097A7',
      main: '#00BCD4',
      light: '#B2EBF2',
      contrastText: '#fff',
    },
    secondary: {
      main: '#3F51B5',
      contrastText: '#fff',
    },
    type: 'dark',
  },
});

document.body.style.background = theme.palette.background.default

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <link href='https://fonts.googleapis.com/css?family=Roboto&display=swap' rel='stylesheet'/>
    <Layout>
      <Samples />
    </Layout>
  </ThemeProvider>
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
