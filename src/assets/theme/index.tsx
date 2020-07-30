import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

import { ThemesTypes } from './context';
import overrides from './overrides';
import props from './props';
import variables from './variables';

const themes: { [key in ThemesTypes]: ReturnType<typeof createMuiTheme> } = {
  light: createMuiTheme({
    palette: {
      type: 'light',
      primary: {
        light: '#66aaff',
        main: '#54a0ff',
        dark: '#5481ff',
        contrastText: '#fff'
      },
      secondary: {
        light: '#48ceaa',
        main: '#1dd1a1',
        dark: '#13b288',
        contrastText: '#fff'
      }
    },
    overrides,
    variables,
    props
  }),
  dark: createMuiTheme({
    palette: {
      type: 'dark',
      primary: {
        light: '#66aaff',
        main: '#54a0ff',
        dark: '#5481ff',
        contrastText: '#fff'
      },
      secondary: {
        light: '#48ceaa',
        main: '#1dd1a1',
        dark: '#13b288',
        contrastText: '#fff'
      }
    },
    overrides,
    variables,
    props
  })
};

export default themes;
