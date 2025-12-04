import {Box} from "@mui/material";
import {Outlet} from "react-router-dom";
import Navbar from "./Navbar.tsx";

const Layout = () => {
    return (
        <Box>
            <Box sx={{ flexGrow: 1, color: 'white' }}>
                <Navbar/>
            </Box>
            <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                <Outlet />
            </Box>
        </Box>
    )
}

export default Layout;
