import { useContext, useEffect, useState } from "react";
import { usersService } from "../../../services/usersService";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Button, Box } from "@mui/material";
import UserRole from "./UserRole";
import { SnackbarContext } from "../../../contexts/snackbarContext";
import { EUserRole } from "../../../constants/EUserRole";

const Users = () => {
  const [users, setUsers] = useState([]);
  const { setSuccessSnack, setErrorSnack } = useContext(SnackbarContext);

  useEffect(() => {
    const initialize = async () => {
      const users = await usersService.getAll();
      setUsers(users);
    };

    initialize();
  }, []);

  const updateRole = async (user, role) => {
    try {
      const userIndex = users.findIndex((_user) => _user.id === user.id);
      const newUser = await usersService.updateRole(user, role);
      setUsers([
        ...users.slice(0, userIndex),
        newUser,
        ...users.slice(userIndex + 1),
      ]);
      setSuccessSnack("Successfully updated user");
    } catch (err) {
      setErrorSnack(err.message);
    }
  };
  const ban = async (user) => updateRole(user, EUserRole.BANNED);
  const unban = async (user) => updateRole(user, EUserRole.CLIENT);

  return (
    <>
      <Box sx={{ width: "75%", margin: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="left">
                <strong>Email</strong>
              </TableCell>
              <TableCell align="left">
                <strong>Role</strong>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell align="left">{user.email}</TableCell>
                <TableCell align="left">
                  <UserRole user={user} updateRole={updateRole}></UserRole>
                </TableCell>
                <TableCell align="left">
                  {user.userRole === EUserRole.BANNED ? (
                    <Button
                      type="button"
                      color="success"
                      onClick={() => unban(user)}
                    >
                      Unban
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      color="error"
                      onClick={() => ban(user)}
                    >
                      Ban
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </>
  );
};

export default Users;
