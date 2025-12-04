import {Box, Button, Card} from "@mui/material";
import {styled} from "@mui/material/styles";


const CardWrapper = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
}));

const CreateEventButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
}));

const CustomCard = styled(Card)(() => ({
    width: '70%',
}));

export const DashboardViewStyles = {CardWrapper, CreateEventButton: CreateEventButton, CustomCard};