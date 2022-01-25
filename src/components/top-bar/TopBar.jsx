import { AppBar, Box, Toolbar, Button } from "@mui/material";
import { authStore } from "../../stores/authStore";
import { Link } from "react-router-dom";
import { useContext, useEffect } from "react";
import { ContractsContext } from "../../contexts/contractsContext";
import { observer } from "mobx-react-lite";

const NavButton = ({ to, children }) => {
  return (
    <Button color="inherit">
      <Link style={{ textDecoration: "none", color: "inherit" }} to={to}>
        {children}
      </Link>
    </Button>
  );
};

const TopBar = observer(({ role }) => {
  const contractsStore = useContext(ContractsContext);
  useEffect(() => {
    contractsStore.initialize();
  }, [contractsStore]);

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
              justifyContent: "flex-end",
            }}
          >
            <NavButton to="/">Home</NavButton>
            {role === "CLIENT" && (
              <>
                {contractsStore.contracts.length > 0 && (
                  <NavButton to="/track">Track</NavButton>
                )}
              </>
            )}
            {role === "CARRIER" && (
              <>
                <NavButton to="/trucks">Trucks</NavButton>
              </>
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
