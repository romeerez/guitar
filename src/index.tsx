import React from 'react'
import ReactDOM from 'react-dom'
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import Layout from 'Layout'
import List from 'Sample/List'
import './index.css'

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
      <List />
    </Layout>
  </ThemeProvider>,
  document.getElementById('root')
);
