import { AppBar, Box, Toolbar, Button } from "@mui/material";
import { authStore } from "../../stores/authStore";
import { Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import { RequestsContext } from "../../contexts/requestsContext";
import { observer } from "mobx-react-lite";

const TopBar = observer(() => {
  const requestsStore = useContext(RequestsContext);
  useEffect(() => {
    requestsStore.initialize();
  }, [requestsStore]);

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="sticky">
          <Toolbar
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{
              mr: 2,
              justifyContent: requestsStore.requests.length
                ? "space-between"
                : "flex-end",
            }}
          >
            {requestsStore.requests.length ? (
              <Button color="inherit">
                <Link
                  style={{ textDecoration: "none", color: "inherit" }}
                  to="/track"
                >
                  Track
                </Link>
              </Button>
            ) : (
              <></>
            )}
            <Button color="inherit" onClick={authStore.logout}>
              Log Out
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
});

export default TopBar;
