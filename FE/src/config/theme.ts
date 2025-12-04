import {createTheme} from "@mui/material/styles";

export const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#4caf50',
            light: '#81c784',
            dark: '#388e3c',
        },
        secondary: {
            main: '#66bb6a',
            light: '#a5d6a7',
            dark: '#43a047',
        },
        background: {
            default: '#f1f8e9',
            paper: '#ffffff',
        },
    },
});

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#90caf9',
            light: '#e3f2fd',
            dark: '#42a5f5',
        },
        secondary: {
            main: '#f48fb1',
            light: '#fce4ec',
            dark: '#ad1457',
        },
        background: {
            default: '#121212',
            paper: '#1e1e1e',
        },
    },
});