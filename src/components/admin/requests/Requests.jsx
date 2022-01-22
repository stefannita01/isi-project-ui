import { useContext } from "react";
import { RequestsContext } from "../../../contexts/requestsContext";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import AcceptRequest from "./AcceptRequest";
import { observer } from "mobx-react-lite";

const Requests = observer(() => {
  const { requests } = useContext(RequestsContext);

  return (
    <>
      {requests.length ? (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell align="right">
                <strong>Pickup</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Drop-off</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Product name</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Product weight</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Product volume</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Product quantity</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Budget</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Client email</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell align="center">
                  <AcceptRequest
                    requestId={request.id}
                    weight={request.product.weight}
                    volume={request.product.volume}
                    quantity={request.quantity}
                  ></AcceptRequest>
                </TableCell>
                <TableCell align="right">
                  {request.pickupLocation.address}
                </TableCell>
                <TableCell align="right">
                  {request.dropOffLocation.address}
                </TableCell>
                <TableCell align="right">{request.product.type}</TableCell>
                <TableCell align="right">{request.product.weight} kg</TableCell>
                <TableCell align="right">{request.product.volume} l</TableCell>
                <TableCell align="right">{request.quantity}</TableCell>
                <TableCell align="right">{request.budget} €</TableCell>
                <TableCell align="right">{request.client.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>No requests.</p>
      )}
    </>
  );
});

export default Requests;
