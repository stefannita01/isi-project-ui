import { useContext } from "react";
import { RequestsContext } from "../../../contexts/requestsContext";
import { observer } from "mobx-react-lite";
import RequestCard from "./RequestCard";

const Requests = observer(() => {
  const { requests } = useContext(RequestsContext);

  return (
    <>
      {requests.length ? (
        requests.map((request) => (
          <RequestCard key={request.id} request={request} />
        ))
      ) : (
        <p>No requests.</p>
      )}
    </>
  );
});

export default Requests;
