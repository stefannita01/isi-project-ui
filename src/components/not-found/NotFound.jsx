import { Link, Outlet, useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      <div>
        <div>
          404: the page you were looking for was not found. Try these options
          instead:
        </div>
        <br></br>
        <div>
          <Link to="/">Home</Link>
        </div>
        <div>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate(-1);
            }}
          >
            Go back
          </a>
        </div>
      </div>
    </>
  );
};

export default NotFound;
