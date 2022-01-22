import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { CircularProgress, Typography } from "@mui/material";
import { useState } from "react";
import { EUserRole } from "../../../constants/EUserRole";

const UserRole = ({ user, updateRole, ban, unban }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = async (e) => {
    setIsLoading(true);
    await updateRole(user, e.target.value);
    setIsLoading(false);
  };

  return (
    <>
      {isLoading ? (
        <CircularProgress />
      ) : user.userRole === EUserRole.BANNED ? (
        <Typography variant="body2" color="error">
          User is banned.
        </Typography>
      ) : (
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Role</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Truck"
            value={user.userRole}
            onChange={handleChange}
          >
            {Object.entries(EUserRole)
              .filter(([key, _]) => key !== "BANNED" && key !== "ADMIN")
              .map(([key, value]) => (
                <MenuItem key={key} value={key}>
                  {wordToTitleCase(value)}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      )}
    </>
  );
};

export default UserRole;

const wordToTitleCase = (word) =>
  word
    .split("")
    .map((char, i) => (i === 0 ? char : char.toLowerCase()))
    .join("");
