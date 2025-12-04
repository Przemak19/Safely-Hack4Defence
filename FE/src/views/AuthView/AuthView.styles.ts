import {Box, Button, Card} from "@mui/material";
import {styled} from "@mui/material/styles";


const CardWrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
}));

const AuthButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
}));

const CustomCard = styled(Card)(() => ({
    width: '100%',
    maxWidth: 400,
}));

export const AuthViewStyles = {CardWrapper, AuthButton, CustomCard};