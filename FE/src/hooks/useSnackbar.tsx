import { useState, createContext, useContext, type ReactNode } from 'react';
import { Snackbar, Alert } from '@mui/material';

type SnackbarContextType = {
    showSuccess: (message: string) => void;
    showError: (message: string) => void;
};

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState<'success' | 'error'>('success');

    const showSuccess = (msg: string) => {
        setSeverity('success');
        setMessage(msg);
        setOpen(true);
    };

    const showError = (msg: string) => {
        setSeverity('error');
        setMessage(msg);
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    return (
        <SnackbarContext.Provider value={{ showSuccess, showError }}>
            {children}

            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleClose} severity={severity} variant="filled">
                    {message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
};

export const useSnackbar = () => {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error("useSnackbar must be used inside <SnackbarProvider>");
    }
    return context;
};