import { useState } from "react";

export const useSnack = () => {
  const defaultSnackState = { message: "", severity: "info", open: false };

  const [snack, setSnack] = useState(defaultSnackState);

  const setOpenSnack = (message, severity) =>
    setSnack({ message, severity, open: true });
  const setSuccessSnack = (message) => setOpenSnack(message, "success");
  const setInfoSnack = (message) => setOpenSnack(message, "info");
  const setWarningSnack = (message) => setOpenSnack(message, "warning");
  const setErrorSnack = (message) => setOpenSnack(message, "error");
  const setClosedSnack = () => setSnack(defaultSnackState);

  return [
    snack,
    {
      setSuccessSnack,
      setInfoSnack,
      setWarningSnack,
      setErrorSnack,
      setClosedSnack,
    },
  ];
};
