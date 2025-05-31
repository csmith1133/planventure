import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0'
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff'
    }
  },
  shape: {
    borderRadius: 12
  },
  components: {
    MuiPaper: {
      defaultProps: {
        elevation: 2
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600
        }
      }
    }
  }
});
