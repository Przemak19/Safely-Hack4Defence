import './App.css'
import { RouterProvider } from "react-router-dom";
import { router } from "./config/router.tsx";
import { ThemeProvider } from "./config/ThemeProvider.tsx";
import { SnackbarProvider } from "./hooks/useSnackbar.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
    return (
        <ThemeProvider>
            <QueryClientProvider client={queryClient}>
                <SnackbarProvider>
                    <AuthProvider>
                        <RouterProvider router={router}/>
                    </AuthProvider>
                </SnackbarProvider>
            </QueryClientProvider>
        </ThemeProvider>
    )
}

export default App;
