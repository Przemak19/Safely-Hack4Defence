import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../hooks/useSnackbar";

interface NavButtonProps {
  text: string;
  navigateTo?: string;
}

const NavButton = ({ text, navigateTo }: NavButtonProps) => {
  const navigate = useNavigate();
  const { showSuccess } = useSnackbar();

  const handleClick = () => {
    if (text === "Logout") {
      localStorage.removeItem("token");
      navigate("/auth");
      showSuccess("Successfully logged out");
    } else if (navigateTo) {
      navigate(navigateTo);
    }
  };

  return (
    <Button
      variant="contained"
      sx={{
        backgroundColor: "#fff",
        color: "#000",
        mx: 1,
        "&:hover": {
          backgroundColor: "#f0f0f0",
        },
      }}
      onClick={handleClick}
    >
      {text}
    </Button>
  );
};

export default NavButton;
