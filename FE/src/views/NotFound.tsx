import {Box, Typography, Link} from "@mui/material";
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();
    return (
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mt: 10, gap: 2}}>
            <QuestionMarkIcon sx={{fontSize: 120}}/>
            <Typography variant="h4">Page not found</Typography>
            <Link onClick={() => navigate('/')}>Go to main page</Link>
        </Box>
    );
}

export default NotFound;