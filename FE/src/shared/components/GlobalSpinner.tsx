import { CircularProgress, Backdrop } from "@mui/material";

const GlobalSpinner = () => {
    return (
        <Backdrop
            open={true}
            sx={{
                color: "#fff",
                zIndex: 1000,
            }}
        >
            <CircularProgress size={80} thickness={4} />
        </Backdrop>
    );
};

export default GlobalSpinner;
