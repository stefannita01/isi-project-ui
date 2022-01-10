import { AppBar, Box, Toolbar, Button } from "@mui/material";
import { authStore } from "../../stores/authStore";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="sticky">
          <Toolbar
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, flexDirection: "row-reverse" }}
          >
            <Button color="inherit" onClick={authStore.logout}>
              Log Out
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
};

export default Home;
