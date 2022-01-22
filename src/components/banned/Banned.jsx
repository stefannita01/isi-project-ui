import { Typography } from "@mui/material";

const Banned = () => {
  return (
    <>
      <Typography variant="h2" color="error">
        You have been banned
      </Typography>
      <Typography variant="body1">
        Please contact administration for more details.
      </Typography>
    </>
  );
};

export default Banned;
