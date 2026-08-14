import { createTheme } from '@mui/material/styles'

/**
 * Keeps the settings dialog on the same ink-and-paper palette as the page.
 * Values mirror the tokens in globals.css; MUI needs literal colours to work
 * out its own contrast, so they can't be CSS variables.
 */
export const createAppTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: {
      mode,
      primary: { main: mode === 'dark' ? '#c4483a' : '#8c2b22' },
      background: {
        paper: mode === 'dark' ? '#1a1d21' : '#f2f1ec',
        default: mode === 'dark' ? '#111316' : '#e9e9e4',
      },
      text: {
        primary: mode === 'dark' ? '#dcdad3' : '#16181c',
        secondary: mode === 'dark' ? '#8d929a' : '#5a5f66',
      },
      divider: mode === 'dark' ? '#2b2f35' : '#cbc9c2',
      // MUI's IconButton sets `color: action.active` from its own runtime
      // stylesheet, which outranks an equal-specificity rule in globals.css.
      action: { active: mode === 'dark' ? '#8d929a' : '#5a5f66' },
    },
    shape: { borderRadius: 0 },
    typography: {
      fontFamily: 'var(--font-data), system-ui, sans-serif',
      button: { letterSpacing: '0.12em', textTransform: 'uppercase' },
    },
    components: {
      MuiPaper: { defaultProps: { elevation: 0 }, styleOverrides: { root: { backgroundImage: 'none' } } },
      MuiDialog: {
        styleOverrides: {
          paper: { border: '1px solid var(--rule)' },
        },
      },
    },
  })
