import { Typography } from "@mui/material";

const Banned = () => {
  return (
    <>
      <Typography variant="h4" color="error">
        You have been banned
      </Typography>
      <Typography variant="h5">
        Please contact administration for more details.
      </Typography>
    </>
  );
};

export default Banned;
