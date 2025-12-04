import {
  AppBar,
  FormControlLabel,
  Switch,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  Button
} from "@mui/material";
import { useTheme } from "../hooks/useTheme.tsx";
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import { useNavigate } from "react-router-dom";
import { EmergencyNumbersPopover } from "./EmergencyNumbersPopover.tsx";
import { useState, type MouseEvent } from "react";
import SosIcon from '@mui/icons-material/Sos';
import { useAuth } from "../context/AuthContext.tsx";
import apiClient from "../api/ApiClient.ts";

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  const { user, checkAuth } = useAuth();

  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleEmergencyClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleEmergencyClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      await checkAuth();
      navigate('/auth');
    }
  };

  const isPopoverOpen = Boolean(anchorEl);

  return (
      <AppBar position="static">
        <Toolbar>
          <LocalPoliceIcon sx={{ mr: 1, color: "white", fontSize: 35 }} onClick={() => navigate('/home-page')} />
          <Typography
              variant="h4"
              component="div"
              sx={{
                flexGrow: 1,
                fontWeight: "bold",
                color: "#ffffffff",
                letterSpacing: 0.5,
              }}
          >
            Safely
          </Typography>

          <Tooltip title="Numery Alarmowe">
            <IconButton
                onClick={handleEmergencyClick}
                sx={{ mr: 2, color: "#ffffff" }}
            >
              <SosIcon fontSize="large" />
            </IconButton>
          </Tooltip>

          <EmergencyNumbersPopover
              open={isPopoverOpen}
              anchorEl={anchorEl}
              onClose={handleEmergencyClose}
          />

          <FormControlLabel
              control={
                <Switch
                    checked={isDarkMode}
                    onChange={toggleTheme}
                    color="default"
                />
              }
              label="Ciemny motyw"
              sx={{ mr: 2, color: "inherit" }}
          />

          {user && (
              <Button
                  color="inherit"
                  onClick={handleLogout}
                  sx={{ textTransform: 'none', fontSize: '1rem' }}
              >
                Logout
              </Button>
          )}
        </Toolbar>
      </AppBar>
  );
};

export default Navbar;